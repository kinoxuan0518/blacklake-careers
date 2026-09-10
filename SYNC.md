# 职位数据自动同步（Plan A · GitLab 定时流水线）

官网职位列表是**飞书招聘社招官网的全量镜像**，数据文件 `jobs.json` 由脚本生成，**不要手改**。

## 数据链路

```
飞书招聘（社招官网 6976825782060747038）
  └─ OpenAPI: GET /open-apis/hire/v1/websites/{id}/job_posts
       └─ scripts/sync_jobs.py 拉取 + 字段映射
            └─ jobs.json（提交进仓库，前端启动时 fetch）
```

投递链接规则（已实测验证）：`https://blacklake.jobs.feishu.cn/index/position/{职位广告id}/detail`

## 本地手动同步（随时可跑）

```bash
python3 scripts/sync_jobs.py --lark-cli   # 用本机 lark-cli 登录态
git add jobs.json && git commit -m "sync: 刷新在招职位" && git push
```

## GitLab 定时流水线（全自动，一次性配置）

`.gitlab-ci.yml` 里的 `sync-jobs` job 只在 **scheduled pipeline** 触发时运行：
拉取最新职位 → 有变化则自动 commit 并 push 回仓库。

启用步骤（项目所有人在 GitLab 页面上操作，约 3 分钟）：

1. **配凭据**：项目 → Settings → CI/CD → Variables，添加（均勾 Masked）：
   - `FEISHU_APP_ID` / `FEISHU_APP_SECRET`：自建应用凭证（需已开通 scope
     `hire:site:readonly` + `hire:site_job_post:readonly`，只读权限）
   - `GL_PUSH_TOKEN`：Project Access Token（角色 Maintainer、scope `write_repository`），
     供 CI 把新的 jobs.json 推回仓库
2. **配计划**：项目 → Build → Pipelines schedules → 新建（如每天 07:00 北京时间），目标分支 `main`
3. 手动点一次 "Run now" 验证：应看到 jobs.json 出现机器人的同步提交

### 可选：同步 GitHub 镜像

当前线上站点跑在 GitHub Pages。若要让定时同步的结果也推到 GitHub，
再加一个 CI Variable `GH_PUSH_TOKEN`（GitHub PAT，repo 权限），
并取消 `.gitlab-ci.yml` 中「推 GitHub」步骤的注释。

## 注意

- 应用凭证只放 GitLab CI Variables（Masked），**严禁写进仓库或前端代码**
- HR 在飞书招聘后台发布/下架职位广告后，最长一个同步周期（1 天）内自动反映到官网
- 校招职位在另一个门户（校招官网），如需接入，给 sync 脚本换 `--website-id` 再跑一份
