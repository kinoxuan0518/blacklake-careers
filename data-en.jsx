/* global window */
// ============ Heihu Careers v2 · Data (EN) ============

const VALUES = [
  { idx: "01", title: "Intelligent Humility", meta: "In factories, the wisest people often wear work uniforms. We listen first, ask first, learn first — then speak." },
  { idx: "02", title: "Pragmatic Optimism", meta: "We believe Chinese manufacturing deserves better tools. But belief isn't a slogan — it's an agent running on a real production line, an on-site debug session, an iteration after overtime." },
  { idx: "03", title: "Grow on the Factory Floor", meta: "We embed in workshops, production lines, and beside engineers' screens. Real insight comes from the factory floor, not the boardroom." },
  { idx: "04", title: "Make Complexity Simple", meta: "Manufacturing is complex. Our job is to make it so a frontline worker gets it at a glance, and a manager instantly sees what's happening." },
];

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

const CATEGORIES = ["All", "AI · ML", "Product", "Engineering", "Solutions", "Delivery", "Internship"];
const LOCATIONS = ["All Cities", "Shanghai", "Shenzhen", "Guangzhou", "Suzhou / Changzhou", "Singapore", "Remote"];

const STORIES = [
  { name: "Icy", fullName: "Icy · Employee No.3", role: "Commercial · 9 years", quote: "It was the mission that first attracted me. Later we'd have heated debates about fold-ear-root, get excited about cosplay at the annual party. Candid, simple, open, fun — I can't find a reason to leave.", team: "Commercial" },
  { name: "Shaw", fullName: "Shaw · Head of Marketing", role: "Brand · 8 years", quote: "My resume was 4,000 words, red-bolded, and got thrown in the trash. Then it got fished back out. The recruiter said: this person is either a genius or genuinely eccentric.", team: "Marketing" },
  { name: "Leo", fullName: "Leo · South China AM", role: "Field Sales · 4 years", quote: "Getting chased out by security, getting scolded by a factory boss — totally normal. Freezing rain, broken car AC, soaked through, still out there hustling — all for the win.", team: "Sales" },
  { name: "Jenny", fullName: "Jenny · AI Product Lead", role: "AI Manufacturing · 2 years", quote: "To explore AI-driven flexible quick-turn, I gave up my Shanghai apartment, shipped my Tesla to Dongguan, and embedded in the workshop. When rush orders came, I sat on the line packing with workers.", team: "AI Manufacturing" },
  { name: "Peter", fullName: "Peter · Data Scientist", role: "Algorithms · 3 years", quote: "The order-splitting agent hit 92% accuracy — about 8 out of 100 steps go wrong. A veteran worker spends 15 minutes correcting, instead of 2-3 hours before. Those corrections get recorded, forming a second round of learning.", team: "AI" },
  { name: "Kevin", fullName: "Kevin · Overseas Delivery", role: "Mexico Project · 1 year", quote: "Stationed in Puebla, Mexico — no Chinese food for a month, too dangerous to go out at night. The warehouse manager lady said: because of Blacklake's product, she walks less in the warehouse now. She's gained weight.", team: "Overseas" },
];

const PERKS = [
  { idx: "01", t: "Field Subsidies & Travel", d: "Full reimbursement for factory trips; extra workshop allowances. The intelligence gained is never something we skimp on." },
  { idx: "02", t: "AI Budget", d: "No fixed cap. Any useful AI tool is reimbursable — we think this investment always pays off." },
  { idx: "03", t: "Equity & Long-term", d: "We believe in doing something hard and right for the long run." },
  { idx: "04", t: "Health & Time Off", d: "Full social insurance + supplemental medical; annual check-up; family coverage; PTO increasing annually; extra benefit leave." },
  { idx: "05", t: "Equipment", d: "Mac of your choice, ultrawide monitors. We'll set up your productivity tools properly." },
  { idx: "06", t: "AI Bonus & Community", d: "Bi-monthly cash bonus — help the team, get rewarded. Internal AI sharing culture with occasional Silicon Valley guest visits." },
];

const PLACES = [
  { label: "Shanghai · Changning, 333 Wuyi Rd", n: "01" },
  { label: "Shenzhen · Nanshan", n: "02" },
  { label: "Suzhou · Industrial Park", n: "03" },
  { label: "On-site · Customer Factories", n: "04" },
  { label: "Mexico · Puebla", n: "05" },
];

// ── Hero Stats ──
const HERO_STATS = [
  { k: "Factories Served", v: "40000", unit: "+", countUp: true },
  { k: "SaaS MES Market Share", v: "52.7", unit: "%", countUp: true },
  { k: "Offices", v: "5", unit: "", countUp: false },
  { k: "Founded", v: "2016", unit: "", countUp: false },
];

// ── Client Logos ──
const CLIENTS = [
  "Tesla Supply Chain", "GAC Group", "Nongfu Spring", "China Resources", "Mixue",
  "Mengniu Dairy", "Crayon Shin-chan Foods", "Food & Beverage", "Auto Parts", "Precision Electronics", "Home Appliances", "FMCG",
];

const FAQS = [
  { q: "What type of customers does Blacklake serve?", a: "Discrete and process manufacturing factories — spanning automotive, new energy, food & beverage, precision electronics, chemicals, and more. Our clients include Tesla's supply chain, GAC Group, Nongfu Spring, and Mixue, as well as tens of thousands of SME manufacturers with 20-100 employees." },
  { q: "How is Blacklake different from other industrial software companies?", a: "We're #1 in China's SaaS MES market (52.7% share), and one of the few companies genuinely deploying AI Agents in real manufacturing scenarios." },
  { q: "Do I need to visit factories often?", a: "Depends on the role. Product, Solutions, and Customer Success involve significant on-site time — we've had 'go to the factory' in our DNA since day one. R&D teams arrange quarterly factory visits as well." },
  { q: "What does the interview process look like?", a: "Typically: Resume → Phone screen → 2-3 technical/business rounds → Leader round. We aim to complete the entire process within 1-2 weeks." },
  { q: "What if I don't see a role that fits?", a: "If none of our current openings fit — you can create your own role." },
];

Object.assign(window, { VALUES, JOBS, CATEGORIES, LOCATIONS, STORIES, PERKS, PLACES, FAQS, HERO_STATS, CLIENTS });
