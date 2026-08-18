/* global React, window */
// ============ Blacklake Careers v5 · Components (EN · Terminal) ============

const { useEffect, useRef, useState } = React;

// ── Nav: static, no hide/show; triple-click logo triggers the OEE easter egg ──
function Nav({ onApply }) {
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    clickCount.current++;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      window.dispatchEvent(new CustomEvent('oee-game'));
    } else if (clickCount.current === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" aria-label="Blacklake" onClick={handleLogoClick}>
          <img src="logo.png" alt="Blacklake" className="logo-img" />
        </a>
        <div className="nav-right">
          <button className="nav-cta" onClick={onApply}>OPEN ROLES</button>
          <a href="index.html">中文</a>
        </div>
      </div>
    </nav>
  );
}

// ── Scroll progress ──
function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total ? (h.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-bar"><i style={{ width: `${p}%` }} /></div>;
}

Object.assign(window, { Nav, ScrollBar });
