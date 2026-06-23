/* global React, ReactDOM, window, Nav, ScrollBar, Hero, About, Manifesto, Jobs, CTA, Footer, JobDrawer, useReveal, CursorGlow, OEEGame */
// ============ Blacklake Careers v2 · App (EN) ============

const { useState, useEffect } = React;

function App() {
  const [job, setJob] = useState(null);
  const rootRef = useReveal();

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    const els = document.querySelectorAll('.reveal, .reveal-left');
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div ref={rootRef} className="page">
      <CursorGlow />
      <ScrollBar />
      <Nav onApply={() => scrollTo("jobs")} />
      <Hero
        onPrimary={() => scrollTo("jobs")}
        onSecondary={() => scrollTo("about")}
      />
      <About />
      <Manifesto />
      <Jobs onOpen={setJob} />
      <CTA onApply={() => scrollTo("jobs")} />
      <Footer />
      <JobDrawer job={job} onClose={() => setJob(null)} />
      <OEEGame />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
