/* global React, window, CHAPTERS */
// ============ Blacklake Careers v6 · 组件（流动的工厂） ============
const { useState: useS, useEffect: useE, useRef: useR } = React;

// ── 顶栏：品牌（单击回 Hero / 三连击触发彩蛋）+ 章节坐标 + 常驻投递口 ──
function Nav({ scene, onChapter, onApply, lang }) {
  const clicks = useR({ n: 0, t: 0 });
  const onBrand = () => {
    const now = Date.now();
    const c = clicks.current;
    c.n = now - c.t < 500 ? c.n + 1 : 1;
    c.t = now;
    if (c.n >= 3) {
      c.n = 0;
      window.dispatchEvent(new Event("oee-game"));
      return;
    }
    onChapter("hero");
  };
  return (
    <nav className="topbar" aria-label="主导航">
      <button className="brand" onClick={onBrand} aria-label="黑湖招聘首页">
        <img src="logo.png" alt="黑湖科技" />
        <span>黑湖智造</span>
        <small>BLACKLAKE · CAREERS</small>
      </button>
      <div className="chapter-nav" aria-label="章节">
        {CHAPTERS.map((c) => (
          <button
            key={c.key}
            className={scene === c.key ? "active" : ""}
            onClick={() => onChapter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <a className="nav-lang" href={lang === "zh" ? "index-en.html" : "index.html"}>
          {lang === "zh" ? "EN" : "中文"}
        </a>
        <button className="nav-jobs" onClick={() => onApply(lang === "zh" ? "全部" : "All")}>
          {lang === "zh" ? "查看开放职位" : "OPEN ROLES"} <span className="arw">↗</span>
        </button>
      </div>
    </nav>
  );
}

// ── 画框四角刻线 ──
function FrameCorners() {
  return (
    <div className="frame-corners" aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}

Object.assign(window, { Nav, FrameCorners });
