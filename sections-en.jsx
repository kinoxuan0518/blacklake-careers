/* global React, window, IMPACT_SHOTS, QUESTIONS, JOB_NODES, SYSTEM_FLOW, JOBS, CATEGORIES, RECRUIT_URL */
// ============ Blacklake Careers v6 · Scenes (EN · Living Factory) ============

// ═══════════ 00–01 Hero: pilot light → signals converge → servo assembly → wheel-up explodes ═══════════
const HM_LABELS = [
  { from: [782, 177],  elbow: [700, 64],   to: [620, 64],   text: "HOUSING · ", zh: "ORDER BL-240817",   d: 0 },
  { from: [938, 320],  elbow: [920, 190],  to: [920, 140],  text: "STATOR · ",  zh: "MATERIAL AL 6061-T6", d: 0.12 },
  { from: [1039, 432], elbow: [1100, 330], to: [1100, 270], text: "ROTOR · ",   zh: "TOL ±0.02",         d: 0.18 },
  { from: [1141, 606], elbow: [1080, 670], to: [1010, 710], text: "BEARING · ", zh: "MACHINE CNC A17",   d: 0.24 },
  { from: [548, 178],  elbow: [500, 480],  to: [500, 690],  text: "END CAP · ", zh: "72 H LEAD TIME",    d: 0.3 },
];
const HM_SIG_TAGS = ["ORDER #BL-240817", "DRAWING BRKT-A17-R3", "MATERIAL AL 6061-T6",
                     "DELIVERY 72 H", "MACHINE CNC · A17", "PROCESS OP 30"];
const HM_T = { blink: 0.9, ignite: 1.3, field: 1.9 };
const HM_KNOTS = [[HM_T.field, 0], [2.7, 0.10], [4.8, 0.80], [5.6, 1.0]];
const HM_HINT_AUTO = "AUTO · ASSEMBLE · SPACE TO SKIP";
const HM_HINT_ASSEMBLED = "SCROLL ↓ NEXT · ↑ EXPLODE";
const HM_HINT_MID = "SCROLL ↓ REASSEMBLE · ↑ EXPLODE";
const HM_HINT_SCATTERED = "SCROLL ↓ REASSEMBLE";

function Hero({ active, leaving, onExplore, onApply, mobile, lockedRef }) {
  const secRef = useR(null);
  const svgRef = useR(null);
  const sigBoxRef = useR(null);
  const cntRef = useR(null);
  const okRef = useR(null);
  const hintRef = useR(null);
  const st = useR(null);
  const activeRef = useR(active); activeRef.current = active;
  const mobileRef = useR(mobile); mobileRef.current = mobile;
  const exploreRef = useR(onExplore); exploreRef.current = onExplore;

  // —— Build the drawing + signal field + state machine (once; layout effect so first paint is already masked) ——
  useL(() => {
    const sec = secRef.current, svg = svgRef.current, sigBox = sigBoxRef.current;
    sec.classList.add("cine"); // mask before reading layout: clientWidth forces style resolution
    const NS = "http://www.w3.org/2000/svg";
    const U = { x: -0.78, y: -0.63 }, P = { x: 0.63, y: -0.78 };
    const mk = (tag, attrs, parent) => {
      const el = document.createElementNS(NS, tag);
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(el); return el;
    };
    const line = (x1, y1, x2, y2, cls, parent) => mk("line", { x1, y1, x2, y2, "class": cls }, parent);
    const circ = (cx, cy, r, cls, parent) => mk("circle", { cx, cy, r, "class": cls }, parent);
    const axis = (c, k) => [c[0] + U.x * k, c[1] + U.y * k];
    function barrel(g, c, r, len, cls, dim) {
      const b = axis(c, len);
      circ(b[0], b[1], r, dim ? "wire-dim" : "wire-soft", g);
      line(c[0] + P.x * r, c[1] + P.y * r, b[0] + P.x * r, b[1] + P.y * r, cls, g);
      line(c[0] - P.x * r, c[1] - P.y * r, b[0] - P.x * r, b[1] - P.y * r, cls, g);
      circ(c[0], c[1], r, cls, g);
    }
    function boltCircle(g, c, R, n, r, cls) {
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2;
        circ(c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R, r, cls, g);
      }
    }
    function centerMark(g, c, r) {
      line(c[0] - r - 8, c[1], c[0] + r + 8, c[1], "cmark", g);
      line(c[0], c[1] - r - 8, c[0], c[1] + r + 8, "cmark", g);
    }

    /* — part layout — */
    const FRONT = [1250, 660];
    const at = (k) => axis(FRONT, k);
    line(...at(-70), ...at(1000), "cline");
    const PARTS = [
      { id: "shaft",    k: 40,  c: at(40),  ex: 250, w0: .10, w1: .26 },
      { id: "rotor",    k: 270, c: at(270), ex: 300, w0: .16, w1: .34 },
      { id: "bearingF", k: 140, c: at(140), ex: 380, w0: .24, w1: .42 },
      { id: "bearingR", k: 780, c: at(780), ex: 420, w0: .26, w1: .44 },
      { id: "stator",   k: 400, c: at(400), ex: 480, w0: .34, w1: .54 },
      { id: "housing",  k: 600, c: at(600), ex: 540, w0: .42, w1: .62 },
      { id: "capF",     k: 0,   c: at(0),   ex: 620, w0: .52, w1: .72 },
      { id: "capR",     k: 900, c: at(900), ex: 680, w0: .56, w1: .76 },
    ];
    const partGroup = (p) => { const g = mk("g", { "class": "part" }); p.el = g; return g; };
    (() => { const p = PARTS[0], g = partGroup(p);                       // shaft
      barrel(g, p.c, 14, 220, "wire");
      const b = axis(p.c, 220);
      circ(b[0], b[1], 14, "wire-soft", g);
      line(...axis(p.c, 26), ...axis(p.c, 110), "wire-soft", g);
      line(p.c[0] + P.x * 9, p.c[1] + P.y * 9, axis(p.c, 160)[0] + P.x * 9, axis(p.c, 160)[1] + P.y * 9, "wire-soft", g);
    })();
    (() => { const p = PARTS[1], g = partGroup(p);                       // rotor (9 laminations)
      for (let j = 0; j < 9; j++) {
        const cj = axis(p.c, j * 12);
        circ(cj[0], cj[1], 58, j === 0 ? "wire" : "wire-soft", g);
      }
      const L = 8 * 12;
      line(p.c[0] + P.x * 58, p.c[1] + P.y * 58, axis(p.c, L)[0] + P.x * 58, axis(p.c, L)[1] + P.y * 58, "wire", g);
      line(p.c[0] - P.x * 58, p.c[1] - P.y * 58, axis(p.c, L)[0] - P.x * 58, axis(p.c, L)[1] - P.y * 58, "wire", g);
      circ(p.c[0], p.c[1], 24, "wire-soft", g);
      boltCircle(g, p.c, 42, 8, 4, "wire-soft");
      centerMark(g, p.c, 58);
    })();
    for (const id of ["bearingF", "bearingR"]) {                         // bearings
      const p = PARTS.find((q) => q.id === id), g = partGroup(p);
      barrel(g, p.c, 34, 16, "wire");
      circ(p.c[0], p.c[1], 23, "wire-soft", g);
      circ(p.c[0], p.c[1], 14, "wire-soft", g);
      boltCircle(g, p.c, 19, 8, 4, "wire");
      centerMark(g, p.c, 34);
    }
    (() => { const p = PARTS[4], g = partGroup(p);                       // stator
      barrel(g, p.c, 88, 108, "wire");
      circ(p.c[0], p.c[1], 70, "wire", g);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
        line(p.c[0] + c * 70, p.c[1] + s * 70, p.c[0] + c * 88, p.c[1] + s * 88, "wire-soft", g);
      }
      boltCircle(g, p.c, 79, 12, 4.5, "wire-soft");
      centerMark(g, p.c, 88);
    })();
    (() => { const p = PARTS[5], g = partGroup(p);                       // housing (11 fins + foot)
      for (let j = 0; j < 11; j++) {
        const cj = axis(p.c, j * 11);
        circ(cj[0], cj[1], 105, j === 0 ? "wire" : "wire-soft", g);
      }
      const L = 10 * 11;
      line(p.c[0] + P.x * 105, p.c[1] + P.y * 105, axis(p.c, L)[0] + P.x * 105, axis(p.c, L)[1] + P.y * 105, "wire", g);
      line(p.c[0] - P.x * 105, p.c[1] - P.y * 105, axis(p.c, L)[0] - P.x * 105, axis(p.c, L)[1] - P.y * 105, "wire", g);
      const f = [p.c[0] - P.y * 105, p.c[1] + P.x * 105];
      line(f[0] - 26, f[1] + 8, f[0] + 60, f[1] + 8, "wire", g);
      line(f[0] - 26, f[1] + 8, f[0] - 8, f[1] - 14, "wire", g);
      line(f[0] + 60, f[1] + 8, f[0] + 42, f[1] - 14, "wire", g);
      centerMark(g, p.c, 105);
    })();
    (() => { const p = PARTS[6], g = partGroup(p);                       // front cap
      barrel(g, p.c, 80, 20, "wire");
      circ(p.c[0], p.c[1], 85, "wire", g);
      circ(p.c[0], p.c[1], 42, "wire-soft", g);
      boltCircle(g, p.c, 72, 6, 4, "wire");
      centerMark(g, p.c, 85);
    })();
    (() => { const p = PARTS[7], g = partGroup(p);                       // rear cap
      barrel(g, p.c, 80, 20, "wire");
      circ(p.c[0], p.c[1], 85, "wire", g);
      boltCircle(g, p.c, 72, 6, 4, "wire");
      centerMark(g, p.c, 85);
    })();

    /* — dimension callouts — */
    const dims = mk("g", { "class": "dims" });
    {
      const RC = at(270);
      line(RC[0] - 58, RC[1] + 7,  RC[0] - 58, RC[1] + 90, "dline", dims);
      line(RC[0] + 58, RC[1] + 7,  RC[0] + 58, RC[1] + 90, "dline", dims);
      line(RC[0] - 58, RC[1] + 82, RC[0] + 58, RC[1] + 82, "dline2", dims);
      mk("path", { d: `M${RC[0] - 58} ${RC[1] + 82} l9 -2.6 v5.2 Z`, "class": "darrow" }, dims);
      mk("path", { d: `M${RC[0] + 58} ${RC[1] + 82} l-9 -2.6 v5.2 Z`, "class": "darrow" }, dims);
      const t = mk("text", { x: RC[0], y: RC[1] + 74, "text-anchor": "middle", "class": "dtxt" }, dims);
      t.textContent = "Ø58";
    }
    {
      const SC = at(40);
      const e0 = [SC[0] - P.x * 14, SC[1] + P.y * 14];
      const e1 = [e0[0] - P.x * 30, e0[1] + P.y * 30];
      const e2 = [e1[0] - 101, e1[1]];
      mk("path", { d: `M${e0[0]} ${e0[1]} L${e1[0]} ${e1[1]} L${e2[0]} ${e2[1]}`, "class": "dline2" }, dims);
      const t = mk("text", { x: e2[0] - 6, y: e2[1] - 8, "text-anchor": "end", "class": "dtxt" }, dims);
      t.textContent = "Ø14 h7";
    }

    /* — leaders + part labels — */
    for (const L of HM_LABELS) {
      const path = `M${L.from[0]} ${L.from[1]} L${L.elbow[0]} ${L.elbow[1]} L${L.to[0]} ${L.to[1]}`;
      mk("path", { d: path, "class": "leader", pathLength: "1", style: `--ld:${L.d}s` });
      const t = mk("text", { x: L.to[0] - 24, y: L.to[1] - 12, "class": "lbl", style: `--ld:${L.d}s;--lt:${L.d + 0.15}s` });
      t.textContent = L.text;
      const zh = mk("tspan", { "class": "zh" }, t);
      zh.textContent = L.zh;
    }

    /* — ignition elements (opening only) — */
    const HEART = at(430);
    const cLine = svg.querySelector(".cline");
    cLine.style.opacity = 0;
    const igniteF = mk("path", { d: `M${HEART[0]} ${HEART[1]} L${at(-70)[0]} ${at(-70)[1]}`,
      fill: "none", stroke: "var(--green)", "stroke-width": 1.5, opacity: .95,
      pathLength: "1", "stroke-dasharray": "1", "stroke-dashoffset": "1", "vector-effect": "non-scaling-stroke" });
    const igniteR = mk("path", { d: `M${HEART[0]} ${HEART[1]} L${at(1000)[0]} ${at(1000)[1]}`,
      fill: "none", stroke: "var(--green)", "stroke-width": 1.5, opacity: .95,
      pathLength: "1", "stroke-dasharray": "1", "stroke-dashoffset": "1", "vector-effect": "non-scaling-stroke" });
    const pilotHalo = mk("circle", { cx: HEART[0], cy: HEART[1], r: 12, fill: "var(--green)", opacity: 0 });
    const pilot = mk("circle", { cx: HEART[0], cy: HEART[1], r: 4, fill: "var(--green)", opacity: 0 });

    /* — signal field — */
    const W = sec.clientWidth, H = sec.clientHeight;
    const sigData = [];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("i");
      const tagged = i < HM_SIG_TAGS.length;
      s.className = "sig";
      let x, y;
      if (tagged) {
        x = W * (0.45 + Math.random() * 0.5);
        y = H * (0.15 + Math.random() * 0.7);
      } else {
        x = Math.random() * W; y = Math.random() * H;
      }
      s.style.left = x + "px"; s.style.top = y + "px";
      let lbl = null;
      if (tagged) {
        lbl = document.createElement("b");
        lbl.textContent = HM_SIG_TAGS[i];
        s.appendChild(lbl);
      }
      sigBox.appendChild(s);
      const w0 = 0.01 + (i % 9) * 0.007;
      sigData.push({ el: s, lbl, x, y,
        tx: W * 0.62 + (Math.random() * 40 - 20),
        ty: H * 0.48 + (Math.random() * 40 - 20),
        w0, w1: w0 + 0.055 });
    }
    const sigRand = sigData.map(() => Math.random() * 0.25);

    /* — render (driven by p; shared by autoplay and explode) — */
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const C1 = 1.3;
    const easeOutBack = (t) => 1 + (C1 + 1) * Math.pow(t - 1, 3) + C1 * Math.pow(t - 1, 2);
    const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const state = { mode: "idle", p: 0, target: 0, rafId: null, t0: null, cineOn: true, played: false };
    st.current = state;
    window.__hm = state; // test probe: verify wheel drives frames synchronously

    function render(p) {
      state.p = p;
      for (const s of sigData) {
        const local = clamp01((p - s.w0) / (s.w1 - s.w0));
        const e = easeInOut(local);
        s.el.style.transform =
          `translate(${((s.tx - s.x) * e).toFixed(1)}px,${((s.ty - s.y) * e).toFixed(1)}px) scale(${(1 - 0.6 * e).toFixed(3)})`;
        s.el.style.opacity = e < .55 ? 1 : (1 - (e - .55) / .45).toFixed(3);
        if (s.lbl) s.lbl.style.opacity = Math.max(0, 1 - local * 2.5).toFixed(3);
      }
      for (const m of PARTS) {
        const local = clamp01((p - m.w0) / (m.w1 - m.w0));
        const e = easeOutBack(local), k = 1 - e;
        let tf = `translate(${(-U.x * m.ex * k).toFixed(2)}px, ${(-U.y * m.ex * k).toFixed(2)}px)`;
        if (m.id === "rotor") tf += ` rotate(${(k * 10).toFixed(2)}deg)`;
        m.el.style.transform = tf;
        m.el.style.opacity = Math.min(1, local * 3).toFixed(3);
      }
      let done = 0;
      for (const m of PARTS) if ((p - m.w0) / (m.w1 - m.w0) >= .99) done++;
      cntRef.current.textContent = done + "/8";
      okRef.current.textContent = done === 8 ? "OK" : "···";
      sec.classList.toggle("f-pre",    p > .09);
      sec.classList.toggle("f-copy",   p > .10);
      sec.classList.toggle("f-hud",    p > .10);
      sec.classList.toggle("f-leader", p > .78);
      const showHint = true; // keep the hint visible in auto and scroll modes
      sec.classList.toggle("f-no-hint", !showHint);
      hintRef.current.textContent = state.mode === "auto" ? HM_HINT_AUTO
        : p <= .001 ? HM_HINT_SCATTERED
        : p >= .999 ? HM_HINT_ASSEMBLED
        : HM_HINT_MID;
    }

    /* — opening film: pilot light → ignite the axis → signal field emerges → converge & assemble — */
    function cineBlack() {
      sec.classList.remove("f-no-hint", "f-pre", "f-copy", "f-hud", "f-leader");
      hintRef.current.textContent = HM_HINT_AUTO;
      cLine.style.opacity = 0;
      for (const m of PARTS) m.el.style.opacity = 0;
      for (const s of sigData) {
        s.el.style.opacity = 0;
        s.el.style.transform = "translate(0px,0px) scale(1)";
      }
      igniteF.style.strokeDashoffset = 1; igniteR.style.strokeDashoffset = 1;
      igniteF.style.opacity = .95; igniteR.style.opacity = .95;
      pilot.style.opacity = 0; pilotHalo.style.opacity = 0;
    }
    function cine(t) {
      if (t < HM_T.blink) {
        const op = t < .15 ? 0 : t < .25 ? 1 : t < .38 ? .12 : 1;
        pilot.style.opacity = op;
        pilotHalo.style.opacity = (op * .18).toFixed(3);
        return;
      }
      pilot.style.opacity = 1; pilotHalo.style.opacity = .18;
      if (t < HM_T.ignite) {
        const k = (t - HM_T.blink) / (HM_T.ignite - HM_T.blink);
        igniteF.style.strokeDashoffset = 1 - k;
        igniteR.style.strokeDashoffset = 1 - k;
        return;
      }
      const k = easeInOut(clamp01((t - HM_T.ignite) / (HM_T.field - HM_T.ignite)));
      state.cineOn = false;
      sec.classList.remove("cine");
      igniteF.style.opacity = (.95 * (1 - k)).toFixed(3);
      igniteR.style.opacity = (.95 * (1 - k)).toFixed(3);
      cLine.style.opacity = (k * .42).toFixed(3);
      pilot.style.opacity = (1 - k).toFixed(3);
      pilotHalo.style.opacity = (.18 * (1 - k)).toFixed(3);
      sigData.forEach((s, i) => {
        s.el.style.opacity = clamp01((k - sigRand[i]) / 0.6).toFixed(3);
      });
    }
    function autoP(t) {
      for (let i = 1; i < HM_KNOTS.length; i++) {
        if (t <= HM_KNOTS[i][0]) {
          const [t0, p0] = HM_KNOTS[i - 1], [t1, p1] = HM_KNOTS[i];
          return p0 + (p1 - p0) * (t - t0) / (t1 - t0);
        }
      }
      return 1;
    }
    function tick(ts) {
      if (state.mode !== "auto") return;
      if (state.t0 === null) state.t0 = ts;
      const t = (ts - state.t0) / 1000;
      if (t < HM_T.field) cine(t);
      else render(autoP(t));
      if (t < HM_KNOTS[HM_KNOTS.length - 1][0]) state.rafId = requestAnimationFrame(tick);
      else enterScroll();
    }
    function enterScroll() {
      if (state.mode === "scroll") return;
      state.mode = "scroll"; state.played = true; state.cineOn = false;
      sec.classList.remove("cine");
      cLine.style.opacity = "";
      igniteF.style.opacity = 0; igniteR.style.opacity = 0;
      pilot.style.opacity = 0; pilotHalo.style.opacity = 0;
      state.target = 1;                    // intro ends assembled (8/8); explode is scroll-driven
      render(1);
    }
    function finishAuto() {
      if (state.mode !== "auto") return;
      if (state.rafId) cancelAnimationFrame(state.rafId);
      enterScroll();
    }
    function startAuto() {
      state.mode = "auto"; state.t0 = null; state.cineOn = true; state.target = 0;
      sec.classList.add("cine");
      cineBlack();
      state.rafId = requestAnimationFrame(tick);
    }
    /* — direct wheel drive: progress follows the gesture 1:1, rendered same frame, no easing chase — */
    state.wheel = (dir, dy) => {
      if (state.mode === "auto") { if (dir > 0) finishAuto(); return; }
      if (state.mode !== "scroll") return;
      if (dir > 0 && state.p >= 1) { exploreRef.current(); return; } // at 8/8, scroll down → Impact
      if (dir < 0 && state.p <= 0) return;                           // at 0/8, scroll up → dead end
      const next = clamp01(state.p + (dy || dir * 120) * 0.0011);    // signed delta: down assembles / up explodes
      if (next === state.p) return;
      state.target = next;
      render(next); // render writes state.p internally
    };
    state.startAuto = startAuto;
    state.render = render;
    state.finishAuto = finishAuto;

    /* — keyboard (App hands keys over in the hero scene) — */
    const onKey = (e) => {
      if (!activeRef.current || mobileRef.current) return;
      if (lockedRef && lockedRef.current) return;
      if (e.key === " " || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); state.wheel(1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); state.wheel(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (state.rafId) cancelAnimationFrame(state.rafId);
    };
  }, []);

  // —— enter / leave scene (layout effect: start playing on entry, no flash) ——
  useL(() => {
    const s = st.current;
    if (!s) return;
    if (active) {
      if (!s.played) s.startAuto();
      else { // re-entering Hero lands on the assembled state (8/8); scroll up to explode
        s.mode = "scroll"; s.cineOn = false;
        secRef.current.classList.remove("cine");
        s.target = 1; s.render(1);
      }
    } else {
      if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null; }
    }
  }, [active]);

  // —— React re-renders reset className: sync imperative state back ——
  useE(() => {
    const s = st.current;
    if (!s) return;
    if (s.mode === "auto" && s.cineOn) secRef.current.classList.add("cine");
    if (s.mode === "scroll") s.render(s.p);
  });

  const onWheel = (e) => {
    const g = window.__wguard;
    if (g) g.last = performance.now();      // track wheel activity for quiet detection
    const s = st.current;
    if (!s || mobile || !active || (lockedRef && lockedRef.current)) return;
    if (Math.abs(e.deltaY) < 1) return;
    // no g.lock check here: an upward gesture from Impact flows straight into the explode (App-level lock still prevents scene multi-stepping)
    s.wheel(e.deltaY > 0 ? 1 : -1, e.deltaY);
  };
  const onPointerDown = () => { const s = st.current; if (s) s.finishAuto(); };

  return (
    <section
      ref={secRef}
      className={`scene hero ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`}
      aria-hidden={!active}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
    >
      <div className="hm-head"><span>FACTORY INPUT / LIVE</span><span>SHANGHAI · 2026</span></div>
      <div className="hm-pre">
        <p className="hm-kicker">00 · PRELUDE</p>
        <h2>Behind every order,<br />a chain of judgments.<br /><span>We're putting intelligence inside it.</span></h2>
      </div>
      <div className="hm-sigs" ref={sigBoxRef} aria-hidden="true" />
      <div className="hm-stage"><svg ref={svgRef} viewBox="0 0 1400 760" aria-label="Servo motor exploded engineering drawing" /></div>
      <div className="hm-copy">
        <p className="eyebrow">INTELLIGENCE × MANUFACTURING</p>
        <h1>INTELLIGENCE ENTERS<br /><span className="sub">AND DOES REAL WORK.</span></h1>
        <div className="hm-btns">
          <button className="btn" onClick={onExplore}>Explore what we do <span className="arw">↓</span></button>
          <button className="btn btn-paper" onClick={() => onApply("All")}>Open roles <span className="arw">↗</span></button>
        </div>
      </div>
      <p className="hm-hud">ASSEMBLY <b ref={cntRef}>0/8</b> · FIT ±0.02 · <b ref={okRef}>···</b></p>
      <p className="hm-hint"><span ref={hintRef}>{HM_HINT_AUTO}</span></p>
    </section>
  );
}

// ═══════════ 04 Impact ═══════════
function Impact({ active, leaving }) {
  return (
    <section className={`scene impact ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <header className="impact-head">
        <p>IMPACT / REAL WORLD</p>
        <h2>An answer in a model is not the end.<br /><span>A change in the factory is.</span></h2>
      </header>
      <div className="impact-morph" aria-hidden="true">
        <span>CAD LINE</span><span>→</span><span>CUT PATH</span><span>→</span><span>METAL</span>
        <span className="mline" />
      </div>
      <div className="impact-shots">
        {IMPACT_SHOTS.map((s, i) => (
          <figure className={`shot shot-${["a", "b", "c"][i]}`} key={s.img}>
            <div className="frame"><img src={s.img} alt={s.alt} /></div>
            <figcaption>
              <span className="cap">{s.cap}</span>
              <span className="read">{s.read}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="impact-line">A line of code, a model, a product call you make — <b>ends up on a real production line.</b></p>
    </section>
  );
}

// ═══════════ 05 Frontier ═══════════
function Frontier({ active, leaving, onHire }) {
  const [conf, setConf] = useS(94);
  useE(() => {
    if (!active) return;
    setConf(94);
    const t0 = Date.now();
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / 750);
      setConf(Math.round(94 - 43 * p));
      if (p >= 1) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [active]);
  return (
    <section className={`scene frontier ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <header className="frontier-head">
        <p>FRONTIER / OPEN QUESTIONS</p>
        <h2>Many questions <span>don't have answers yet.</span></h2>
      </header>
      <div className="fork" aria-hidden="true">
        <span className="conf">CONFIDENCE <b>51%</b></span>
        <span className="fork-lines" />
        <span>FLOW DIVERGES</span>
      </div>
      <div>
        {QUESTIONS.map((q, i) => (
          <div className="q-row" key={q.q}>
            <span className="q-idx">0{i + 1}</span>
            <p className="q-text">{q.q}</p>
            <button className="q-link" onClick={() => onHire(q.cat)}>
              {q.tag} · WE ARE HIRING <span>↗</span>
            </button>
          </div>
        ))}
      </div>
      <p className="frontier-note">So far, you've been watching. From here on, you might be someone who solves these.</p>
    </section>
  );
}

// ═══════════ 07 Jobs ═══════════
function JobsScene({ active, leaving, onNode }) {
  return (
    <section className={`scene jobs-scene ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <header className="jobs-head">
        <p>JOBS / FIND WHERE YOU FIT</p>
        <h2>Which part of this system <span>do you want to build?</span></h2>
      </header>
      <div className="sysflow" aria-hidden="true">
        {SYSTEM_FLOW.map((n, i) => (
          <React.Fragment key={n}>
            {i > 0 && <span className="sf-line" />}
            <span className={`sf-node ${n === "INTELLIGENCE" ? "core-node" : ""}`}>{n}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="job-nodes">
        {JOB_NODES.map((n) => {
          const count = JOBS.filter((j) => j.category === n.cat).length;
          return (
            <button className="job-node" key={n.cat} onClick={() => onNode(n.cat)}>
              <span className="jn-en">{n.en}</span>
              <span className="jn-cat">{n.cat}</span>
              <span className="jn-note">{n.note}</span>
              <span className="jn-meta">
                <span className="jn-count">{count} open {count > 1 ? "roles" : "role"}</span>
                <span className="jn-go">Enter ↗</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="jobs-foot">
        <a href="mailto:careers@blacklake.cn">careers@blacklake.cn →</a>
        <span>© 2026 BLACKLAKE</span>
      </div>
    </section>
  );
}

// ═══════════ Jobs drawer ═══════════
function JobsDrawer({ open, filter, onFilter, onClose }) {
  const counts = {};
  JOBS.forEach((j) => { counts[j.category] = (counts[j.category] || 0) + 1; });
  const list = filter === "All" ? JOBS : JOBS.filter((j) => j.category === filter);
  return (
    <React.Fragment>
      <button className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} aria-label="Close roles list" tabIndex={-1} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Open roles">
        <div className="drawer-head">
          <div>
            <span>JOIN BLACK LAKE</span>
            <h2>Join Blacklake</h2>
          </div>
          <button className="drawer-close" onClick={onClose}>Close ×</button>
        </div>
        <p className="drawer-intro">Work on real factory floors, on questions AI hasn't answered yet. Click a role to apply via Feishu Hiring.</p>
        <div className="drawer-filters">
          <button className={filter === "All" ? "selected" : ""} onClick={() => onFilter("All")}>
            All {JOBS.length}
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} className={filter === c ? "selected" : ""} onClick={() => onFilter(c)}>
              {c} {counts[c] || 0}
            </button>
          ))}
        </div>
        <div className="drawer-list">
          {list.map((j, i) => (
            <a className="djob" key={j.id} href={RECRUIT_URL} target="_blank" rel="noreferrer">
              <span className="djob-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="djob-copy">
                <strong>{j.title}</strong>
                <small>{j.loc} · {j.category} · {j.type} · {j.level}</small>
                <p>{j.desc}</p>
              </span>
              <span className="djob-arrow">↗</span>
            </a>
          ))}
        </div>
        <p className="drawer-foot">Applications via Feishu Hiring · résumés go straight to hiring teams</p>
      </aside>
    </React.Fragment>
  );
}

// ═══════════ OEE Mini-game (Easter Egg · triple-click the logo) ═══════════
const OEE_CAT = {
  assembly: { label: 'ASSEMBLY', color: '#02B980' },
  ai:       { label: 'AI·DATA',  color: '#40D898' },
  quality:  { label: 'QUALITY',  color: '#028A5A' },
};
const OEE_MACH_DEF = [
  { name: 'LINE-A', pref: 'assembly', ok: 'ai',      bad: 'quality' },
  { name: 'LINE-B', pref: 'ai',       ok: 'assembly', bad: 'quality' },
  { name: 'QC',     pref: 'quality',  ok: 'ai',       bad: 'assembly' },
];
const OEE_JOBS_DEF = [
  { name: '产线换型优化',   dur: 8,  u: 1, cat: 'assembly' },
  { name: '排产甘特刷新',   dur: 5,  u: 0, cat: 'assembly' },
  { name: '工单看板更新',   dur: 7,  u: 1, cat: 'assembly' },
  { name: 'MES排程推送',    dur: 10, u: 0, cat: 'assembly' },
  { name: '班次报工汇总',   dur: 6,  u: 1, cat: 'assembly' },
  { name: '设备参数同步',   dur: 9,  u: 0, cat: 'assembly' },
  { name: 'AI视觉标定',     dur: 9,  u: 1, cat: 'ai'       },
  { name: '产能预测模型',   dur: 12, u: 0, cat: 'ai'       },
  { name: '库存预警分析',   dur: 10, u: 1, cat: 'ai'       },
  { name: '排产算法训练',   dur: 13, u: 0, cat: 'ai'       },
  { name: '异常检测模型',   dur: 8,  u: 1, cat: 'ai'       },
  { name: '数据同步推送',   dur: 6,  u: 0, cat: 'ai'       },
  { name: '质量报表生成',   dur: 8,  u: 0, cat: 'quality'  },
  { name: 'SPC控制图更新',  dur: 7,  u: 1, cat: 'quality'  },
  { name: '设备OEE计算',    dur: 9,  u: 0, cat: 'quality'  },
  { name: '不良品追溯',     dur: 11, u: 1, cat: 'quality'  },
  { name: '供应商质检审核', dur: 12, u: 0, cat: 'quality'  },
  { name: '一次通过率统计', dur: 6,  u: 1, cat: 'quality'  },
];
const OEE_MATCH = {
  perfect: { mul: 1.0, pts: 3, label: 'PERFECT',   color: '#02B980' },
  ok:      { mul: 1.6, pts: 2, label: 'WORKABLE',  color: '#028A5A' },
  bad:     { mul: 2.5, pts: 1, label: 'POOR FIT!', color: '#7A2808' },
};
function _oeeMatch(mIdx, cat) {
  const m = OEE_MACH_DEF[mIdx];
  if (m.pref === cat) return 'perfect';
  if (m.ok   === cat) return 'ok';
  return 'bad';
}
const OEE_EXPIRE_MS = 18000;
const OEE_SPAWN_MS  = 3500;
const OEE_MAX_Q     = 8;
let _oeeJobId = 0;

function OEEGame() {
  const [active, setActive] = useS(false);
  const [timeLeft, setTimeLeft] = useS(60);
  const [queue, setQueue] = useS([]);
  const [machines, setMachines] = useS(OEE_MACH_DEF.map((d, i) => ({ ...d, i, job: null, progress: 0 })));
  const [selected, setSelected] = useS(null);
  const [hovered, setHovered] = useS(null);
  const [now, setNow] = useS(Date.now);
  const [stats, setStats] = useS({ done: 0, missed: 0, total: 0, pts: 0, maxPts: 0 });
  const [ended, setEnded] = useS(false);

  useE(() => {
    const show = () => { resetGame(); setActive(true); };
    window.addEventListener('oee-game', show);
    return () => window.removeEventListener('oee-game', show);
  }, []);

  function resetGame() {
    _oeeJobId = 0;
    setTimeLeft(60); setQueue([]); setSelected(null); setHovered(null); setEnded(false);
    setStats({ done: 0, missed: 0, total: 0, pts: 0, maxPts: 0 });
    setMachines(OEE_MACH_DEF.map((d, i) => ({ ...d, i, job: null, progress: 0 })));
  }

  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => setTimeLeft(v => { if (v <= 1) { setEnded(true); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [active, ended]);

  useE(() => {
    if (!active || ended) return;
    const spawn = () => {
      const tpl = OEE_JOBS_DEF[Math.floor(Math.random() * OEE_JOBS_DEF.length)];
      const job = { id: ++_oeeJobId, name: tpl.name, dur: tpl.dur, u: tpl.u, cat: tpl.cat, born: Date.now(), expireAt: Date.now() + OEE_EXPIRE_MS };
      setStats(s => ({ ...s, total: s.total + 1, maxPts: s.maxPts + 3 }));
      setQueue(q => q.length >= OEE_MAX_Q ? q : [...q, job]);
    };
    spawn();
    const t = setInterval(spawn, OEE_SPAWN_MS);
    return () => clearInterval(t);
  }, [active, ended]);

  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => {
      const now = Date.now();
      setNow(now);
      setQueue(q => {
        const gone = q.filter(j => now > j.expireAt);
        if (gone.length) setStats(s => ({ ...s, missed: s.missed + gone.length }));
        return q.filter(j => now <= j.expireAt);
      });
      setMachines(ms => ms.map(m => {
        if (!m.job) return m;
        const p = Math.min((now - m.job.startedAt) / 1000 / m.job.effDur, 1);
        if (p >= 1) {
          setStats(s => ({ ...s, done: s.done + 1, pts: s.pts + m.job.pts }));
          return { ...m, job: null, progress: 0 };
        }
        return { ...m, progress: p };
      }));
    }, 200);
    return () => clearInterval(t);
  }, [active, ended]);

  const assign = (mIdx) => {
    if (!selected || machines[mIdx].job) return;
    const match = _oeeMatch(mIdx, selected.cat);
    const cfg = OEE_MATCH[match];
    const job = { ...selected, startedAt: Date.now(), effDur: selected.dur * cfg.mul, match, pts: cfg.pts };
    setMachines(ms => ms.map((m, i) => i === mIdx ? { ...m, job, progress: 0 } : m));
    setQueue(q => q.filter(j => j.id !== selected.id));
    setSelected(null); setHovered(null);
  };

  const oee = stats.maxPts > 0 ? Math.round(stats.pts / stats.maxPts * 1000) / 10 : 0;
  const timerPct = timeLeft / 60 * 100;
  if (!active) return null;

  return (
    <div className="oee-overlay" onClick={e => e.target === e.currentTarget && setActive(false)}>
      <div className="oee-modal">

        <div className="oee-head">
          <div className="oee-title"><span className="oee-logo-dot" /><span>DISPATCH · SYS</span><span className="oee-badge">● ONLINE</span></div>
          <div className="oee-legend">
            {Object.entries(OEE_CAT).map(([k, v]) => (
              <span key={k} className="oee-legend-item">
                <span className="oee-legend-dot" style={{ background: v.color }} />{v.label}
              </span>
            ))}
          </div>
          <div className="oee-timer-wrap">
            <div className="oee-timer-bar"><div className="oee-timer-fill" style={{ width: `${timerPct}%`, background: timeLeft < 15 ? '#C03010' : '#E87820', color: timeLeft < 15 ? '#C03010' : '#E87820' }} /></div>
            <span className="oee-timer-num" style={{ color: timeLeft < 15 ? '#C03010' : '#E87820' }}>{timeLeft}s</span>
          </div>
          <button className="oee-close" onClick={() => setActive(false)}>×</button>
        </div>

        {ended ? (
          <div className="oee-end">
            <div className="oee-end-label">MISSION COMPLETE · OEE RATING</div>
            <div className="oee-end-score" style={{ color: oee >= 80 ? '#02B980' : oee >= 50 ? '#028A5A' : '#7A2808' }}>{oee}<span>%</span></div>
            <div className="oee-end-sub">Score {stats.pts}/{stats.maxPts} · Done {stats.done} · Missed {stats.missed}</div>
            <div className="oee-end-tip">{oee >= 85 ? 'Perfect dispatch — factory at full tilt' : oee >= 60 ? 'Good — match jobs to the machines that do them best' : 'Tip: matching job and machine colors scores 3x'}</div>
            <button className="btn" onClick={resetGame}>[ RESTART ]</button>
          </div>
        ) : (
          <div className="oee-body">

            <div className="oee-queue">
              <div className="oee-col-label">INCOMING {queue.length}/{OEE_MAX_Q}</div>
              {queue.length === 0 && <div className="oee-empty">AWAITING INPUT...</div>}
              {queue.map(j => {
                const cc = OEE_CAT[j.cat];
                const expPct = Math.max(0, (j.expireAt - now) / OEE_EXPIRE_MS * 100);
                const isSel = selected?.id === j.id;
                return (
                  <div key={j.id} className={`oee-job${isSel ? ' selected' : ''}`}
                    style={isSel ? { borderColor: cc.color, background: cc.color + '14' } : {}}
                    onClick={() => setSelected(isSel ? null : j)}>
                    <div className="oee-job-top">
                      <span className="oee-cat-pill" style={{ color: cc.color, borderColor: cc.color + '55', background: cc.color + '18' }}>{cc.label}</span>
                      {j.u ? <span className="oee-urgent-dot" /> : null}
                    </div>
                    <div className="oee-job-name">{j.name}</div>
                    <div className="oee-job-foot">
                      <span className="oee-job-dur">{j.dur}s</span>
                      <div className="oee-expire-bar"><div className="oee-expire-fill" style={{ width: `${expPct}%`, background: expPct < 25 ? '#C03010' : 'rgba(2,185,128,0.4)' }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="oee-machines">
              <div className="oee-col-label">WORK CELLS</div>
              <div className="oee-machine-grid">
                {machines.map((m, i) => {
                  const def = OEE_MACH_DEF[i];
                  const specCfg = OEE_CAT[def.pref];
                  const match = selected ? _oeeMatch(i, selected.cat) : null;
                  const matchCfg = match ? OEE_MATCH[match] : null;
                  const droppable = selected && !m.job;
                  const isHov = hovered === i;
                  return (
                    <div key={m.name}
                      className={`oee-machine${m.job ? ' busy' : ' idle'}${droppable ? ' droppable' : ''}`}
                      style={droppable ? { borderColor: matchCfg.color + (isHov ? 'ff' : '88'), background: matchCfg.color + '0f' } : {}}
                      onClick={() => assign(i)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}>
                      <div className="oee-mach-head">
                        <span className="oee-mach-name">{m.name}</span>
                        <span className="oee-mach-spec" style={{ color: specCfg.color, borderColor: specCfg.color + '44', background: specCfg.color + '18' }}>{specCfg.label}</span>
                      </div>
                      {m.job ? (
                        <>
                          <div className="oee-mach-job">
                            <span className="oee-cat-dot" style={{ background: OEE_CAT[m.job.cat]?.color }} />{m.job.name}
                          </div>
                          <div className="oee-mach-match" style={{ color: OEE_MATCH[m.job.match].color }}>{OEE_MATCH[m.job.match].label} +{m.job.pts}pt</div>
                          <div className="oee-progress-bar"><div className="oee-progress-fill" style={{ width: `${m.progress * 100}%`, background: OEE_MATCH[m.job.match].color }} /></div>
                        </>
                      ) : droppable ? (
                        <div className="oee-mach-idle" style={{ color: matchCfg.color }}>{matchCfg.label} — ASSIGN</div>
                      ) : (
                        <div className="oee-mach-idle">[ STANDBY ]</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {selected && (
                <div className="oee-hint">
                  <span className="oee-cat-dot" style={{ background: OEE_CAT[selected.cat]?.color }} />
                  Selected: <b>{selected.name}</b>
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>PERFECT +3pt · WORKABLE +2pt · POOR FIT +1pt</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="oee-foot">
          <span>Done <b style={{ color: '#02B980' }}>{stats.done}</b></span>
          <span>Missed <b style={{ color: '#7A2808' }}>{stats.missed}</b></span>
          <span>Score <b style={{ color: '#028A5A' }}>{stats.pts}</b><span style={{ opacity: 0.5 }}>/{stats.maxPts}</span></span>
          <span className="oee-oee">OEE <b style={{ color: oee >= 70 ? '#02B980' : oee >= 40 ? '#028A5A' : '#7A2808' }}>{oee}%</b></span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, Impact, Frontier, JobsScene, JobsDrawer, OEEGame });
