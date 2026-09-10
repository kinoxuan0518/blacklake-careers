#!/usr/bin/env python3
"""同步飞书招聘官网在招职位 → jobs.json

数据源：飞书招聘 OpenAPI（GET /open-apis/hire/v1/websites/{website_id}/job_posts）
投递链接规则：https://blacklake.jobs.feishu.cn/index/position/{id}/detail（id = 职位广告 ID）

两种认证方式：
  1) 环境变量（GitLab CI 用）：FEISHU_APP_ID + FEISHU_APP_SECRET（自建应用，需 scope hire:site:readonly / hire:site_job_post:readonly）
  2) --lark-cli（本机用）：通过本机已登录的 lark-cli 调用

用法：
  python3 scripts/sync_jobs.py --lark-cli                # 本机（lark-cli 登录态）
  python3 scripts/sync_jobs.py                           # CI（读环境变量）
  python3 scripts/sync_jobs.py --website-id 6976825782060747038
"""
import argparse
import json
import os
import subprocess
import sys
import urllib.request

API_BASE = "https://open.feishu.cn/open-apis"
PORTAL_URL_TPL = "https://blacklake.jobs.feishu.cn/index/position/{id}/detail"
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "jobs.json")
DEFAULT_WEBSITE_NAME = "社招官网"

# 职能分类：按标题关键词从上到下首个命中（顺序敏感，勿随意调换）
# 例：「KA项目经理」须先于「销售」命中「项目经理」；「实施顾问」归客户成功而非交付
CATEGORY_RULES = [
    ("技术",         "Technology",          ["工程师", "算法", "开发", "架构", "前端", "后端", "AI"]),
    ("产品",         "Product",             ["产品经理", "产品总监", "产品"]),
    ("客户成功",     "Customer Success",    ["客户成功", "实施", "客户经理"]),
    ("解决方案与交付", "Solutions & Delivery", ["解决方案", "项目经理", "项目顾问", "交付", "质量控制"]),
    ("销售",         "Sales",               ["销售", "渠道经理", "大客户", "电销", "KA", "商务"]),
    ("市场",         "Marketing",           ["市场", "品牌", "增长"]),
    ("运营",         "Operations",          ["运营"]),
    ("设计",         "Design",              ["设计师", "设计", "ue", "ux", "视觉"]),
    ("职能",         "Corporate Functions", ["hr", "人力资源", "招聘", "人才发展", "会计", "财务", "采购", "法务", "行政"]),
]


def classify(title):
    t = (title or "").lower()
    for zh, en, kws in CATEGORY_RULES:
        if any(kw.lower() in t for kw in kws):
            return {"zh": zh, "en": en}
    return {"zh": "其他", "en": "Other"}


def http_json(url, params=None, headers=None, data=None):
    if params:
        from urllib.parse import urlencode
        url = url + ("&" if "?" in url else "?") + urlencode(params)
    req = urllib.request.Request(url, headers=headers or {},
                                 data=json.dumps(data).encode() if data else None,
                                 method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def token_via_env():
    app_id = os.environ.get("FEISHU_APP_ID")
    secret = os.environ.get("FEISHU_APP_SECRET")
    if not (app_id and secret):
        sys.exit("缺少 FEISHU_APP_ID / FEISHU_APP_SECRET 环境变量")
    d = http_json(f"{API_BASE}/auth/v3/tenant_access_token/internal",
                  data={"app_id": app_id, "app_secret": secret})
    if d.get("code") != 0:
        sys.exit(f"获取 tenant_access_token 失败: {d}")
    return {"Authorization": f"Bearer {d['tenant_access_token']}"}


def lark_cli_get(path, params):
    r = subprocess.run(
        ["lark-cli", "api", "GET", path, "--params", json.dumps(params),
         "--as", "bot", "--format", "json"],
        capture_output=True, text=True)
    d = json.loads(r.stdout)
    if not d.get("ok"):
        sys.exit(f"lark-cli 调用失败 {path}: {json.dumps(d.get('error', d), ensure_ascii=False)}")
    return d["data"]


def pick_website_id(headers, website_id, website_name):
    if website_id:
        return website_id
    if headers:
        items = http_json(f"{API_BASE}/hire/v1/websites", headers=headers).get("data", {}).get("items", [])
    else:
        items = lark_cli_get("/hire/v1/websites", {}).get("items", [])
    for it in items:
        name = (it.get("name") or {})
        if website_name in (name.get("zh_cn") or "", name.get("en_us") or ""):
            return it["id"]
    sys.exit(f"未找到名为「{website_name}」的招聘官网，现有: {[it.get('name') for it in items]}")


def fetch_jobs(headers, website_id):
    jobs, page_token = [], ""
    while True:
        params = {"page_size": 10}
        if page_token:
            params["page_token"] = page_token
        data = (http_json(f"{API_BASE}/hire/v1/websites/{website_id}/job_posts",
                          params=params, headers=headers).get("data", {})
                if headers else lark_cli_get(f"/hire/v1/websites/{website_id}/job_posts", params))
        for it in data.get("items", []):
            if it.get("job_active_status") not in (None, 1):
                continue  # 已禁用的广告不展示
            jobs.append(it)
        if not data.get("has_more") or not data.get("page_token"):
            return jobs
        page_token = data["page_token"]


def i18n(obj, key):
    if isinstance(obj, dict):
        v = obj.get(key)
        if isinstance(v, dict):
            return {"zh": v.get("zh_cn") or "", "en": v.get("en_us") or ""}
    return {"zh": "", "en": ""}


def transform(raw):
    out = []
    for it in raw:
        dept_name = (it.get("job_department") or {}).get("name") or {}
        dept = {"zh": dept_name.get("zh_cn") or "", "en": dept_name.get("en_us") or ""}
        cities, seen = [], set()
        for addr in (it.get("address_list") or []):
            city = (addr.get("city") or {}).get("name") or {}
            zh, en = city.get("zh_cn") or "", city.get("en_us") or ""
            if zh and zh not in seen:
                seen.add(zh)
                cities.append({"zh": zh, "en": en})
        ms = it.get("modify_time") or it.get("create_time") or ""
        updated = ""
        if ms:
            updated = __import__("datetime").datetime.fromtimestamp(
                int(ms) / 1000).strftime("%Y-%m-%d %H:%M")
        out.append({
            "id": it.get("id"),
            "code": it.get("job_code") or "",
            "title": it.get("title") or "",
            "cat": classify(it.get("title")),
            "dept": dept,
            "city": cities,
            "url": PORTAL_URL_TPL.format(id=it.get("id")),
            "updated_at": updated,
        })
    out.sort(key=lambda j: (j["dept"]["zh"], j["title"]))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lark-cli", action="store_true", help="用本机 lark-cli 登录态调用")
    ap.add_argument("--website-id", default=os.environ.get("FEISHU_WEBSITE_ID", ""))
    ap.add_argument("--website-name", default=DEFAULT_WEBSITE_NAME)
    args = ap.parse_args()

    headers = None if args.lark_cli else token_via_env()
    website_id = pick_website_id(headers, args.website_id, args.website_name)
    raw = fetch_jobs(headers, website_id)
    jobs = transform(raw)

    # generated_at 取职位数据的最大更新时间而非当前时间：
    # 数据无变化时两次生成的文件完全一致，避免定时任务产生空提交
    generated = max((j["updated_at"] for j in jobs), default="")
    payload = {
        "generated_at": generated,
        "website_id": website_id,
        "website_name": args.website_name,
        "count": len(jobs),
        "jobs": jobs,
    }
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"✓ 同步完成：{len(jobs)} 个在招职位 → jobs.json（官网 {website_id}）")


if __name__ == "__main__":
    main()
