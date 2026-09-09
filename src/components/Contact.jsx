import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { CONTACT_NODES, CONTACT_RADIUS_PCT, CONTACT_SOCIALS, CV_PATH, SITE_NAME } from "../data/portfolio";

// ---------------------------------------------------------------------------
// ORBIT (desktop / tablet)
// ---------------------------------------------------------------------------

function Orbit() {
  return (
    <div className="orbit">
      <svg className="orbit__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {CONTACT_NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 50 + CONTACT_RADIUS_PCT * Math.cos(rad);
          const y = 50 + CONTACT_RADIUS_PCT * Math.sin(rad);
          return (
            <line
              key={n.label}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              className="orbit__line"
            />
          );
        })}
      </svg>

      <div className="orbit__core">
        <h2 className="orbit__title">What's next?</h2>
        <p className="orbit__sub">
          Open to ideas, collaborations, opportunities, and challenges
          worth building.
        </p>
      </div>

      {CONTACT_NODES.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const left = 50 + CONTACT_RADIUS_PCT * Math.cos(rad);
        const top = 50 + CONTACT_RADIUS_PCT * Math.sin(rad);
        const Icon = n.icon;
        return (
          <div
            key={n.label}
            className="orbit__node"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div className="orbit__node-core">
              <Icon size={15} strokeWidth={1.6} />
            </div>
            <span className="orbit__node-label">{n.label}</span>
            <span className="orbit__node-note">{n.note}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MOBILE VERTICAL JOURNEY (replaces the orbit below the breakpoint)
// ---------------------------------------------------------------------------

function MobileJourney() {
  return (
    <div className="m-journey">
      <div className="m-journey__center">
        <h2 className="orbit__title">What's next?</h2>
        <p className="orbit__sub">
          Open to ideas, collaborations, opportunities, and challenges
          worth building.
        </p>
      </div>

      <div className="m-journey__line" aria-hidden="true" />

      {CONTACT_NODES.map((n) => {
        const Icon = n.icon;
        return (
          <div key={n.label} className="m-journey__item">
            <span className="m-journey__dot" aria-hidden="true" />
            <div className="m-journey__icon">
              <Icon size={15} strokeWidth={1.6} />
            </div>
            <div>
              <p className="m-journey__label">{n.label}</p>
              <p className="m-journey__note">{n.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CV — floating document, not a rectangular card
// ---------------------------------------------------------------------------

function CvDoc() {
  return (
    <div className="cv-doc">
      <p className="cv-doc__name">{SITE_NAME}</p>
      <p className="cv-doc__field">Network &amp; Telecommunications Engineering</p>
      <div className="cv-doc__tags">
        {["AI", "Networks", "Software", "Technology"].map((t) => (
          <span key={t} className="cv-doc__tag">{t}</span>
        ))}
      </div>
      <a href={CV_PATH} download className="cv-doc__btn">
        <Download size={15} className="cv-doc__icon" />
        Download CV
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NEXT SECTION
// ---------------------------------------------------------------------------

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="next" className="next" ref={sectionRef}>
      <div className="next__stars" aria-hidden="true" />

      <div className="next__stage">
        <div className="reveal reveal--core" style={{ transitionDelay: "0ms" }}>
          <Orbit />
          <MobileJourney />
        </div>

        <div className="reveal reveal--cv" style={{ transitionDelay: "260ms" }}>
          <CvDoc />
        </div>
      </div>

      <div className="next__cta reveal" style={{ transitionDelay: "360ms" }}>
        <a href="mailto:achouri.d06@gmail.com" className="pill-btn">
          Start a conversation
          <span className="pill-btn__arrow">→</span>
        </a>
      </div>

      <div className="next__contact reveal" style={{ transitionDelay: "420ms" }}>
        <p className="next__contact-title">Have something in mind?</p>
        <p className="next__contact-sub">Let's talk.</p>
        <div className="next__contact-links">
          {CONTACT_SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="social-btn"
              title={s.label}
              aria-label={s.label}
              {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <s.icon size={16} strokeWidth={1.6} />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <footer className="mini-footer">
        <p className="mini-footer__name">{SITE_NAME}</p>
        <p className="mini-footer__tag">Telecom &amp; Network Engineering • AI • Technology</p>
        <div className="mini-footer__socials">
          {CONTACT_SOCIALS.map((s, i) => (
            <span key={s.label}>
              <a
                href={s.href}
                className="mini-footer__link"
                {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {s.label}
              </a>
              {i < CONTACT_SOCIALS.length - 1 && <span className="mini-footer__sep">·</span>}
            </span>
          ))}
        </div>
        <p className="mini-footer__copy">© 2026 {SITE_NAME}</p>
      </footer>
    </section>
  );
}
