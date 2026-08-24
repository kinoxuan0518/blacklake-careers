/* global React, ReactDOM, window, Nav, FrameCorners, Hero, Impact, Frontier, JobsScene, JobsDrawer, OEEGame */
// ============ Blacklake Careers v6 · App (EN · scene state machine) ============
// Scroll = explore slowly · Tabs = jump fast · Apply = shortest path.

const SCENE_ORDER = ["hero", "impact", "frontier", "jobs"];

/* Wheel gesture lock (shared with Hero): after a scene change, the same gesture's inertia must not multi-step.
   Unlocks the instant the wheel is quiet for 250ms — a settled gesture's next scroll responds immediately; 2000ms failsafe. */
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
  const [drawer, setDrawer] = useS({ open: false, filter: "All" });
  const [leaving, setLeaving] = useS(null); // scene currently in leaving transition
  const [mobile, setMobile] = useS(() => window.matchMedia("(max-width: 720px)").matches);
  const drawerLock = useR(false);           // live drawer state for Hero (ref, no re-render)
  drawerLock.current = drawer.open;

  // Mobile: fall back to vertical scroll with all scenes expanded
  useE(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (next) => {
    if (next === scene) return;
    armWheelGuard();                        // inertia from this gesture must not reach the next scene
    setLeaving(scene);                      // old scene leaves with a morph, not a cut
    window.setTimeout(() => setLeaving(null), 950);
    setScene(next);
  };

  const step = (dir) => { // dir: +1 down / -1 up
    const i = SCENE_ORDER.indexOf(scene);
    const j = i + dir;
    if (j >= 0 && j < SCENE_ORDER.length) go(SCENE_ORDER[j]);
  };

  const openDrawer = (filter) => setDrawer({ open: true, filter: filter || "All" });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));
  const setFilter = (filter) => setDrawer((d) => ({ ...d, filter }));

  // Wheel: desktop scene model (hero assembly/explode is handled inside Hero)
  const onWheel = (e) => {
    const g = window.__wguard;
    g.last = performance.now();             // track all wheel activity for quiet detection
    if (mobile || drawer.open || Math.abs(e.deltaY) < 10) return;
    if (g.lock) return;                     // inertial tail after a scene change: swallow
    if (scene === "hero") return;
    step(e.deltaY > 0 ? 1 : -1);            // gesture lock already ensures one step per gesture
  };

  // Keyboard: ↓ forward, ↑ back, ESC closes drawer (hero keys are handled inside Hero)
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
      <Nav scene={chapterScene} onChapter={go} onApply={openDrawer} lang="en" />
      <Hero active={scene === "hero"} leaving={leaving === "hero"} onExplore={() => go("impact")} onApply={openDrawer} mobile={mobile} lockedRef={drawerLock} />
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
