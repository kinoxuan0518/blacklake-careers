/* global React, window, SIGNALS, PRELUDE_LINES, ORDER_TICKET, JUDGMENTS, IMPACT_SHOTS, QUESTIONS, JOB_NODES, SYSTEM_FLOW, JOBS, CATEGORIES, RECRUIT_URL */
// ============ Blacklake Careers v6 · 场景（流动的工厂） ============

// ═══════════ 00 Prelude：一个工厂每天要做多少判断 ═══════════
function Prelude({ active, leaving, onSkip }) {
  return (
    <section className={`scene prelude ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <div className="prelude-head">
        <span>FACTORY INPUT / LIVE</span>
        <span>SHANGHAI · 2026</span>
      </div>
      <div className="signal-space" aria-hidden="true">
        <div className="blueprint">
          <span className="bp-circle bp-one" />
          <span className="bp-circle bp-two" />
          <span className="bp-axis bp-axis-x" />
          <span className="bp-axis bp-axis-y" />
          <span className="bp-dim dim-one">84.00 ±0.02</span>
          <span className="bp-dim dim-two">Ø 12 H7</span>
        </div>
        {SIGNALS.map((s, i) => (
          <div className={`signal ${s.cls}`} key={s.kind} style={{ "--i": i }}>
            <span className="signal-kind">{s.kind}</span>
            <strong>{s.value}</strong>
            <small>{s.meta}</small>
          </div>
        ))}
        <div className="conn conn-a" /><div className="conn conn-b" />
        <div className="conn conn-c" /><div className="conn conn-d" />
        <div className="core"><i /><span>INTELLIGENCE</span></div>
      </div>
      <div className="prelude-copy">
        <p className="prelude-line line-one">{PRELUDE_LINES[0]}</p>
        <p className="prelude-line line-two">{PRELUDE_LINES[1]}</p>
      </div>
      <button className="skip-intro" onClick={onSkip}>跳过开场 <span>SPACE</span></button>
      <div className="intro-timeline" aria-hidden="true"><i /><span>INTRO</span></div>
    </section>
  );
}

// ═══════════ 01 Hero：让智能进入工厂，产生真实价值 ═══════════
function Hero({ active, leaving, onExplore, onApply }) {
  return (
    <section className={`scene hero ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <div className="hero-cad" aria-hidden="true">
        <span className="hero-ring ring-a" /><span className="hero-ring ring-b" />
        <span className="hero-axis axis-a" /><span className="hero-axis axis-b" />
        <span className="hero-tag tag-a">ORDER / #BL-240817</span>
        <span className="hero-tag tag-b">INTELLIGENCE / ONLINE</span>
        <span className="hero-tag tag-c">OUTPUT / 生产路径</span>
        <span className="hero-flow" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">INTELLIGENCE × MANUFACTURING</p>
        <h1>让智能进入工厂<br /><span className="sub">产生真实价值</span></h1>
        <p className="hero-lede">让软件不只记录生产，而开始理解、判断和行动。40,000+ 工厂已经在黑湖的系统里运转——现在，我们要让智能住进去。</p>
        <div className="hero-actions">
          <button className="btn" onClick={onExplore}>探索我们在做什么 <span className="arw">↓</span></button>
          <button className="btn btn-paper" onClick={() => onApply("全部")}>查看开放职位 <span className="arw">↗</span></button>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span>SCROLL · FOLLOW THE ORDER</span><i /></div>
    </section>
  );
}

// ═══════════ 02 One Order：这单，能不能接 ═══════════
function Order({ active, leaving, prog }) {
  const resolvedCount = Math.min(4, Math.max(0, Math.ceil(prog * 4.7)));
  const conv = prog > 0.55;
  return (
    <section className={`scene order ${active ? "is-active" : ""} ${leaving ? "leaving" : ""} ${conv ? "conv" : ""}`} aria-hidden={!active}>
      <div className="order-grid" aria-hidden="true" />
      <header className="order-heading">
        <p>ONE ORDER / REAL CONSTRAINTS</p>
        <h2>这单，<span>能不能接？</span></h2>
      </header>
      <article className="ticket">
        <div className="ticket-top"><span>INCOMING ORDER</span><span>17:42:08</span></div>
        <strong>{ORDER_TICKET.no}</strong>
        <p>{ORDER_TICKET.name}</p>
        <div className="ticket-meta">{ORDER_TICKET.meta.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="ticket-bar" aria-hidden="true" />
      </article>
      <div className="decision-stream stream" aria-label="订单判断过程">
        {JUDGMENTS.map((j, i) => {
          const on = i < resolvedCount;
          return (
            <div className={`node ${on ? "resolved" : ""}`} key={j.no}>
              <div className="node-idx">{j.no}</div>
              <div className="node-copy">
                <span>{j.label}</span>
                <strong>{j.value}</strong>
                <small>{j.detail}</small>
              </div>
              <div className="node-state"><i />{on ? j.state : "等待判断"}</div>
            </div>
          );
        })}
      </div>
      <div className="smart" aria-hidden={!conv}>
        <div className="smart-in">
          {SMART_IN.map((s) => <div key={s}>{s}</div>)}
        </div>
        <div className="smart-core"><i /></div>
        <div className="smart-out">
          {SMART_OUT.map((s) => <div key={s}>{s}</div>)}
        </div>
      </div>
      <p className="smart-line">{SMART_LINE}</p>
      <div className={`verdict ${prog > 0.88 ? "resolved" : ""}`}>
        <span>DECISION / CONFIDENCE 94%</span>
        <strong>可以接。</strong>
        <p>已生成生产路径 · 主要风险：阳极氧化产能窗口</p>
      </div>
      <div className="order-progress" aria-hidden="true">
        <span>ORDER</span>
        <div><i style={{ width: `${Math.max(6, prog * 100)}%` }} /></div>
        <span>DECISION</span>
      </div>
      <p className="order-note">继续滚动，让判断依次发生</p>
    </section>
  );
}

// ═══════════ 04 Impact：模型里的答案不是终点 ═══════════
function Impact({ active, leaving }) {
  return (
    <section className={`scene impact ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <header className="impact-head">
        <p>IMPACT / REAL WORLD</p>
        <h2>模型里的答案，不是终点。<br /><span>工厂里发生改变，才是。</span></h2>
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
      <p className="impact-line">你写的一行代码、一个模型、一个产品判断，<b>最终会进入一条真实的产线。</b></p>
    </section>
  );
}

// ═══════════ 05 Frontier：很多问题，还没有答案 ═══════════
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
        <h2>很多问题，<span>还没有答案。</span></h2>
      </header>
      <div className="fork" aria-hidden="true">
        <span className="conf">CONFIDENCE <b>{conf}%</b></span>
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
      <p className="frontier-note">前面你是观众。从这里开始，你可能是一起解决这些问题的人。</p>
    </section>
  );
}

// ═══════════ 07 Jobs：你想进入哪一段 ═══════════
function JobsScene({ active, leaving, onNode }) {
  return (
    <section className={`scene jobs-scene ${active ? "is-active" : ""} ${leaving ? "leaving" : ""}`} aria-hidden={!active}>
      <header className="jobs-head">
        <p>JOBS / FIND WHERE YOU FIT</p>
        <h2>这个系统里，<span>哪一部分是你想参与构建的？</span></h2>
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
                <span className="jn-count">{count} 个开放岗位</span>
                <span className="jn-go">进入 ↗</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="jobs-foot">
        <a href="mailto:careers@blacklake.cn">careers@blacklake.cn →</a>
        <span>© 2026 黑湖科技 BLACKLAKE</span>
      </div>
    </section>
  );
}

// ═══════════ 职位抽屉：纸的反转，30 秒可投递 ═══════════
function JobsDrawer({ open, filter, onFilter, onClose }) {
  const counts = {};
  JOBS.forEach((j) => { counts[j.category] = (counts[j.category] || 0) + 1; });
  const list = filter === "全部" ? JOBS : JOBS.filter((j) => j.category === filter);
  return (
    <React.Fragment>
      <button className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} aria-label="关闭职位列表" tabIndex={-1} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="开放职位">
        <div className="drawer-head">
          <div>
            <span>JOIN BLACK LAKE</span>
            <h2>加入黑湖</h2>
          </div>
          <button className="drawer-close" onClick={onClose}>关闭 ×</button>
        </div>
        <p className="drawer-intro">到真实的制造现场，解决 AI 还没有答案的问题。点击岗位，前往飞书招聘完成投递。</p>
        <div className="drawer-filters">
          <button className={filter === "全部" ? "selected" : ""} onClick={() => onFilter("全部")}>
            全部 {JOBS.length}
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
        <p className="drawer-foot">投递入口接入飞书招聘 · 简历直达用人团队</p>
      </aside>
    </React.Fragment>
  );
}

// ═══════════ OEE Mini-game (Easter Egg · 三连击 logo 触发) ═══════════
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
            <div className="oee-end-sub">得分 {stats.pts}/{stats.maxPts} · 完成 {stats.done} · 错过 {stats.missed}</div>
            <div className="oee-end-tip">{oee >= 85 ? '完美调度！工厂满负荷运转' : oee >= 60 ? '良好 — 注意把作业分配给擅长的机器' : '提示：颜色相同的作业和机器配对可以获得3倍得分'}</div>
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
                  已选：<b>{selected.name}</b>
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>完美匹配 +3pt · 勉强可做 +2pt · 不擅长 +1pt</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="oee-foot">
          <span>完成 <b style={{ color: '#02B980' }}>{stats.done}</b></span>
          <span>错过 <b style={{ color: '#7A2808' }}>{stats.missed}</b></span>
          <span>得分 <b style={{ color: '#028A5A' }}>{stats.pts}</b><span style={{ opacity: 0.5 }}>/{stats.maxPts}</span></span>
          <span className="oee-oee">OEE <b style={{ color: oee >= 70 ? '#02B980' : oee >= 40 ? '#028A5A' : '#7A2808' }}>{oee}%</b></span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Prelude, Hero, Order, Impact, Frontier, JobsScene, JobsDrawer, OEEGame });
