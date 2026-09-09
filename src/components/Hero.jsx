import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SOCIALS, TITLE_BLOCK } from "../data/portfolio";

// ---------------------------------------------------------------------------
// 3D BACKGROUND — a rotating network graph (nodes + edges), built with plain
// Three.js. It's a literal reference to network topology rather than a
// decorative particle field, and it responds to the cursor for a bit of
// depth instead of just spinning on a fixed axis.
// ---------------------------------------------------------------------------

function NetworkScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08060f, 0.045);
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Anchor positions for each node, plus a per-node phase/speed so every
    // node drifts on its own small orbit instead of the whole graph moving
    // as one rigid, static shape.
    const NODE_COUNT = 46;
    const radius = 5.6;

    // Accent palette drawn from the site's own colors (mostly violet and
    // lavender, occasional cyan/pink per the brief's "subtle blue/pink
    // highlights") — each node gets one, so the graph reads as colored
    // rather than a single dim purple wash.
    const PALETTE = [
      new THREE.Color(0x9678f5),
      new THREE.Color(0x9678f5),
      new THREE.Color(0xc9bdf2),
      new THREE.Color(0xc9bdf2),
      new THREE.Color(0x7dd3fc),
      new THREE.Color(0xf0a3d8),
    ];

    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const base = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize().multiplyScalar(radius * (0.35 + Math.random() * 0.65));
      nodes.push({
        base,
        live: base.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.4,
        amp: 0.18 + Math.random() * 0.22,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    }

    // Fixed topology (which nodes connect), computed once from the anchors —
    // only the *positions* animate every frame, not which edges exist.
    const THRESHOLD = 3.1;
    const edgePairs = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].base.distanceTo(nodes[j].base) < THRESHOLD) {
          edgePairs.push([i, j]);
        }
      }
    }

    const pointsPos = new Float32Array(NODE_COUNT * 3);
    const pointsCol = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const c = nodes[i].color;
      pointsCol[i * 3] = c.r;
      pointsCol[i * 3 + 1] = c.g;
      pointsCol[i * 3 + 2] = c.b;
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(pointsPos, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(pointsCol, 3));
    const pointsMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(pointsGeo, pointsMat));

    // Edge colors are set once here (interpolated per-vertex from the two
    // nodes each line connects) — only positions need updating per frame.
    const edgePos = new Float32Array(edgePairs.length * 2 * 3);
    const edgeCol = new Float32Array(edgePairs.length * 2 * 3);
    for (let e = 0; e < edgePairs.length; e++) {
      const [a, b] = edgePairs[e];
      const ca = nodes[a].color;
      const cb = nodes[b].color;
      const base = e * 6;
      edgeCol[base] = ca.r;
      edgeCol[base + 1] = ca.g;
      edgeCol[base + 2] = ca.b;
      edgeCol[base + 3] = cb.r;
      edgeCol[base + 4] = cb.g;
      edgeCol[base + 5] = cb.b;
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(edgeCol, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // A handful of bright pulses that travel along real edges, like packets
    // moving across the network — this is what carries most of the motion.
    const PULSE_COUNT = 16;
    const pulses = Array.from({ length: PULSE_COUNT }, () => ({
      edge: edgePairs[Math.floor(Math.random() * edgePairs.length)],
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.35,
    }));
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: 0xe4defb,
      size: 0.16,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    group.add(new THREE.Points(pulseGeo, pulseMat));

    let frameId;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // Drift each node around its anchor
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.live.set(
          n.base.x + Math.sin(t * n.speed + n.phase) * n.amp,
          n.base.y + Math.cos(t * n.speed * 0.8 + n.phase) * n.amp,
          n.base.z + Math.sin(t * n.speed * 0.6 + n.phase * 1.3) * n.amp
        );
        pointsPos[i * 3] = n.live.x;
        pointsPos[i * 3 + 1] = n.live.y;
        pointsPos[i * 3 + 2] = n.live.z;
      }
      pointsGeo.attributes.position.needsUpdate = true;

      // Rebuild edge endpoints from the live (drifted) node positions
      for (let e = 0; e < edgePairs.length; e++) {
        const [a, b] = edgePairs[e];
        const base = e * 6;
        edgePos[base] = nodes[a].live.x;
        edgePos[base + 1] = nodes[a].live.y;
        edgePos[base + 2] = nodes[a].live.z;
        edgePos[base + 3] = nodes[b].live.x;
        edgePos[base + 4] = nodes[b].live.y;
        edgePos[base + 5] = nodes[b].live.z;
      }
      edgeGeo.attributes.position.needsUpdate = true;
      edgeMat.opacity = 0.45 + Math.sin(t * 0.6) * 0.1;

      // Advance pulses along their edge, retargeting a new edge on loop
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          pulse.t = 0;
          pulse.edge = edgePairs[Math.floor(Math.random() * edgePairs.length)];
        }
        const [a, b] = pulse.edge;
        const ax = nodes[a].live, bx = nodes[b].live;
        pulsePos[p * 3] = ax.x + (bx.x - ax.x) * pulse.t;
        pulsePos[p * 3 + 1] = ax.y + (bx.y - ax.y) * pulse.t;
        pulsePos[p * 3 + 2] = ax.z + (bx.z - ax.z) * pulse.t;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      // Slow ambient rotation plus a gentle mouse-driven tilt
      targetRotY = t * 0.06 + mouseX * 0.35;
      targetRotX = mouseY * 0.2;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.03;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.03;

      // Subtle camera breathing for depth
      camera.position.z = 11 + Math.sin(t * 0.18) * 0.35;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      pointsGeo.dispose();
      pointsMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero__scene" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

export default function Hero() {
  return (
    <section id="home" className="hero">
      <NetworkScene />

      <span className="hero__corner hero__corner--tl" aria-hidden="true" />
      <span className="hero__corner hero__corner--tr" aria-hidden="true" />
      <span className="hero__corner hero__corner--bl" aria-hidden="true" />
      <span className="hero__corner hero__corner--br" aria-hidden="true" />

      <div className="hero__inner">
        <p className="hero__role reveal" style={{ animationDelay: "90ms" }}>
          Telecom &amp; network engineering student — AI builder — STEAM mentor
        </p>

        <h1 className="hero__name reveal" style={{ animationDelay: "160ms" }}>
          Dalia Achouri
        </h1>

        <p className="hero__lede reveal" style={{ animationDelay: "230ms" }}>
          I combine telecommunications, software development, and AI to build
          innovative, practical solutions.
        </p>

        <div className="hero__actions reveal" style={{ animationDelay: "300ms" }}>
          <a href="#projects" className="btn btn--primary">
            View my work
          </a>
          <a href="#next" className="btn btn--outline">
            Let's connect
          </a>
        </div>

        <div className="hero__socials reveal" style={{ animationDelay: "360ms" }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="hero__social"
              aria-label={s.label}
              {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <s.icon size={17} strokeWidth={1.6} />
            </a>
          ))}
        </div>
      </div>

      <div className="titleblock">
        {TITLE_BLOCK.map((cell) => (
          <div key={cell.label} className="titleblock__cell">
            <span className="titleblock__label">{cell.label}</span>
            <span className="titleblock__value">{cell.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
