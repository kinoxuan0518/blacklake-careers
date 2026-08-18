/* global React, ReactDOM, window, Nav, FrameCorners, Prelude, Hero, Order, Impact, Frontier, JobsScene, JobsDrawer, OEEGame */
// ============ Blacklake Careers v6 · App (EN · scene state machine) ============
// Scroll = explore slowly · Tabs = jump fast · Apply = shortest path.

const SCENE_ORDER = ["prelude", "hero", "order", "impact", "frontier", "jobs"];

function App() {
  const [scene, setScene] = useS("prelude");
  const [intro, setIntro] = useS(0);
  const [prog, setProg] = useS(0);
  const [drawer, setDrawer] = useS({ open: false, filter: "All" });
  const [leaving, setLeaving] = useS(null); // scene currently in leaving transition
  const [mobile, setMobile] = useS(() => window.matchMedia("(max-width: 720px)").matches);
  const lock = useR(false);

  useE(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Prelude autoplay: scatter(0) → 2.6s connect(1) → 5s order(2) → 6.9s hero
  useE(() => {
    if (scene !== "prelude") return;
    const t1 = window.setTimeout(() => setIntro(1), 2600);
    const t2 = window.setTimeout(() => setIntro(2), 5000);
    const t3 = window.setTimeout(() => { if (!mobile) go("hero"); }, 6900);
    return () => [t1, t2, t3].forEach(window.clearTimeout);
  }, [scene, mobile]);

  const withLock = (fn) => {
    if (lock.current) return;
    lock.current = true;
    fn();
    window.setTimeout(() => { lock.current = false; }, 700);
  };

  const go = (next) => {
    if (next === scene) return;
    setLeaving(scene);                      // old scene leaves with a morph, not a cut
    window.setTimeout(() => setLeaving(null), 950);
    if (next === "order") setProg((p) => Math.max(p, 0.0001));
    if (next === "hero") setProg(0);
    setScene(next);
  };

  const step = (dir) => {
    const i = SCENE_ORDER.indexOf(scene);
    if (scene === "prelude") {
      if (dir > 0) { setIntro(2); go("hero"); }
      return;
    }
    if (scene === "order") {
      const next = Math.max(0, Math.min(1, prog + dir * 0.22));
      setProg(next);
      if (dir > 0 && prog >= 1) go("impact");
      else if (dir < 0 && prog <= 0) go("hero");
      return;
    }
    const j = i + dir;
    if (j >= 1 && j < SCENE_ORDER.length) go(SCENE_ORDER[j]); // never back into prelude
  };

  const openDrawer = (filter) => setDrawer({ open: true, filter: filter || "All" });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));
  const setFilter = (filter) => setDrawer((d) => ({ ...d, filter }));

  const onWheel = (e) => {
    if (mobile || drawer.open || Math.abs(e.deltaY) < 10) return;
    e.preventDefault?.();
    if (scene === "order") { step(e.deltaY > 0 ? 1 : -1); return; }
    withLock(() => step(e.deltaY > 0 ? 1 : -1));
  };

  useE(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && drawer.open) { closeDrawer(); return; }
      if (drawer.open) return;
      if (e.key === " " && scene === "prelude") { e.preventDefault(); setIntro(2); go("hero"); return; }
      if (["ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); step(1); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer.open, scene, mobile, prog]);

  const chapterScene = CHAPTERS.some((c) => c.key === scene) ? scene : "";

  return (
    <main
      className={`exp scene-${scene} intro-${intro}`}
      onWheel={onWheel}
      aria-live="polite"
    >
      <div className="grain" aria-hidden="true" />
      <Nav scene={chapterScene} onChapter={go} onApply={openDrawer} lang="en" />
      <Prelude active={scene === "prelude"} leaving={leaving === "prelude"} onSkip={() => { setIntro(2); go("hero"); }} />
      <Hero active={scene === "hero"} leaving={leaving === "hero"} onExplore={() => go("order")} onApply={openDrawer} />
      <Order active={scene === "order"} leaving={leaving === "order"} prog={mobile ? 1 : prog} />
      <Impact active={mobile || scene === "impact"} leaving={leaving === "impact"} />
      <Frontier active={mobile || scene === "frontier"} leaving={leaving === "frontier"} onHire={openDrawer} />
      <JobsScene active={mobile || scene === "jobs"} leaving={leaving === "jobs"} onNode={openDrawer} />
      <JobsDrawer open={drawer.open} filter={drawer.filter} onFilter={setFilter} onClose={closeDrawer} />
      <FrameCorners />
      <OEEGame />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
