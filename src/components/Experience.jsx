import { useEffect, useRef } from "react";
import { EXPERIENCES } from "../data/portfolio";

// ---------------------------------------------------------------------------
// CARD
// ---------------------------------------------------------------------------

function ExperienceCard({ exp }) {
  const Icon = exp.icon;
  const classes = [
    "node-card",
    "reveal",
    exp.emphasize ? "node-card--emphasize" : "",
    exp.small ? "node-card--small" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="node-card__head">
        <div className="node-card__icon">
          <Icon size={17} strokeWidth={1.6} />
        </div>
        {exp.image && (
          <div className="node-card__thumb">
            <img
              src={exp.image}
              alt=""
              onError={(e) => {
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <h3 className="node-card__title">{exp.title}</h3>
      <div className="node-card__badge-row">
        <span className="node-card__badge">{exp.badge}</span>
        <span className="node-card__year">{exp.year}</span>
      </div>

      <p className="node-card__desc">{exp.description}</p>

      {exp.notes?.map((n) => (
        <p key={n} className="node-card__note">
          {n}
        </p>
      ))}

      <div className="node-card__tags">
        {exp.tags.map((t) => (
          <span key={t} className="node-card__tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONNECTORS — decorative constellation lines behind the grid (desktop only)
// ---------------------------------------------------------------------------

function Connectors() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            svg.classList.add("is-visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const paths = [
    "M16,22 Q34,38 50,50",
    "M50,22 Q50,36 50,50",
    "M84,22 Q66,38 50,50",
    "M50,50 Q34,64 16,78",
    "M50,50 Q50,64 50,78",
    "M50,50 Q66,64 84,78",
  ];
  const dots = [
    [16, 22], [50, 22], [84, 22],
    [50, 50],
    [16, 78], [50, 78], [84, 78],
  ];

  return (
    <svg
      ref={svgRef}
      className="constellation__svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          className="constellation__path"
          style={{ transitionDelay: `${i * 140}ms` }}
        />
      ))}
      {dots.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.6"
          className="constellation__dot"
          style={{ transitionDelay: `${700 + i * 90}ms` }}
        />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SECTION
// ---------------------------------------------------------------------------

export default function Experience() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const cards = root.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${i * 70}ms`;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="experience" ref={sectionRef}>
      <div className="experience__stars" aria-hidden="true" />

      <div className="experience__head">
        <h2 className="experience__heading">Beyond the Classroom</h2>
        <p className="experience__sub">
          The experiences, people, and opportunities that shaped the way I
          learn, build, and lead.
        </p>
      </div>

      <div className="constellation">
        <Connectors />
        <div className="constellation__grid">
          {EXPERIENCES.map((exp) => (
            <ExperienceCard key={exp.title} exp={exp} />
          ))}
        </div>
      </div>

      <div className="experience__close">
        <p>Every experience added a new perspective.</p>
        <div className="experience__dots" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="experience__dot" />
          ))}
        </div>
      </div>
    </section>
  );
}
