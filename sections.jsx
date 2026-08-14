/* global React, window, JOBS, CATEGORIES, HERO_STATS, RECRUIT_URL, HERO_VARIANT, Arrow, useCountUp */

const { useState: useS, useMemo: useM, useRef: useR, useEffect: useE } = React;

// ═══════════════════════════════ Hero ═══════════════════════════════
function Hero({ onPrimary, onSecondary }) {
  const titleRef = useR(null);
  const canvasRef = useR(null);


  // ── Hero title wave effect: gaussian hill follows mouse X ──
  useE(() => {
    const title = titleRef.current;
    if (!title) return;

    // cx per character (relative to title left edge)
    let cxCache = null;
    let mouseX = -9999;
    let raf2 = null;

    const AMPLITUDE = 26;  // px upward at peak
    const SIGMA     = 190; // gaussian width (px)
    const WAVE_K    = 0.018; // cosine ripple freq → wave shape, not just a bump

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
        // Wave shape: gaussian envelope × cosine → peak at mouse, oscillating tails
        const target = mouseX > -9000
          ? -AMPLITUDE * Math.exp(-(dx * dx) / (2 * SIGMA * SIGMA)) * Math.cos(dx * WAVE_K)
          : 0;

        // Spring-damper toward target
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
      <div className="wrap">
        {HERO_VARIANT === 1 && (
          /* ── 画面 1：使命陈述（纯文字 + 按钮）── */
          <div className="hero-v1">
            <div className="eyebrow hero-kicker reveal"><span className="dot" />Blacklake · Industrial AI</div>
            <h1 className="h-hero hero-title" ref={titleRef}>
              <span className="line"><span>{'未来十年最大的AI应用'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'不会只发生在互联网'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'而会深入真实世界'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'重塑制造业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}<em>{'这一全球最大产业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</em></span></span>
            </h1>
            <p className="hero-sub reveal">
              如果你希望参与定义下一代工业 AI 的产品与技术，我们期待与你一起，把想象变成现实。
            </p>
            <div className="hero-actions reveal d-1">
              <button className="btn" onClick={onPrimary}>查看 {JOBS.length} 个在招职位 <Arrow /></button>
            </div>
          </div>
        )}

        {HERO_VARIANT === 2 && (
          /* ── 画面 2：使命陈述 + 真实数据墙 ── */
          <div className="hero-v2">
            <div className="eyebrow hero-kicker reveal"><span className="dot" />Blacklake · Industrial AI</div>
            <h1 className="h-hero hero-title" ref={titleRef}>
              <span className="line"><span>{'未来十年最大的AI应用'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'不会只发生在互联网'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'而会深入真实世界'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'重塑制造业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}<em>{'这一全球最大产业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</em></span></span>
            </h1>
            <div className="hero-actions reveal d-1">
              <button className="btn" onClick={onPrimary}>查看 {JOBS.length} 个在招职位 <Arrow /></button>
            </div>
            <div className="hero-meta hero-meta-strong reveal d-2">
              <OdometerStat value="40,000" suffix="+" label="工厂正在使用黑湖" duration={1800} delay={0} />
              <OdometerStat value="52.7" suffix="%" label="中国云化 MES 市占率第一" duration={1600} delay={120} />
              <div className="cell reveal d-3"><div className="k">累计执行任务</div><div className="v">1.6<span className="unit">亿次</span></div></div>
              <div className="cell reveal d-4"><div className="k">工业 AI 领域</div><div className="v">WEF<span className="unit">入选</span></div></div>
            </div>
          </div>
        )}

        {HERO_VARIANT === 3 && (
          /* ── 画面 3：使命陈述 + 工业 x AI 合成（数据流注入产线）── */
          <div className="hero-v3">
            <div className="eyebrow hero-kicker reveal"><span className="dot" />Blacklake · Industrial AI</div>
            <h1 className="h-hero hero-title" ref={titleRef}>
              <span className="line"><span>{'未来十年最大的AI应用'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'不会只发生在互联网'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'而会深入真实世界'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</span></span>
              <span className="line"><span>{'重塑制造业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}<em>{'这一全球最大产业'.split('').map((c,i)=><span key={i} className="hero-char">{c}</span>)}</em></span></span>
            </h1>
            <div className="hero-actions reveal d-1">
              <button className="btn" onClick={onPrimary}>查看 {JOBS.length} 个在招职位 <Arrow /></button>
            </div>
            <div className="hero-flow reveal d-2" aria-hidden="true">
              <div className="flow-line" />
              <div className="flow-line flow-line-2" />
              <div className="flow-line flow-line-3" />
            </div>
          </div>
        )}
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
            <div className="eyebrow"><span className="dot" /><span className="num">01</span><span>我们是谁</span></div>
          </div>
          <div>
            <LiquidHeading className="h-1">让<em className="green italic">AI</em>真正帮助工厂决策</LiquidHeading>
          </div>
        </div>

        <div className="article reveal d-1">
          <aside className="side">
            <div className="corner">
              <div className="eyebrow" style={{ marginBottom: 12 }}>背景</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.55, letterSpacing: "-0.01em", color: "var(--fg-2)" }}>
                中国有数百万中小工厂。它们是制造业的毛细血管，承载着无数就业和产业链的末端环节——但它们几乎是沉默的。
              </div>
            </div>
          </aside>

          <div>
            <p className="lead drop">
              过去十年，我们走进车间、跟工人同吃同住，把生产搬上云端，以 <b style={{ color: "var(--fg)" }}>52.7% 的市占率</b>位居中国云化 MES 第一，服务 <b style={{ color: "var(--fg)" }}>40,000+ 家工厂</b>。这给了我们一件 AI 落地最稀缺的东西——真实世界的工业场景。今天，黑湖已经将<b style={{ color: "var(--fg)" }}>工业 AI Agent</b> 送进真实产线，覆盖设计、排程、生产、质检，累计执行任务<b style={{ color: "var(--fg)" }}>超 1.6 亿次</b>，并入选世界经济论坛首批全球 AI 产业化标杆——工业 AI 领域唯一的中国面孔。
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
        <span className={`bm-word${lit(1,5)?' bm-lit':''}`}>每一行</span>
        <span className={`bm-word bm-em${lit(2,5)?' bm-lit':''}`}>代码</span>
        <span className={`bm-word${lit(2,5)?' bm-lit':''}`}>，</span>
      </span>
      <span style={{ display: 'block', marginTop: 8 }}>
        <span className={`bm-word${lit(3,5)?' bm-lit':''}`}>都落在</span>
        <span className={`bm-word bm-em${lit(4,5)?' bm-lit':''}`}>真实</span>
        <span className={`bm-word${lit(5,5)?' bm-lit':''}`}>的车间。</span>
      </span>
    </div>
  );
}

// ═══════════════════════════════ Jobs ═══════════════════════════════
// ═══════════════════════════════ Jobs (分类标签 → 飞书招聘官网) ═══════════════════════════════
function Jobs() {
  return (
    <section className="section" id="jobs">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow"><span className="dot" /><span className="num">03</span><span>在招职位</span></div>
          </div>
          <div>
            <LiquidHeading className="h-1">找到下一个<em className="green italic">同行者</em></LiquidHeading>
            <p className="sub">岗位都在飞书招聘官网实时更新——点分类直接看对应团队的在招职位。</p>
          </div>
        </div>

        {/* 分类标签 → 跳飞书招聘官网（带筛选参数，TODO: 按飞书官网实际参数格式调整） */}
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
              <span className="dot" /><span className="num">04</span><span>没有合适的？</span>
            </div>
            <h2>那就 <em className="green italic">自己创造</em><br />一个岗位。</h2>
            <p className="cta-sub">我们相信，对的人比对的岗位更重要。<br/>如果上面的列表里没有让你心动的，告诉我们你想做什么——把简历、作品、一段话砸过来。</p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-ghost" href="mailto:careers@blacklake.cn?subject=我想为黑湖创造一个岗位">写信告诉我们</a>
            <button className="btn" onClick={onApply}>再看一眼职位 <Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════ Footer ═══════════════════════════════
function Footer() {
  return (
    <footer className="foot" id="contact">
      <div className="wrap">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: 48,
          paddingBlock: "32px 24px",
        }}>
          <div>
            <div className="logo" style={{ marginBottom: 24 }}>
              <img src="logo.png" alt="Heihu" className="logo-img" />
            </div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              lineHeight: 2,
            }}>
              <div>SHANGHAI · 31°12'N 121°28'E</div>
              <div>SINGAPORE · 1°17'N 103°51'E</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <a
              href="mailto:careers@blacklake.cn"
              style={{
                fontFamily: "var(--serif)",
                fontSize: 28,
                color: "var(--fg)",
                textDecoration: "none",
                borderBottom: "1px solid var(--line-2)",
                paddingBottom: 4,
                letterSpacing: "-0.01em",
              }}
            >
              careers@blacklake.cn <Arrow />
            </a>
          </div>
        </div>
        <div className="foot-bot" style={{ marginTop: 56 }}>
          <div>© 2026 黑湖网络科技 · Black Lake Technologies</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════ OEE Mini-game (Easter Egg) ═══════════════════════════════
// Job categories + machine specializations
const OEE_CAT = {
  assembly: { label: '装配·排产', color: '#02B980' },
  ai:       { label: 'AI·数据',   color: '#40D898' },
  quality:  { label: '质量·报表', color: '#028A5A' },
};
const OEE_MACH_DEF = [
  { name: '装配线A', pref: 'assembly', ok: 'ai',      bad: 'quality' },
  { name: '装配线B', pref: 'ai',       ok: 'assembly', bad: 'quality' },
  { name: '质检台',  pref: 'quality',  ok: 'ai',       bad: 'assembly' },
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
// match → { dur multiplier, points, label, color }
const OEE_MATCH = {
  perfect: { mul: 1.0, pts: 3, label: '完美匹配', color: '#02B980' },
  ok:      { mul: 1.6, pts: 2, label: '勉强可做', color: '#028A5A' },
  bad:     { mul: 2.5, pts: 1, label: '不擅长！', color: '#7A2808' },
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

  // Countdown
  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => setTimeLeft(v => { if (v <= 1) { setEnded(true); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [active, ended]);

  // Job spawner
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

  // Machine progress + expiry tick
  useE(() => {
    if (!active || ended) return;
    const t = setInterval(() => {
      const now = Date.now();
      setNow(now);
      // expire queue
      setQueue(q => {
        const gone = q.filter(j => now > j.expireAt);
        if (gone.length) setStats(s => ({ ...s, missed: s.missed + gone.length }));
        return q.filter(j => now <= j.expireAt);
      });
      // machine progress
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

        {/* Header */}
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
            <div className="oee-end-sub">得分 {stats.pts}/{stats.maxPts} · 完成 {stats.done} · 错过 {stats.missed}</div>
            <div className="oee-end-tip">{oee >= 85 ? '完美调度！工厂满负荷运转' : oee >= 60 ? '良好 — 注意把作业分配给擅长的机器' : '提示：颜色相同的作业和机器配对可以获得3倍得分'}</div>
            <button className="btn" onClick={resetGame}>[ RESTART ]</button>
          </div>
        ) : (
          <div className="oee-body">

            {/* Job queue */}
            <div className="oee-queue">
              <div className="oee-col-label">INCOMING <span style={{ color: '#3A1A06' }}>{queue.length}/{OEE_MAX_Q}</span></div>
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

            {/* Machines */}
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
                  已选：<b>{selected.name}</b>
                  <span style={{ color: '#021A0C', marginLeft: 8 }}>完美匹配 +3pt · 勉强可做 +2pt · 不擅长 +1pt</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="oee-foot">
          <span>完成 <b style={{ color: '#02B980', textShadow: '0 0 8px rgba(2,185,128,0.55)' }}>{stats.done}</b></span>
          <span>错过 <b style={{ color: '#7A2808' }}>{stats.missed}</b></span>
          <span>得分 <b style={{ color: '#028A5A' }}>{stats.pts}</b><span style={{ color: '#021A0C' }}>/{stats.maxPts}</span></span>
          <span className="oee-oee">OEE <b style={{ color: oee >= 70 ? '#02B980' : oee >= 40 ? '#028A5A' : '#7A2808', textShadow: oee >= 70 ? '0 0 8px rgba(2,185,128,0.5)' : 'none' }}>{oee}%</b></span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════ Manifesto (Hedge-fund minimal) ═════════════
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

Object.assign(window, { Hero, About, Jobs, CTA, Footer, Manifesto, OEEGame });
