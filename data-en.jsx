/* global window */
// ============ Blacklake Careers v6 · Data (EN · Living Factory) ============

// ── Job data is now a full mirror ──
// Source: jobs.json (synced daily from the Feishu Hire portal by scripts/sync_jobs.py — do not edit by hand).
// app.jsx fetches jobs.json on boot and passes the list down to JobsScene / JobsDrawer.
// Apply-link rule: https://blacklake.jobs.feishu.cn/index/position/{jobPostId}/detail

// ── Feishu hiring portal ──
const RECRUIT_URL = "https://blacklake.jobs.feishu.cn/index/position/list";

// ── Chapter coordinates ──
const CHAPTERS = [
  { key: "hero",     label: "INTELLIGENCE" },
  { key: "impact",   label: "IMPACT" },
  { key: "frontier", label: "FRONTIER" },
  { key: "jobs",     label: "JOBS" },
];

// ── 04 Impact ──
const IMPACT_SHOTS = [
  { img: "assets/scene-mold.jpg", alt: "Macro shot of mold tooling: precision cavity and copper bushings, a gloved hand placing a part",
    cap: "Tooling set", read: "Order BL-2401 · takt to the second" },
  { img: "assets/scene-line.jpg", alt: "Filling line: bottles flowing continuously on the conveyor",
    cap: "Line running", read: "12,000/h · live data feedback" },
  { img: "assets/scene-hall.jpg", alt: "Machine shop panorama: crane, machines, and a sunlit aisle",
    cap: "Closed loop", read: "36 WIP orders · one shared order" },
];

// ── 05 Frontier ──
// Note: cat is semantic only; drawer filters are generated dynamically per business line, unknown cats fall back to All.
const QUESTIONS = [
  { q: "Does the model truly understand a complex drawing?",            tag: "AI RESEARCH",       cat: "AI · ML" },
  { q: "How does a veteran's decade of experience become capability?",  tag: "PRODUCT",           cat: "Product" },
  { q: "When the floor changes, how does an agent re-decide?",          tag: "AGENT ENGINEERING", cat: "AI · ML" },
  { q: "Should AI advise — or should it act?",                          tag: "PRODUCT · DESIGN",  cat: "Product" },
];

// ── Strategic priority of function categories (the site serves research-savvy,
//    strategic-role candidates; tech/product lead, sales last) ──
// Keys must stay in sync with CATEGORY_RULES in scripts/sync_jobs.py.
const CAT_ORDER = ["技术", "产品", "设计", "解决方案与交付", "客户成功", "市场", "运营", "职能", "销售"];

const SYSTEM_FLOW = ["ORDER", "DRAWING", "INTELLIGENCE", "DECISION", "FACTORY"];

Object.assign(window, {
  RECRUIT_URL, CHAPTERS, CAT_ORDER,
  IMPACT_SHOTS, QUESTIONS, SYSTEM_FLOW,
});
