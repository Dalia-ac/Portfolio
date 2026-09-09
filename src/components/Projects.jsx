import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/portfolio";

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------

function ProjectsHeader() {
  return (
    <div className="proj__header">
      <h2 className="proj__heading">Things I've Built</h2>
      <p className="proj__subtitle">
        A few projects where I turned ideas, problems and curiosity into
        something tangible.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD
// ---------------------------------------------------------------------------

function ProjectCard({ project }) {
  const Wrapper = project.link ? motion.a : motion.div;
  const wrapperProps = project.link
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  if (project.image) {
    return (
      <Wrapper
        {...wrapperProps}
        className={`proj-card proj-card--${project.span} has-photo`}
        style={{ "--accent": project.accent, "--accent-2": project.accent2 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6 }}
      >
        <span className="proj-card__aura" aria-hidden="true" />
        <div className="proj-card__split">
          <div className="proj-card__info">
            <div className="proj-card__top">
              <span className="proj-card__number">{project.number}</span>
            </div>
            <span className="proj-card__category">{project.category}</span>
            <h3 className="proj-card__title">
              {project.title}
              {project.subtitle && <span className="proj-card__subtitle"> — {project.subtitle}</span>}
            </h3>
            <p className="proj-card__text">{project.description}</p>
            {project.technologies.length > 0 && (
              <div className="proj-card__pills">
                {project.technologies.map((t) => (
                  <span key={t} className="proj-card__pill">{t}</span>
                ))}
              </div>
            )}
            {!project.hideCta && (
              <span className="proj-card__cta">
                View Project <ArrowRight size={14} strokeWidth={1.8} />
              </span>
            )}
          </div>
          <div className="proj-card__photo">
            <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={`proj-card proj-card--${project.span} ${project.featured ? "is-featured" : ""}`}
      style={{ "--accent": project.accent, "--accent-2": project.accent2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <span className="proj-card__aura" aria-hidden="true" />
      <span className="proj-card__mark" aria-hidden="true">{project.mark}</span>

      <div className="proj-card__top">
        <span className="proj-card__number">{project.number}</span>
        {project.featured && <span className="proj-card__badge">Featured Project</span>}
      </div>

      <div className="proj-card__body">
        <span className="proj-card__category">{project.category}</span>
        <h3 className="proj-card__title">
          {project.title}
          {project.subtitle && <span className="proj-card__subtitle"> — {project.subtitle}</span>}
        </h3>
        <p className="proj-card__text">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="proj-card__pills">
            {project.technologies.map((t) => (
              <span key={t} className="proj-card__pill">{t}</span>
            ))}
          </div>
        )}

        {!project.hideCta && (
          <span className="proj-card__cta">
            View Project <ArrowRight size={14} strokeWidth={1.8} />
          </span>
        )}
      </div>
    </Wrapper>
  );
}

// ---------------------------------------------------------------------------
// GRID
// ---------------------------------------------------------------------------

function ProjectGrid() {
  return (
    <div className="proj__grid">
      {PROJECTS.map((project) => (
        <ProjectCard key={project.number} project={project} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------

function ProjectFooter() {
  return (
    <div className="proj__footer">
      <p className="proj__footer-line">Every project started with curiosity.</p>
      <p className="proj__footer-sub">
        I'm interested in learning by building — experimenting with
        technology, solving problems and turning ideas into working
        experiences.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROJECTS — top-level section
// ---------------------------------------------------------------------------

export default function Projects() {
  return (
    <section id="projects" className="proj">
      <span className="proj__nebula" aria-hidden="true" />
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="proj__star"
          style={{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%` }}
          aria-hidden="true"
        />
      ))}

      <div className="proj__frame">
        <ProjectsHeader />
        <ProjectGrid />
        <ProjectFooter />
      </div>
    </section>
  );
}
