/* global window */
// ============ Blacklake Careers v6 · 数据（流动的工厂） ============

const JOBS = [
  { id: "ai-001", title: "工业大模型应用工程师", team: "AI · 工业大模型", category: "AI · 算法", loc: "上海", type: "全职", level: "P6-P7",
    desc: "用真实工厂的数据，训练、微调面向制造的行业大模型，让模型真正读懂图纸、工艺、单据与车间语言。",
    resp: ["基于黑湖独有的工业数据，做行业大模型的训练、微调与评测", "把模型能力沉淀成可复用的工业智能体底座", "与工程、产品一起把模型送进真实产线，跟到稳定可用"],
    req: ["扎实的 LLM / 深度学习功底，熟悉主流训练与微调框架", "有大模型落地、RAG、Agent、或多模态的一手经验", "愿意为了一个真实场景去工厂蹲点，而不是只看 benchmark"] },
  { id: "ai-002", title: "AI Agent 工程师 · 工业智能体", team: "AI · 智能体", category: "AI · 算法", loc: "上海", type: "全职", level: "P6",
    desc: "把拆单、排程、跟单、质检这些工厂里最重的决策，做成能自主执行的工业智能体——从 AI 辅助决策，走向 AI 自主决策。",
    resp: ["设计、构建覆盖设计/排程/生产/质检的工业智能体", "打磨 Agent 的工具调用、规划、反思与人机协同机制", "把智能体接入真实工单流，对执行准确率与回报负责"],
    req: ["熟悉 Agent / function calling / workflow 编排", "工程能力强，能把不确定的模型行为做成可靠的产品", "对'让 AI 真正干活'而非'演示'有执念"] },
  { id: "ai-003", title: "多模态算法工程师 · 工业视觉", team: "AI · 感知", category: "AI · 算法", loc: "上海", type: "全职", level: "P6",
    desc: "让机器看懂工厂里的图纸、单据、手写工票与产线画面——AI 下单、AI 拆单、视觉质检的底层感知能力。",
    resp: ["构建图纸/单据识别、手写 OCR、产线视觉质检的模型能力", "把多模态感知与上层智能体打通", "在客户现场做数据闭环，让模型越用越准"],
    req: ["CV / 多模态背景，OCR、检测、分割有一手经验", "SQL / Python 扎实，能独立跑通数据到部署", "有工业、文档智能或视觉质检经验尤佳"] },
  { id: "pd-001", title: "AI 产品经理 · 工业智能体", team: "产品", category: "产品", loc: "上海 / 深圳", type: "全职", level: "P6",
    desc: "定义工业智能体产品——决定 AI 在工厂里先替人做哪件事、怎么做得让老师傅愿意用。",
    resp: ["深入工厂一线，找到最值得交给 AI 的决策场景", "定义智能体的产品形态、人机边界与衡量标准", "与算法、工程、交付一起把它落到真实产线"],
    req: ["3 年以上 ToB 产品经验，对 AI / 数据类产品有真实理解", "制造业 / 供应链 / 工业软件背景优先", "愿意每个月至少一周在工厂"] },
  { id: "eng-001", title: "资深全栈工程师 · 协同平台", team: "产品研发", category: "工程", loc: "上海 / 远程", type: "全职", level: "P6-P7",
    desc: "构建云原生、API 优先的协同平台——让每一个业务模块都能以 Agent 的方式被调用，这是黑湖把 AI 做成原生能力的底座。",
    resp: ["主导核心模块的架构设计与演进，面向 Agent 化重构", "与算法团队共建可被智能体调用的业务 API", "打磨面向车间一线的工作台体验与性能基线"],
    req: ["5 年以上工程经验，精通 React / TypeScript 或服务端其一并通另一端", "对复杂状态管理、API 设计、性能优化有一手深度经验", "有 ToB、工业、协作类产品经验优先，愿意定期去现场"] },
  { id: "ops-001", title: "解决方案架构师 · 行业", team: "解决方案", category: "解决方案", loc: "上海 / 广州", type: "全职", level: "P6",
    desc: "把一个行业的 know-how，固化成智能体和可复制的解决方案——你的经验会变成 AI 的经验。",
    resp: ["主导行业方案设计与客户讲解", "把行业最佳实践沉淀成标准化、可被智能体复用的能力", "与产品、算法共同规划行业版本"],
    req: ["汽车 / 食品饮料 / 装备 / 快消 任一行业 5 年以上经验", "懂工厂、懂业务，能把模糊需求讲成清晰方案", "有主机厂、Tier1 或头部制造企业背景尤佳"] },
  { id: "cs-001", title: "客户成功经理 · 华东", team: "客户成功", category: "交付", loc: "苏州 / 常州", type: "全职", level: "P5",
    desc: "作为客户的主责人，陪工厂把黑湖的产品与智能体真正用起来、用出价值。",
    resp: ["对一个行业 / 片区的客户续约与扩展负责", "在关键节点驻场，与工厂一起推进变革与 AI 落地", "把一线反馈带回产品与算法团队"],
    req: ["3 年以上 ToB 客户成功或咨询经验", "有制造业、供应链背景优先", "能接受频繁差旅"] },
  { id: "gl-001", title: "海外交付经理 · 东南亚", team: "海外", category: "交付", loc: "新加坡 / 越南", type: "全职", level: "P6",
    desc: "把中国工厂验证过的产品与智能体，带到东南亚的产线上。",
    resp: ["负责东南亚区域客户的交付与落地", "驻场推进项目，跨文化、跨语言把事做成", "沉淀可复制的海外交付方法"],
    req: ["有海外项目交付或驻外经验", "英语可作为工作语言，东南亚语言加分", "能接受长期驻外"] },
  { id: "intern-001", title: "AI / 算法实习生 (2026 届)", team: "AI", category: "实习 / 校招", loc: "上海", type: "实习", level: "Intern",
    desc: "和算法团队一起，把大模型送进真实工厂。不是做练习题。",
    resp: ["参与工业大模型、智能体、工业视觉的真实项目", "负责数据、训练、评测、或落地链路中的一环", "一起去工厂、做调研、跑数据闭环"],
    req: ["每周 4 天起，持续 3 个月以上", "ML / NLP / CV 功底扎实，有项目或论文经历", "对工业 AI 真实落地有好奇心"] },
];

// ── 飞书招聘官网（岗位全在飞书，站内点击跳转）──
const RECRUIT_URL = "https://YOUR-FEISHU-RECRUIT-URL"; // TODO: 替换为真实飞书招聘官网地址

const CATEGORIES = ["AI · 算法", "产品", "工程", "解决方案", "交付", "实习 / 校招"];

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
const QUESTIONS = [
  { q: "一张复杂图纸，模型真的理解了吗？",     tag: "AI RESEARCH",       cat: "AI · 算法" },
  { q: "老师傅十年的经验，怎么变成系统能力？", tag: "PRODUCT",           cat: "产品" },
  { q: "现场发生变化，Agent 怎么重新决策？",   tag: "AGENT ENGINEERING", cat: "AI · 算法" },
  { q: "AI 到底应该建议，还是应该行动？",      tag: "PRODUCT · DESIGN",  cat: "产品" },
];

// ── 07 Jobs：这个系统里，哪一部分是你想参与构建的 ──
const JOB_NODES = [
  { cat: "AI · 算法",   en: "RESEARCH",    note: "在智能节点" },
  { cat: "工程",        en: "ENGINEERING", note: "在系统节点" },
  { cat: "产品",        en: "PRODUCT",     note: "在用户和工厂之间" },
  { cat: "解决方案",    en: "SOLUTIONS",   note: "在行业 know-how 里" },
  { cat: "交付",        en: "DELIVERY",    note: "在真实产线上" },
  { cat: "实习 / 校招", en: "INTERN",      note: "在第一线" },
];
const SYSTEM_FLOW = ["订单", "图纸", "INTELLIGENCE", "决策", "工厂"];

Object.assign(window, {
  JOBS, CATEGORIES, RECRUIT_URL, CHAPTERS,
  IMPACT_SHOTS, QUESTIONS, JOB_NODES, SYSTEM_FLOW,
});
