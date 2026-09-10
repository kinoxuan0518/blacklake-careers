/* global React, ReactDOM, window, Nav, FrameCorners, Hero, Impact, Frontier, JobsScene, JobsDrawer, OEEGame */
// ============ Blacklake Careers v6 · App（场景状态机） ============
// Scroll = 慢慢探索；Tab = 快速跃迁；投递 = 最短路径。

const SCENE_ORDER = ["hero", "impact", "frontier", "jobs"];

/* 滚动手势锁（App/Hero 共享）：场景切换后锁定，同一手势的惯性余波不得连跳场景。
   手势停稳 250ms 立即解锁——停稳后的下一次滚动零等待；2000ms 兜底防锁死。 */
window.__wguard = window.__wguard || { lock: false, last: 0, timer: 0 };
function armWheelGuard() {
  const g = window.__wguard;
  g.lock = true;
  clearTimeout(g.timer);
  const t0 = performance.now();
  const check = () => {
    const quiet = performance.now() - g.last;
    if (quiet >= 250 || performance.now() - t0 >= 2000) { g.lock = false; return; }
    g.timer = setTimeout(check, 60);
  };
  g.timer = setTimeout(check, 60);
}

function App() {
  const [scene, setScene] = useS("hero");
  const [drawer, setDrawer] = useS({ open: false, filter: "全部" });
  const [leaving, setLeaving] = useS(null); // 正在离场（变形过渡中）的场景
  const [mobile, setMobile] = useS(() => window.matchMedia("(max-width: 720px)").matches);
  const [jobs, setJobs] = useS([]);         // 全量在招职位（jobs.json，飞书招聘同步）
  const drawerLock = useR(false);           // 给 Hero 的实时抽屉状态（走 ref，不触发重渲染）
  drawerLock.current = drawer.open;

  // 职位全量镜像：启动时拉取同步数据，失败则保持空列表（筛选区自动为空态）
  useE(() => {
    fetch("jobs.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && Array.isArray(d.jobs)) setJobs(d.jobs); })
      .catch(() => {});
  }, []);

  // 移动端：回退为纵向滚动，场景全部展开
  useE(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (next) => {
    if (next === scene) return;
    armWheelGuard();                        // 本次滚动手势的惯性不得带入下一场景
    setLeaving(scene);                      // 旧场景不直接消失，进入离场变形
    window.setTimeout(() => setLeaving(null), 950);
    setScene(next);
  };

  const step = (dir) => { // dir: +1 向下 / -1 向上
    const i = SCENE_ORDER.indexOf(scene);
    const j = i + dir;
    if (j >= 0 && j < SCENE_ORDER.length) go(SCENE_ORDER[j]);
  };

  const openDrawer = (filter) => setDrawer({ open: true, filter: filter || "全部" });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));
  const setFilter = (filter) => setDrawer((d) => ({ ...d, filter }));

  // 滚轮：桌面场景模型驱动（hero 的装配/拆解由 Hero 内部接管）
  const onWheel = (e) => {
    const g = window.__wguard;
    g.last = performance.now();             // 记录一切滚动活动，用于检测「停稳」
    if (mobile || drawer.open || Math.abs(e.deltaY) < 10) return;
    if (g.lock) return;                     // 场景切换后的惯性余波，吞掉
    if (scene === "hero") return;
    step(e.deltaY > 0 ? 1 : -1);            // 手势锁已保证同一手势只翻一幕
  };

  // 键盘：↓ 前进，↑ 后退，ESC 关抽屉（hero 场景按键由 Hero 内部接管）
  useE(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && drawer.open) { closeDrawer(); return; }
      if (drawer.open || scene === "hero") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); step(1); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer.open, scene, mobile]);

  const chapterScene = CHAPTERS.some((c) => c.key === scene) ? scene : "";

  return (
    <main
      className={`exp scene-${scene}`}
      onWheel={onWheel}
      aria-live="polite"
    >
      <div className="grain" aria-hidden="true" />
      <Nav scene={chapterScene} onChapter={go} onApply={openDrawer} lang="zh" />
      <Hero active={scene === "hero"} leaving={leaving === "hero"} onExplore={() => go("impact")} onApply={openDrawer} mobile={mobile} lockedRef={drawerLock} />
      <Impact active={mobile || scene === "impact"} leaving={leaving === "impact"} />
      <Frontier active={mobile || scene === "frontier"} leaving={leaving === "frontier"} onHire={openDrawer} />
      <JobsScene active={mobile || scene === "jobs"} leaving={leaving === "jobs"} onNode={openDrawer} jobs={jobs} />
      <JobsDrawer open={drawer.open} filter={drawer.filter} onFilter={setFilter} onClose={closeDrawer} jobs={jobs} />
      <FrameCorners />
      <OEEGame />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
