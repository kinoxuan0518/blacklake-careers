/* global window */
// ============ Blacklake Careers v6 · 数据（流动的工厂） ============

// ── 职位数据已改为全量镜像 ──
// 数据源：jobs.json（由 scripts/sync_jobs.py 从飞书招聘「社招官网」同步生成，勿手改）。
// app.jsx 启动时 fetch jobs.json，把职位数组下发给 JobsScene / JobsDrawer。
// 投递链接规则：https://blacklake.jobs.feishu.cn/index/position/{职位广告id}/detail

// ── 飞书招聘官网（岗位全在飞书，站内点击跳转）──
const RECRUIT_URL = "https://blacklake.jobs.feishu.cn/index/position/list";

// ── 章节坐标（Tab = 快速跃迁，看到同一个空间）──
const CHAPTERS = [
  { key: "hero",     label: "INTELLIGENCE" },
  { key: "impact",   label: "IMPACT" },
  { key: "frontier", label: "FRONTIER" },
  { key: "jobs",     label: "JOBS" },
];

// ── 04 Impact：数字世界 → 真实世界（真实车间影像）──
const IMPACT_SHOTS = [
  { img: "assets/scene-mold.jpg", alt: "模具工装微距：精密型腔与铜套，戴手套的手正在安放零件",
    cap: "工装就位", read: "工单 BL-2401 · 节拍精确到秒" },
  { img: "assets/scene-line.jpg", alt: "灌装产线：瓶装液体在传送带上连续流动",
    cap: "产线执行", read: "产能 12,000/h · 数据实时回传" },
  { img: "assets/scene-hall.jpg", alt: "机加工车间全景：行车、机床与阳光下的通道",
    cap: "全局闭环", read: "在制工单 36 · 同一张工单" },
];

// ── 05 Frontier：很多问题，还没有答案（自然投递口）──
// 注：cat 字段仅作语义标注；抽屉筛选已按「业务线」动态生成，未知分类会自动归入「全部」。
const QUESTIONS = [
  { q: "一张复杂图纸，模型真的理解了吗？",     tag: "AI RESEARCH",       cat: "AI · 算法" },
  { q: "老师傅十年的经验，怎么变成系统能力？", tag: "PRODUCT",           cat: "产品" },
  { q: "现场发生变化，Agent 怎么重新决策？",   tag: "AGENT ENGINEERING", cat: "AI · 算法" },
  { q: "AI 到底应该建议，还是应该行动？",      tag: "PRODUCT · DESIGN",  cat: "产品" },
];

// ── 职能类目的战略优先级（官网服务于会背调的战略岗候选人）──
// 节点、筛选、列表均按此顺序展示：技术/产品/设计等战略职能打头，销售类靠后。
// 与 scripts/sync_jobs.py 里 CATEGORY_RULES 的类目名保持一致。
const CAT_ORDER = ["技术", "产品", "设计", "解决方案与交付", "客户成功", "市场", "运营", "职能", "销售"];

const SYSTEM_FLOW = ["订单", "图纸", "INTELLIGENCE", "决策", "工厂"];

Object.assign(window, {
  RECRUIT_URL, CHAPTERS, CAT_ORDER,
  IMPACT_SHOTS, QUESTIONS, SYSTEM_FLOW,
});
