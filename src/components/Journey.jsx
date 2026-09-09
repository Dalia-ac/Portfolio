import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { JOURNEY } from "../data/portfolio";

// ---------------------------------------------------------------------------
// PATH — a smooth alternating "orbital" curve running through every
// milestone's position, generated from the data so it never needs to be
// hand-tuned when a milestone is added or removed.
// ---------------------------------------------------------------------------

function buildOrbitalPath(count) {
  const points = Array.from({ length: count }, (_, i) => ({
    x: i % 2 === 0 ? 30 : 70,
    y: count === 1 ? 0 : (i / (count - 1)) * 100,
  }));
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

// ---------------------------------------------------------------------------
// BACKDROP — restrained star field, drifting nebula glow, faint orbit rings
// ---------------------------------------------------------------------------

function JourneyBackdrop() {
  const stars = Array.from({ length: 46 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    size: (i % 3 === 0 ? 2 : 1) + "px",
    delay: `${(i % 7) * 0.5}s`,
    duration: `${3 + (i % 5)}s`,
  }));

  return (
    <div className="journey__backdrop" aria-hidden="true">
      <span className="journey__nebula journey__nebula--a" />
      <span className="journey__nebula journey__nebula--b" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="journey__star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------

function JourneyHeader() {
  return (
    <div className="journey__header">
      <span className="journey__eyebrow">My Journey</span>
      <h2 className="journey__heading">A trajectory, not a straight line.</h2>
      <p className="journey__subtitle">
        From telecom and network engineering student to AI builder and STEAM
        mentor — every experience has shaped the way I learn, build, and lead.
      </p>
      <motion.span
        className="journey__underline"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// NODE
// ---------------------------------------------------------------------------

function JourneyNode({ item, active, dimmed }) {
  const Icon = item.icon;
  return (
    <motion.span
      className={[
        "journey__node",
        item.pivot ? "is-pivot" : "",
        item.current ? "is-current" : "",
        active ? "is-active" : "",
        dimmed ? "is-dimmed" : "",
      ].join(" ")}
      animate={{ scale: active ? 1.14 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {item.current && <span className="journey__node-ring" />}
      <Icon size={item.pivot || item.current ? 18 : 15} strokeWidth={1.6} />
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// CARD
// ---------------------------------------------------------------------------

function JourneyCard({ item, active, dimmed }) {
  return (
    <motion.div
      className={["journey__card", active ? "is-active" : "", dimmed ? "is-dimmed" : ""].join(" ")}
      animate={{ y: active ? -4 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="journey__card-top">
        <motion.span
          className="journey__year"
          animate={{ scale: active ? 1.08 : 1, opacity: active ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          {item.year}
        </motion.span>
        {item.current && <span className="journey__now">Now</span>}
      </div>
      <h3 className="journey__title">{item.title}</h3>
      <span className="journey__role">
        {item.role}
        {item.place ? ` · ${item.place}` : ""}
      </span>
      <p className="journey__text">{item.description}</p>
      <div className="journey__tags">
        {item.tags.map((tag) => (
          <span key={tag} className="journey__tag">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// CONSTELLATION — the main visual: SVG orbital trajectory + alternating
// nodes/cards on desktop, single glowing column on mobile.
// ---------------------------------------------------------------------------

function JourneyConstellation() {
  const [active, setActive] = useState(null);
  const pathD = buildOrbitalPath(JOURNEY.length);

  return (
    <div className="journey__constellation">
      <svg className="journey__path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="journey-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c5cf0" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#9678f5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#c9bdf2" stopOpacity="1" />
          </linearGradient>
          <filter id="journey-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <path d={pathD} className="journey__path-glow" filter="url(#journey-blur)" />
        <path d={pathD} className="journey__path-line" stroke="url(#journey-grad)" />
        <path d={pathD} className="journey__path-pulse" stroke="url(#journey-grad)" />
      </svg>

      <ol className="journey__list">
        {JOURNEY.map((item, i) => {
          const isActive = active === i;
          const isDimmed = active !== null && active !== i;

          return (
            <li key={item.title} className="journey__group">
              <motion.div
                className={`journey__item ${i % 2 === 0 ? "is-left" : "is-right"}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <JourneyNode item={item} active={isActive} dimmed={isDimmed} />
                <JourneyCard item={item} active={isActive} dimmed={isDimmed} />
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// END
// ---------------------------------------------------------------------------

function JourneyEnd() {
  return (
    <div className="journey__end">
      <h3 className="journey__end-title">And the journey is still unfolding.</h3>
      <p className="journey__end-text">
        I'm continuing to learn, build, and apply telecom, software, and AI
        skills to practical challenges.
      </p>
      <motion.span
        className="journey__end-arrow"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={20} strokeWidth={1.6} />
      </motion.span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JOURNEY — top-level section
// ---------------------------------------------------------------------------

export default function Journey() {
  return (
    <section id="journey" className="journey">
      <JourneyBackdrop />
      <span className="journey__corner journey__corner--tl" aria-hidden="true" />
      <span className="journey__corner journey__corner--tr" aria-hidden="true" />
      <span className="journey__corner journey__corner--bl" aria-hidden="true" />
      <span className="journey__corner journey__corner--br" aria-hidden="true" />

      <div className="journey__frame">
        <JourneyHeader />
        <JourneyConstellation />
        <JourneyEnd />
      </div>
    </section>
  );
}
