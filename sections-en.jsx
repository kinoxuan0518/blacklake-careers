/* global React, window, JOBS, CATEGORIES, HERO_STATS, RECRUIT_URL, Arrow, useCountUp */

const { useState: useS, useMemo: useM, useRef: useR, useEffect: useE } = React;

// ─── Shared helpers ───────────────────────────────────────────────────────────
const _seededRand = (seed) => {
  let s = seed | 0;
  return () => { s = (s * 1664525 + 1013904223) | 0; return (s >>> 0) / 4294967296; };
};
function _jobHash(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h >>> 0;
}

// ═══════════════════════════════ Hero ═══════════════════════════════
function Hero({ onPrimary, onSecondary }) {
  const titleRef = useR(null);
  const canvasRef = useR(null);


  // ── Hero title wave effect: gaussian hill follows mouse X ──
  useE(() => {
    const title = titleRef.current;
    if (!title) return;

    let cxCache = null;
    let mouseX = -9999;
    let raf2 = null;

    const AMPLITUDE = 26;
    const SIGMA     = 190;
    const WAVE_K    = 0.018;

    const getSpans = () => Array.from(title.querySelectorAll('.hero-char'));

    const cacheX = () => {
      const rect = title.getBoundingClientRect();
      cxCache = getSpans().map(s => {
        const r = s.getBoundingClientRect();
        return r.left + r.width * 0.5 - rect.left;
      });
    };

    let dispY = [], velY = [];
    const initTimer = setTimeout(() => {
      cacheX();
      const n = getSpans().length;
      dispY = new Array(n).fill(0);
      velY  = new Array(n).fill(0);
    }, 350);

    const animate = () => {
      const spans = getSpans();
      if (!cxCache || spans.length !== dispY.length) { raf2 = requestAnimationFrame(animate); return; }

      let anyActive = false;
      spans.forEach((span, i) => {
        const dx = cxCache[i] - mouseX;
        const target = mouseX > -9000
          ? -AMPLITUDE * Math.exp(-(dx * dx) / (2 * SIGMA * SIGMA)) * Math.cos(dx * WAVE_K)
          : 0;

        velY[i] = velY[i] * 0.80 + (target - dispY[i]) * 0.14;
        dispY[i] += velY[i];

        if (Math.abs(dispY[i]) > 0.08 || Math.abs(velY[i]) > 0.02) {
          anyActive = true;
          span.style.transform = `translateY(${dispY[i].toFixed(1)}px)`;
        } else {
          dispY[i] = 0; velY[i] = 0;
          span.style.transform = '';
        }
      });

      if (anyActive || mouseX > -9000) raf2 = requestAnimationFrame(animate);
      else raf2 = null;
    };

    const onMove = e => {
      const r = title.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      if (!raf2) raf2 = requestAnimationFrame(animate);
    };
    const onLeave = () => { mouseX = -9999; };
    const onResize = () => setTimeout(cacheX, 80);

    title.addEventListener('mousemove', onMove);
    title.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(raf2);
      title.removeEventListener('mousemove', onMove);
      title.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="hero noise" id="top">
      <div className="glow-top" />

      <div className="wrap">
        <div>

          <h1 className="h-hero hero-title" ref={titleRef}>
            <span className="line"><span>{'The ultimate meaning'.split('').map((c,i)=><span key={i} className="hero-char">{c===' '?'\u00A0':c}</span>)}</span></span>
            <span className="line"><span>{'of code is to change'.split('').map((c,i)=><span key={i} className="hero-char">{c===' '?'\u00A0':c}</span>)}</span></span>
            <span className="line"><span>{'the '.split('').map((c,i)=><span key={i} className="hero-char">{c===' '?'\u00A0':c}</span>)}<em>{'real world'.split('').map((c,i)=><span key={i} className="hero-char">{c===' '?'\u00A0':c}</span>)}</em>{'.' .split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
          </h1>

          <p className="hero-sub reveal">
            Today, Blacklake's software runs inside tens of thousands of Chinese factories. There, every line of code
            impacts real production systems. We possess what AI needs most to land in manufacturing — real-world
            industrial scenarios and data. If that excites you even a little, keep reading.
          </p>

          <div className="hero-actions reveal d-1">
            <button className="btn" onClick={onPrimary}>
              View {JOBS.length} Open Roles <Arrow />
            </button>
            <button className="btn btn-ghost" onClick={onSecondary}>
              Learn Who We Are
            </button>
          </div>

          <div className="hero-meta">
            <OdometerStat value="40,000" suffix="+" label="Factories Served" duration={1800} delay={0} />
            <OdometerStat value="52.7" suffix="%" label="SaaS MES Market Share" duration={1600} delay={120} />
            <div className="cell reveal d-3">
              <div className="k">Founded</div>
              <div className="v">2016</div>
            </div>
            <div className="cell reveal d-4">
              <div className="k">Market Rank</div>
              <div className="v">No.<span style={{ color: "var(--green)" }}>1</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════ About ═══════════════════════════════
function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow"><span className="dot" /><span className="num">01</span><span>Who We Are</span></div>
          </div>
          <div>
            <LiquidHeading className="h-1">Bringing <em className="green italic">AI</em> into the factory's decisions</LiquidHeading>
          </div>
        </div>

        <div className="article reveal d-1">
          <aside className="side">
            <div className="corner">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Context</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.55, letterSpacing: "-0.01em", color: "var(--fg-2)" }}>
                China has millions of small and medium factories. They are the capillaries of manufacturing — supporting countless jobs and the last mile of supply chains — yet they are almost entirely silent.
              </div>
            </div>
          </aside>

          <div>
            <p className="lead drop">
              For ten years we walked into workshops, ate and lived alongside workers, and moved production to the cloud — reaching <b style={{ color: "var(--fg)" }}>52.7% market share</b> as China's #1 cloud MES, serving <b style={{ color: "var(--fg)" }}>40,000+ factories</b>. That gave us the scarcest thing in AI deployment: real-world industrial scenarios. Today Blacklake has shipped <b style={{ color: "var(--fg)" }}>industrial AI Agents</b> onto real production lines, spanning design, scheduling, production, and quality, having executed <b style={{ color: "var(--fg)" }}>over 160 million tasks</b>. We're the only Chinese name in industrial AI among the World Economic Forum's first cohort of global AI-industrialization benchmarks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── BigMark scroll-reveal ───────────────────────────────────────────────────
function BigMarkReveal() {
  const ref = useR(null);
  const [prog, setProg] = useS(0);
  useE(() => {
    const update = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setProg(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  const lit = (n, total) => prog >= n / total;
  return (
    <div ref={ref} className="bigmark">
      <span style={{ display: 'block' }}>
        <span className={`bm-word bm-outline${lit(1,6)?' bm-lit':''}`}>Every</span>
        {' '}<span className={`bm-word${lit(2,6)?' bm-lit':''}`}>line of </span>
        <span className={`bm-word bm-em${lit(2,6)?' bm-lit':''}`}>code</span>
      </span>
      <span style={{ display: 'block', marginTop: 8 }}>
        <span className={`bm-word${lit(3,6)?' bm-lit':''}`}>hits a </span>
        <span className={`bm-word bm-em${lit(4,6)?' bm-lit':''}`}>real</span>
      </span>
      <span style={{ display: 'block', marginTop: 8 }}>
        <span className={`bm-word${lit(5,6)?' bm-lit':''}`}>factory floor.</span>
      </span>
    </div>
  );
}



// ═══════════════════════════════ Jobs ═══════════════════════════════
function Jobs() {
  return (
    <section className="section" id="jobs">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow"><span className="dot" /><span className="num">03</span><span>Open Roles</span></div>
          </div>
          <div>
            <LiquidHeading className="h-1">Finding the next <em className="green italic">right person</em></LiquidHeading>
            <p className="sub">All roles live on our Feishu recruiting site, updated in real time — pick a category to see open positions for that team.</p>
          </div>
        </div>

        <div className="job-cats reveal d-1">
          {CATEGORIES.map((c) => (
            <a key={c} className="job-cat" href={RECRUIT_URL} target="_blank" rel="noopener noreferrer">
              <span className="job-cat-name">{c}</span>
              <span className="job-cat-arrow">→</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}









// ═══════════════════════════════ CTA ═══════════════════════════════
function CTA({ onApply }) {
  return (
    <section className="section-sm" id="create-role">
      <div className="wrap">
        <div className="cta-block reveal">
          <div>
            <div className="eyebrow" style={{ color: "var(--fg-4)", marginBottom: 24 }}>
              <span className="dot" /><span className="num">04</span><span>Nothing fits?</span>
            </div>
            <h2>Then <em className="green italic">create</em><br />your own role.</h2>
            <p className="cta-sub">We believe the right person matters more than the right opening.<br/>If nothing above moves you, tell us what you want to build — send a resume, a portfolio, a paragraph.</p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-ghost" href="mailto:careers@blacklake.cn?subject=I want to create a role at Blacklake">Write to us</a>
            <button className="btn" onClick={onApply}>Back to roles <Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ Manifesto (Belief) ═══
function Manifesto() {
  return (
    <section className="section" id="manifesto">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow"><span className="dot" /><span className="num">02</span><span>Belief</span></div>
          </div>
          <div />
        </div>
        <div style={{ marginTop: 32 }}>
          <BigMarkReveal />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════ Footer ═══════════════════════════════
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <img src="logo.png" alt="Blacklake" className="logo-img" />
            </div>
            <p style={{ maxWidth: "36ch", lineHeight: 1.72, color: "var(--fg-3)", fontSize: 14 }}>
              Blacklake — an industrial software + AI company. Our goal is simple: let data and AI drive manufacturing.
            </p>
          </div>
          <div>
            <h4>Careers</h4>
            <ul>
              <li><a href="#jobs">Open Roles</a></li>
              <li><a href="#process">How to Join</a></li>
              <li><a href="#perks">Perks & Benefits</a></li>
              <li><a href="#">Campus Recruiting</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#stories">Team Stories</a></li>
              <li><a href="#life">Offices</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:careers@blacklake.cn">careers@blacklake.cn</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">WeChat</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <div>© 2026 Black Lake Technologies</div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════ OEE Mini-game (Easter Egg) ═══════════════════════════════
const OEE_CAT_EN = {
  assembly: { label: 'Assembly',  color: '#02B980' },
  ai:       { label: 'AI · Data', color: '#40D898' },
  quality:  { label: 'Quality',   color: '#028A5A' },
};
const OEE_MACH_DEF_EN = [
  { name: 'Line A',     pref: 'assembly', ok: 'ai',       bad: 'quality' },
  { name: 'Line B',     pref: 'ai',       ok: 'assembly', bad: 'quality' },
  { name: 'QC Station', pref: 'quality',  ok: 'ai',       bad: 'assembly' },
];
const OEE_JOBS_DEF_EN = [
  { name: 'Changeover Optimization',   dur: 8,  u: 1, cat: 'assembly' },
  { name: 'Gantt Schedule Refresh',    dur: 5,  u: 0, cat: 'assembly' },
  { name: 'Work Order Board Update',   dur: 7,  u: 1, cat: 'assembly' },
  { name: 'MES Schedule Push',         dur: 10, u: 0, cat: 'assembly' },
  { name: 'Shift Report Summary',      dur: 6,  u: 1, cat: 'assembly' },
  { name: 'Equipment Param Sync',      dur: 9,  u: 0, cat: 'assembly' },
  { name: 'AI Vision Calibration',     dur: 9,  u: 1, cat: 'ai'       },
  { name: 'Capacity Forecast Model',   dur: 12, u: 0, cat: 'ai'       },
  { name: 'Inventory Alert Analysis',  dur: 10, u: 1, cat: 'ai'       },
  { name: 'Scheduling Algorithm Train',dur: 13, u: 0, cat: 'ai'       },
  { name: 'Anomaly Detection Model',   dur: 8,  u: 1, cat: 'ai'       },
  { name: 'Data Sync Push',            dur: 6,  u: 0, cat: 'ai'       },
  { name: 'Quality Report Generate',   dur: 8,  u: 0, cat: 'quality'  },
  { name: 'SPC Control Chart Update',  dur: 7,  u: 1, cat: 'quality'  },
  { name: 'Equipment OEE Calc',        dur: 9,  u: 0, cat: 'quality'  },
  { name: 'Defect Traceability',       dur: 11, u: 1, cat: 'quality'  },
  { name: 'Supplier QC Audit',         dur: 12, u: 0, cat: 'quality'  },
  { name: 'First-Pass Yield Stats',    dur: 6,  u: 1, cat: 'quality'  },
];
const OEE_MATCH_EN = {
  perfect: { mul: 1.0, pts: 3, label: 'Perfect',  color: '#02B980' },
  ok:      { mul: 1.6, pts: 2, label: 'Workable', color: '#028A5A' },
  bad:     { mul: 2.5, pts: 1, label: 'Poor Fit', color: '#7A2808' },
};
const OEE_EXPIRE_MS_EN = 18000, OEE_SPAWN_MS_EN = 3500, OEE_MAX_Q_EN = 8;
let _oeeJobIdEN = 0;
function _oeeMatchEN(mIdx, cat) {
  const m = OEE_MACH_DEF_EN[mIdx];
  if (m.pref === cat) return 'perfect';
  if (m.ok   === cat) return 'ok';
  return 'bad';
}

function OEEGame() {
  const [active, setActive] = useS(false);
  const [timeLeft, setTimeLeft] = useS(60);
  const [queue, setQueue] = useS([]);
  const [machines, setMachines] = useS(OEE_MACH_DEF_EN.map((d, i) => ({ ...d, i, job: null, progress: 0 })));
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
    _oeeJobIdEN = 0;
    setTimeLeft(60); setQueue([]); setSelected(null); setHovered(null); setEnded(false);
    setStats({ done: 0, missed: 0, total: 0, pts: 0, maxPts: 0 });
    setMachines(OEE_MACH_DEF_EN.map((d, i) => ({ ...d, i, job: null, progress: 0 })));
  }

  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => setTimeLeft(v => { if (v <= 1) { setEnded(true); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [active, ended]);

  useE(() => {
    if (!active || ended) return;
    const spawn = () => {
      const tpl = OEE_JOBS_DEF_EN[Math.floor(Math.random() * OEE_JOBS_DEF_EN.length)];
      const job = { id: ++_oeeJobIdEN, name: tpl.name, dur: tpl.dur, u: tpl.u, cat: tpl.cat, born: Date.now(), expireAt: Date.now() + OEE_EXPIRE_MS_EN };
      setStats(s => ({ ...s, total: s.total + 1, maxPts: s.maxPts + 3 }));
      setQueue(q => q.length >= OEE_MAX_Q_EN ? q : [...q, job]);
    };
    spawn();
    const t = setInterval(spawn, OEE_SPAWN_MS_EN);
    return () => clearInterval(t);
  }, [active, ended]);

  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => {
      const n = Date.now(); setNow(n);
      setQueue(q => { const gone = q.filter(j => n > j.expireAt); if (gone.length) setStats(s => ({ ...s, missed: s.missed + gone.length })); return q.filter(j => n <= j.expireAt); });
      setMachines(ms => ms.map(m => {
        if (!m.job) return m;
        const p = Math.min((n - m.job.startedAt) / 1000 / m.job.effDur, 1);
        if (p >= 1) { setStats(s => ({ ...s, done: s.done + 1, pts: s.pts + m.job.pts })); return { ...m, job: null, progress: 0 }; }
        return { ...m, progress: p };
      }));
    }, 200);
    return () => clearInterval(t);
  }, [active, ended]);

  const assign = (mIdx) => {
    if (!selected || machines[mIdx].job) return;
    const match = _oeeMatchEN(mIdx, selected.cat);
    const cfg = OEE_MATCH_EN[match];
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

        {/* Header */}
        <div className="oee-head">
          <div className="oee-title"><span className="oee-logo-dot" /><span>DISPATCH · SYS</span><span className="oee-badge">● ONLINE</span></div>
          <div className="oee-legend">
            {Object.entries(OEE_CAT_EN).map(([k, v]) => (
              <span key={k} className="oee-legend-item">
                <span className="oee-legend-dot" style={{ background: v.color }} />{v.label}
              </span>
            ))}
          </div>
          <div className="oee-timer-wrap">
            <div className="oee-timer-bar"><div className="oee-timer-fill" style={{ width: `${timerPct}%`, background: timeLeft < 15 ? '#C03010' : '#02B980' }} /></div>
            <span className="oee-timer-num" style={{ color: timeLeft < 15 ? '#C03010' : '#02B980' }}>{timeLeft}s</span>
          </div>
          <button className="oee-close" onClick={() => setActive(false)}>×</button>
        </div>

        {ended ? (
          <div className="oee-end">
            <div className="oee-end-label">MISSION COMPLETE · OEE RATING</div>
            <div className="oee-end-score" style={{ color: oee >= 80 ? '#02B980' : oee >= 50 ? '#028A5A' : '#7A2808' }}>{oee}<span>%</span></div>
            <div className="oee-end-sub">Score {stats.pts}/{stats.maxPts} · Done {stats.done} · Missed {stats.missed}</div>
            <div className="oee-end-tip">{oee >= 85 ? 'Perfect scheduling! Factory at full capacity.' : oee >= 60 ? 'Good — match jobs to their preferred machines.' : 'Tip: matching job colors to machines gives 3× points.'}</div>
            <button className="btn" onClick={resetGame}>[ RESTART ]</button>
          </div>
        ) : (
          <div className="oee-body">

            {/* Job queue */}
            <div className="oee-queue">
              <div className="oee-col-label">INCOMING <span style={{ color: '#3A1A06' }}>{queue.length}/{OEE_MAX_Q_EN}</span></div>
              {queue.length === 0 && <div className="oee-empty">AWAITING INPUT...</div>}
              {queue.map(j => {
                const cc = OEE_CAT_EN[j.cat];
                const expPct = Math.max(0, (j.expireAt - now) / OEE_EXPIRE_MS_EN * 100);
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

            {/* Machines */}
            <div className="oee-machines">
              <div className="oee-col-label">WORK CELLS</div>
              <div className="oee-machine-grid">
                {machines.map((m, i) => {
                  const def = OEE_MACH_DEF_EN[i];
                  const specCfg = OEE_CAT_EN[def.pref];
                  const match = selected ? _oeeMatchEN(i, selected.cat) : null;
                  const matchCfg = match ? OEE_MATCH_EN[match] : null;
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
                            <span className="oee-cat-dot" style={{ background: OEE_CAT_EN[m.job.cat]?.color }} />{m.job.name}
                          </div>
                          <div className="oee-mach-match" style={{ color: OEE_MATCH_EN[m.job.match].color }}>{OEE_MATCH_EN[m.job.match].label} +{m.job.pts}pt</div>
                          <div className="oee-progress-bar"><div className="oee-progress-fill" style={{ width: `${m.progress * 100}%`, background: OEE_MATCH_EN[m.job.match].color }} /></div>
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
                  <span className="oee-cat-dot" style={{ background: OEE_CAT_EN[selected.cat]?.color }} />
                  Selected: <b>{selected.name}</b>
                  <span style={{ color: '#021A0C', marginLeft: 8 }}>Perfect +3pt · Workable +2pt · Poor fit +1pt</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="oee-foot">
          <span>Done <b style={{ color: '#02B980', textShadow: '0 0 8px rgba(2,185,128,0.55)' }}>{stats.done}</b></span>
          <span>Missed <b style={{ color: '#7A2808' }}>{stats.missed}</b></span>
          <span>Score <b style={{ color: '#028A5A' }}>{stats.pts}</b><span style={{ color: '#021A0C' }}>/{stats.maxPts}</span></span>
          <span className="oee-oee">OEE <b style={{ color: oee >= 70 ? '#02B980' : oee >= 40 ? '#028A5A' : '#7A2808', textShadow: oee >= 70 ? '0 0 8px rgba(2,185,128,0.5)' : 'none' }}>{oee}%</b></span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, About, Jobs, CTA, Footer, Manifesto, OEEGame });
