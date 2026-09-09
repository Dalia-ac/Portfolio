import { PROFILE_FACTS } from "../data/portfolio";

export default function About() {
  return (
    <section id="about" className="about">
      <span className="about__glow about__glow--a" aria-hidden="true" />
      <span className="about__glow about__glow--b" aria-hidden="true" />
      <span className="about__glow about__glow--c" aria-hidden="true" />

      <div className="section-head">
        <div className="section-head__label">
          <span className="section-head__index">About</span>
          <span className="section-head__rule" aria-hidden="true" />
        </div>
        <span className="section-head__divider" aria-hidden="true" />
        <h2 className="section-head__title">Telecom, networks, and intelligent solutions</h2>
      </div>

      <div className="about__grid">
        <div className="about__copy">
          <p>
            I'm <strong>Dalia Achouri</strong>, a Network and
            Telecom and Network Engineering student based in Algiers, currently in
            my fourth year at the National Higher School of Information
            Technologies and Communications (ENSTICP).
          </p>
          <p>
            I have a strong foundation in routing and switching, VLANs, TCP/IP,
            wireless networks, and fiber optics, supported by CCNA-level
            training and hands-on projects. I am strongly interested in
            artificial intelligence, machine learning, and deep learning.
          </p>
          <p>
            My web-development skills include HTML, CSS, JavaScript, basic
            WordPress, React, Next.js, Git, and GitHub. I also work with Cisco
            Networking Basics at CCNA level, Cisco Packet Tracer, routing, and
            switching. Through internships, hackathons, technical leadership
            roles, and practical AI and frontend projects, I combine telecom,
            software development, and AI to build innovative solutions.
          </p>
        </div>

        <aside className="about__panel">
          <div className="about__panel-head">
            <span>Profile</span>
          </div>
          {PROFILE_FACTS.map((fact) => (
            <div key={fact.label} className="about__fact" style={{ "--fact-accent": fact.accent }}>
              <span className="about__fact-icon">
                <fact.icon size={15} strokeWidth={1.7} />
              </span>
              <div className="about__fact-text">
                <span className="about__fact-label">{fact.label}</span>
                <span className="about__fact-value">{fact.value}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
