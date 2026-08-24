/* global window */
// ============ Blacklake Careers v6 · Data (EN · Living Factory) ============

const JOBS = [
  { id: "ai-001", title: "Industrial LLM Application Engineer", team: "AI · Industrial LLM", category: "AI · ML", loc: "Shanghai", type: "Full-time", level: "P6-P7",
    desc: "Train and fine-tune industry-specific foundation models on real factory data — teaching models to truly read drawings, process flows, documents, and the language of the shop floor.",
    resp: ["Train, fine-tune, and evaluate industry LLMs on Blacklake's proprietary industrial data", "Distill model capabilities into a reusable industrial-agent foundation", "Ship models onto real production lines with engineering & product, all the way to stable operation"],
    req: ["Solid LLM / deep-learning fundamentals; fluent with mainstream training & fine-tuning frameworks", "Hands-on experience with LLM deployment, RAG, Agents, or multimodal", "Willing to embed at a factory for a real scenario — not just chase benchmarks"] },
  { id: "ai-002", title: "AI Agent Engineer · Industrial Agents", team: "AI · Agents", category: "AI · ML", loc: "Shanghai", type: "Full-time", level: "P6",
    desc: "Turn the factory's heaviest decisions — order splitting, scheduling, order tracking, quality inspection — into agents that act autonomously. From AI-assisted to AI-autonomous decisions.",
    resp: ["Design and build industrial agents across design / scheduling / production / quality", "Refine agent tool-use, planning, reflection, and human-in-the-loop mechanisms", "Wire agents into real work-order flows; own execution accuracy and ROI"],
    req: ["Familiar with Agent / function calling / workflow orchestration", "Strong engineering — able to turn uncertain model behavior into reliable products", "Conviction about making AI *actually do the work*, not demo it"] },
  { id: "ai-003", title: "Multimodal Engineer · Industrial Vision", team: "AI · Perception", category: "AI · ML", loc: "Shanghai", type: "Full-time", level: "P6",
    desc: "Help machines read the drawings, documents, handwritten work tickets, and line footage inside a factory — the perception layer behind AI order entry, AI order splitting, and visual inspection.",
    resp: ["Build models for drawing/document recognition, handwriting OCR, and line-side visual inspection", "Connect multimodal perception with the agents above it", "Close the data loop on-site so models get sharper with use"],
    req: ["CV / multimodal background; hands-on with OCR, detection, segmentation", "Solid SQL / Python; able to take data through to deployment independently", "Industrial, document-intelligence, or visual-inspection experience a plus"] },
  { id: "pd-001", title: "AI Product Manager · Industrial Agents", team: "Product", category: "Product", loc: "Shanghai / Shenzhen", type: "Full-time", level: "P6",
    desc: "Define industrial-agent products — decide which factory decisions AI takes on first, and how to make veterans actually want to use it.",
    resp: ["Embed on the factory floor to find the decisions most worth handing to AI", "Define agent product form, the human–machine boundary, and success metrics", "Ship it onto real lines with algorithms, engineering & delivery"],
    req: ["3+ years ToB product experience; genuine grasp of AI / data products", "Manufacturing / supply chain / industrial-software background preferred", "Willing to spend at least 1 week per month at factories"] },
  { id: "eng-001", title: "Senior Full-stack Engineer · Collaboration Platform", team: "Product & Engineering", category: "Engineering", loc: "Shanghai / Remote", type: "Full-time", level: "P6-P7",
    desc: "Build the cloud-native, API-first collaboration platform — where every business module can be invoked as an agent. This is the foundation that makes AI a native capability at Blacklake.",
    resp: ["Lead architecture design & evolution of core modules, refactored for agents", "Co-build agent-invocable business APIs with the algorithms team", "Polish the workshop-facing workstation experience and performance baseline"],
    req: ["5+ years experience; strong in React / TypeScript or backend, competent across the stack", "Deep hands-on with complex state management, API design, performance optimization", "ToB / industrial / collaboration product experience preferred; willing to visit sites"] },
  { id: "ops-001", title: "Solutions Architect · Industry", team: "Solutions", category: "Solutions", loc: "Shanghai / Guangzhou", type: "Full-time", level: "P6",
    desc: "Codify an industry's know-how into agents and replicable solutions — your experience becomes the AI's experience.",
    resp: ["Lead industry solution design and customer presentations", "Distill best practices into standardized, agent-reusable capabilities", "Co-plan industry versions with product & algorithms"],
    req: ["5+ years in automotive / food & beverage / equipment / FMCG", "Understands factories and operations; turns fuzzy needs into clear solutions", "OEM, Tier 1, or leading-manufacturer background a strong plus"] },
  { id: "cs-001", title: "Customer Success Manager · East China", team: "Customer Success", category: "Delivery", loc: "Suzhou / Changzhou", type: "Full-time", level: "P5",
    desc: "As the customer's primary owner, help factories truly adopt Blacklake's products and agents — and get real value from them.",
    resp: ["Own renewal & expansion for a vertical / regional portfolio", "On-site at critical milestones, driving change and AI adoption with factories", "Bring frontline feedback back to product & algorithms"],
    req: ["3+ years ToB customer success or consulting experience", "Manufacturing / supply chain background preferred", "Comfortable with frequent travel"] },
  { id: "gl-001", title: "Overseas Delivery Manager · SEA", team: "Overseas", category: "Delivery", loc: "Singapore / Vietnam", type: "Full-time", level: "P6",
    desc: "Bring the products and agents proven in Chinese factories onto production lines across Southeast Asia.",
    resp: ["Own delivery & deployment for Southeast Asia customers", "Embed on-site; get things done across cultures and languages", "Distill a replicable overseas delivery playbook"],
    req: ["Overseas project delivery or expatriate experience", "English as a working language; SEA languages a plus", "Comfortable with long-term overseas stationing"] },
  { id: "intern-001", title: "AI / ML Intern (Class of 2026)", team: "AI", category: "Internship", loc: "Shanghai", type: "Internship", level: "Intern",
    desc: "Work with the algorithms team to ship LLMs into real factories. Not exercises.",
    resp: ["Join real projects across industrial LLMs, agents, and industrial vision", "Own a link in the data / training / evaluation / deployment chain", "Go to factories, run research, close the data loop"],
    req: ["Available 4+ days/week for 3+ months", "Solid ML / NLP / CV fundamentals, with project or paper experience", "Curious about real-world industrial AI"] },
];

// ── Feishu hiring portal ──
const RECRUIT_URL = "https://YOUR-FEISHU-RECRUIT-URL"; // TODO: replace with the real Feishu hiring URL

const CATEGORIES = ["AI · ML", "Product", "Engineering", "Solutions", "Delivery", "Internship"];

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
const QUESTIONS = [
  { q: "Does the model truly understand a complex drawing?",            tag: "AI RESEARCH",       cat: "AI · ML" },
  { q: "How does a veteran's decade of experience become capability?",  tag: "PRODUCT",           cat: "Product" },
  { q: "When the floor changes, how does an agent re-decide?",          tag: "AGENT ENGINEERING", cat: "AI · ML" },
  { q: "Should AI advise — or should it act?",                          tag: "PRODUCT · DESIGN",  cat: "Product" },
];

// ── 07 Jobs ──
const JOB_NODES = [
  { cat: "AI · ML",     en: "RESEARCH",    note: "at the intelligence node" },
  { cat: "Engineering", en: "ENGINEERING", note: "at the system node" },
  { cat: "Product",     en: "PRODUCT",     note: "between users and factories" },
  { cat: "Solutions",   en: "SOLUTIONS",   note: "inside industry know-how" },
  { cat: "Delivery",    en: "DELIVERY",    note: "on real production lines" },
  { cat: "Internship",  en: "INTERN",      note: "on the front line" },
];
const SYSTEM_FLOW = ["ORDER", "DRAWING", "INTELLIGENCE", "DECISION", "FACTORY"];

Object.assign(window, {
  JOBS, CATEGORIES, RECRUIT_URL, CHAPTERS,
  IMPACT_SHOTS, QUESTIONS, JOB_NODES, SYSTEM_FLOW,
});
