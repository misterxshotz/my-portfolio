import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
// 👇 เปลี่ยน URL ตรงนี้เป็น Cloudinary URL จริงของคุณ
// รูปแบบ: https://res.cloudinary.com/ชื่อบัญชี/image/upload/v123/ชื่อไฟล์.jpg

const NAV_LINKS = ["Home", "Projects", "Certificates", "Contact"];

const PROJECTS = [
  {
    title: "REST API Gateway",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project1.jpg",
    tech: ["Node.js", "Express", "Redis"],
    desc: "High-performance API gateway handling 50k+ req/s with rate limiting, caching, and JWT auth.",
    tag: "Node.js",
    color: "#4ade80",
  },
  {
    title: "Vue Dashboard CMS",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project2.jpg",
    tech: ["Vue.js", "Node.js", "MongoDB"],
    desc: "Full-stack CMS with real-time preview, role-based access, and rich editor.",
    tag: "Vue.js",
    color: "#60a5fa",
  },
  {
    title: "Microservice Orchestrator",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project3.jpg",
    tech: ["Node.js", "Docker", "RabbitMQ"],
    desc: "Event-driven microservice architecture with message queuing, health monitoring, and auto-scaling.",
    tag: "Backend",
    color: "#f472b6",
  },
  {
    title: "React Analytics Board",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project4.jpg",
    tech: ["React", "Node.js", "PostgreSQL"],
    desc: "Real-time analytics dashboard with WebSocket updates, D3 charts, and CSV export functionality.",
    tag: "React",
    color: "#fb923c",
  },
  {
    title: "Auth Service SSO",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project5.jpg",
    tech: ["Node.js", "OAuth2", "JWT"],
    desc: "Single Sign-On service supporting OAuth2, SAML, and TOTP with session management.",
    tag: "Security",
    color: "#a78bfa",
  },
  {
    title: "File Storage Engine",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/projects/project6.jpg",
    tech: ["Node.js", "AWS S3", "Vue.js"],
    desc: "Scalable file storage with chunked upload, CDN integration, and virus scanning pipeline.",
    tag: "Cloud",
    color: "#34d399",
  },
];

const CERTS = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "Mar 2024",
    expires: "Mar 2027",
    credId: "AWS-SAA-C03-2024",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert1.jpg",
  },
  {
    title: "Node.js Application Developer",
    issuer: "OpenJS Foundation",
    date: "Jan 2024",
    expires: "Jan 2027",
    credId: "JSNAD-0124",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert2.jpg",
  },
  {
    title: "Docker Certified Associate",
    issuer: "Docker, Inc.",
    date: "Nov 2023",
    expires: "Nov 2025",
    credId: "DCA-2023-1182",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert3.jpg",
  },
  {
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "Aug 2023",
    expires: "Aug 2025",
    credId: "GCP-PRO-0823",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert4.jpg",
  },
  {
    title: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    date: "Jun 2023",
    expires: "Jun 2026",
    credId: "MDB-DEV-2306",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert5.jpg",
  },
  {
    title: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    date: "Apr 2023",
    expires: "Apr 2026",
    credId: "CKA-2304-0091",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1/portfolio/certs/cert6.jpg",
  },
];

const SKILLS = [
  { name: "Node.js",    level: 95, icon: "⬡" },
  { name: "Vue.js",     level: 88, icon: "◈" },
  { name: "React",      level: 82, icon: "◎" },
  { name: "PostgreSQL", level: 90, icon: "▣" },
  { name: "Docker",     level: 85, icon: "◫" },
  { name: "Redis",      level: 80, icon: "◆" },
];

const INIT_SHOW = 3;

// ─── DISCORD ANTI-SPAM ────────────────────────────────────────────────────────
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1485228755327914094/p0AMadT_5aKmEVHCAuuS7OUIe3wFNQQnvSYgS-fy3m1o2MPcOdaVH9IdUt0gN45vb8J8";
const SPAM_LIMIT     = 3;
const SPAM_WINDOW_MS = 60000;
const COOLDOWN_MS    = 10000;
const sendLog        = [];

function checkSpam() {
  const now = Date.now();
  while (sendLog.length && sendLog[0] < now - SPAM_WINDOW_MS) sendLog.shift();
  if (sendLog.length >= SPAM_LIMIT) return false;
  sendLog.push(now);
  return true;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── CERT IMAGE ──────────────────────────────────────────────────────────────
function CertImage({ cert }) {
  const [err, setErr] = useState(false);

  if (cert.image && !err) {
    return (
      <div style={{ position: "relative", width: "100%", paddingBottom: "70%", overflow: "hidden", background: "#f1f5f9" }}>
        <img
          src={cert.image}
          alt={cert.title}
          onError={() => setErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  // Placeholder ถ้ายังไม่ได้ใส่รูป
  return (
    <div style={{ width: "100%", paddingBottom: "70%", position: "relative", background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <div style={{ fontSize: "2.5rem" }}>📜</div>
        <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#64748b", fontWeight: 600, textAlign: "center", padding: "0 1rem" }}>{cert.title}</div>
        <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.7rem", color: "#94a3b8" }}>{cert.issuer}</div>
      </div>
    </div>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({ index, onClose, onGo }) {
  const cert  = CERTS[index];
  const total = CERTS.length;

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onGo((index - 1 + total) % total);
      if (e.key === "ArrowRight") onGo((index + 1) % total);
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [index]);

  return (
    <div onClick={onClose} className="lightbox-pad"
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(8,12,24,0.95)", backdropFilter: "blur(14px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 5rem", animation: "fadeIn 0.18s ease" }}>

      <button onClick={e => { e.stopPropagation(); onGo((index - 1 + total) % total); }} className="lb-prev"
        style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 50, height: 50, cursor: "pointer", color: "white", fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>

      <button onClick={e => { e.stopPropagation(); onGo((index + 1) % total); }} className="lb-next"
        style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 50, height: 50, cursor: "pointer", color: "white", fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>

      <button onClick={onClose}
        style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", color: "white", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

      <div onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 820, borderRadius: 14, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", animation: "zoomIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <CertImage cert={cert} />
        <div style={{ background: "white", padding: "1rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1rem", color: "#0f172a" }}>{cert.title}</div>
            <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.75rem", color: "#94a3b8" }}>{cert.issuer}</div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[["ออกให้", cert.date], ["หมดอายุ", cert.expires], ["รหัส", cert.credId]].filter(([, v]) => v).map(([l, v]) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase" }}>{l}</div>
                <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#0f172a", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.5rem" }}>
        {CERTS.map((_, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); onGo(i); }}
            style={{ width: i === index ? 22 : 8, height: 8, borderRadius: 100, background: i === index ? "white" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
        ))}
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ active, setActive }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid #e5e7eb" : "none", transition: "all 0.3s ease", padding: "0 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1.25rem", color: "#111", letterSpacing: "-0.02em" }}>&lt;axdxdev /&gt;</div>
        <div style={{ display: "flex", gap: "2rem" }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <a key={link} href={"#" + link.toLowerCase()} onClick={() => setActive(link)}
              style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.875rem", fontWeight: active === link ? 600 : 400, color: active === link ? "#111" : "#6b7280", textDecoration: "none", borderBottom: active === link ? "2px solid #111" : "2px solid transparent", paddingBottom: "2px", transition: "all 0.2s" }}>{link}</a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#111" }}>☰</button>
      </div>
      {menuOpen && (
        <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={"#" + link.toLowerCase()} onClick={() => { setActive(link); setMenuOpen(false); }}
              style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "1rem", color: "#111", textDecoration: "none", fontWeight: 500 }}>{link}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="home" ref={ref} style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 2rem", background: "linear-gradient(135deg,#fafafa 0%,#f0f4ff 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "linear-gradient(135deg,#dbeafe,#e0e7ff)", opacity: 0.6, animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 120, height: 120, borderRadius: "30% 70% 70% 30%/30% 30% 70% 70%", background: "linear-gradient(135deg,#fde68a,#fca5a5)", opacity: 0.5, animation: "float 8s ease-in-out infinite reverse" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100, padding: "0.3rem 1rem", marginBottom: "1.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#15803d", fontWeight: 500 }}>Available for work</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "clamp(2.5rem,6vw,5rem)", color: "#0f172a", lineHeight: 1.1, margin: "0 0 1.5rem", letterSpacing: "-0.03em" }}>
            CHAYOT J.<br /><span style={{ color: "#3b82f6" }}>นักเทคโนโลยีสารสนเทศ</span><br />that scale.
          </h1>
          <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "1.125rem", color: "#64748b", maxWidth: 520, lineHeight: 1.7, margin: "0 0 2.5rem" }}>
            Specializing in Node.js, Vue.js, and React. I design robust APIs, microservices, and full-stack systems that power modern applications.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontWeight: 600, background: "#0f172a", color: "white", padding: "0.85rem 2rem", borderRadius: 12, textDecoration: "none", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(15,23,42,0.25)" }}>View Projects →</a>
            <a href="#contact"  style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontWeight: 500, background: "white", color: "#0f172a", padding: "0.85rem 2rem", borderRadius: 12, textDecoration: "none", fontSize: "0.9rem", border: "1.5px solid #e2e8f0" }}>Get in Touch</a>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "3rem" }}>
            {["Node.js","Vue.js","React","PostgreSQL","Docker","AWS"].map((t, i) => (
              <span key={t} style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", padding: "0.35rem 0.85rem", borderRadius: 8, opacity: inView ? 1 : 0, transition: `opacity 0.5s ${0.2 + i * 0.08}s` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function SkillBar({ skill, inView, delay }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{skill.icon} {skill.name}</span>
        <span style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem", color: "#6b7280" }}>{skill.level}%</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#3b82f6,#6366f1)", width: inView ? skill.level + "%" : "0%", transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s` }} />
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState("All");
  const tags     = ["All", ...new Set(PROJECTS.map(p => p.tag))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tag === filter);

  return (
    <section id="projects" ref={ref} className="section-pad" style={{ padding: "8rem 2rem", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// selected work</p>
          <h2 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>Projects</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setFilter(tag)}
                style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", padding: "0.4rem 1rem", borderRadius: 100, border: filter === tag ? "none" : "1.5px solid #e2e8f0", background: filter === tag ? "#0f172a" : "white", color: filter === tag ? "white" : "#6b7280", cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}>{tag}</button>
            ))}
          </div>
        </div>

        {/* Skills + About */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.2s" }} className="skills-grid">
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1.35rem", color: "#0f172a", marginBottom: "1.5rem" }}>Core Skills</h3>
            {SKILLS.map((s, i) => <SkillBar key={s.name} skill={s} inView={inView} delay={0.1 + i * 0.1} />)}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 20, padding: "2rem" }}>
            <h3 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1.35rem", color: "#0f172a", marginBottom: "1.25rem" }}>About Me</h3>
            <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.8, marginBottom: "1rem" }}>
              Backend engineer with 5+ years building scalable systems. Passionate about clean architecture, API design, and developer experience.
            </p>
            <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.8 }}>
              I bridge the gap between backend robustness and frontend elegance using React and Vue.js.
            </p>
            <div className="stats-row" style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
              {[["5+","Years Exp."],["30+","Projects"],["15+","Clients"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1.75rem", color: "#0f172a" }}>{n}</div>
                  <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.7rem", color: "#94a3b8" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
          {filtered.map((p, i) => (
            <div key={p.title}
              style={{ background: "white", border: "1.5px solid #f1f5f9", borderRadius: 16, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: `all 0.6s ease ${0.1 + i * 0.1}s`, cursor: "pointer", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}>
              {/* Image */}
              <div style={{ position: "relative", width: "100%", paddingBottom: "56%", background: p.color + "18", overflow: "hidden" }}>
                {p.image
                  ? <img src={p.image} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }} />
                  : null
                }
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: p.color, opacity: 0.3 }}>{"</>"}</div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span style={{ background: p.color, color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 100 }}>{p.tag}</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: p.color }} />
              </div>
              {/* Text */}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <h3 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "1.05rem", color: "#0f172a", margin: "0 0 0.5rem" }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6, margin: "0 0 1rem" }}>{p.desc}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {p.tech.map(t => (
                    <span key={t} style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.68rem", background: "#f8fafc", color: "#475569", padding: "0.2rem 0.6rem", borderRadius: 6, border: "1px solid #e2e8f0" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CERTIFICATES ────────────────────────────────────────────────────────────
function CertificatesSection() {
  const [ref, inView]         = useInView();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleCerts = showAll ? CERTS : CERTS.slice(0, INIT_SHOW);
  const hiddenCount  = CERTS.length - INIT_SHOW;

  return (
    <section id="certificates" ref={ref} className="section-pad" style={{ padding: "8rem 2rem", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// credentials</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 0.4rem", letterSpacing: "-0.02em" }}>Certificates</h2>
              <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.875rem", color: "#94a3b8" }}>คลิกที่ใบเกียรติบัตรเพื่อดูขนาดเต็ม</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0.5rem 1rem" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", color: "#94a3b8" }}>ทั้งหมด</span>
              <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: "#0f172a", lineHeight: 1 }}>{CERTS.length}</span>
              <span style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.75rem", color: "#64748b" }}>ใบ</span>
            </div>
          </div>
        </div>

        <div className="cert-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
          {visibleCerts.map((cert, i) => (
            <div key={cert.credId} onClick={() => setLightboxIndex(i)}
              style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s, box-shadow 0.22s` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)"; e.currentTarget.style.transform = "translateY(-5px) scale(1.01)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}>
              <CertImage cert={cert} />
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cert.title}</div>
                <div style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.7rem", color: "#94a3b8" }}>{cert.issuer}</div>
              </div>
            </div>
          ))}
        </div>

        {CERTS.length > INIT_SHOW && (
          <div style={{ textAlign: "center", marginTop: "2.5rem", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.4s" }}>
            <button onClick={() => setShowAll(v => !v)}
              style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.9rem", fontWeight: 600, background: showAll ? "white" : "#0f172a", color: showAll ? "#0f172a" : "white", border: showAll ? "1.5px solid #e2e8f0" : "none", padding: "0.85rem 2.5rem", borderRadius: 12, cursor: "pointer", boxShadow: showAll ? "none" : "0 4px 14px rgba(15,23,42,0.2)", transition: "all 0.25s ease", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {showAll
                ? "↑ แสดงน้อยลง"
                : <> ดูเพิ่มเติม <span style={{ background: "#3b82f6", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 100 }}>+{hiddenCount}</span> </>
              }
            </button>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} onGo={setLightboxIndex} />
      )}
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function ContactSection() {
  const [ref, inView]           = useInView();
  const [form, setForm]         = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus]     = useState(null);
  const [sending, setSending]   = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async () => {
    if (honeypot) return;
    if (!form.name || !form.email || !form.message) { setStatus("invalid"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus("invalid"); return; }
    if (cooldown > 0) { setStatus("cooldown"); return; }
    if (!checkSpam()) { setStatus("spam"); return; }

    setSending(true); setStatus(null);
    try {
      const now = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "full", timeStyle: "short" });
      const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Portfolio Contact",
          embeds: [{
            title: "📬 มีข้อความใหม่จาก Portfolio!",
            color: 0x3b82f6,
            fields: [
              { name: "👤 ชื่อ",    value: form.name,           inline: true },
              { name: "📧 Email",   value: form.email,          inline: true },
              { name: "📌 หัวข้อ", value: form.subject || "—", inline: false },
              { name: "💬 ข้อความ",value: form.message,         inline: false },
            ],
            footer: { text: "ส่งเมื่อ " + now },
          }],
        }),
      });
      if (res.ok || res.status === 204) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setCooldown(COOLDOWN_MS / 1000);
      } else {
        setStatus("error");
      }
    } catch { setStatus("error"); }
    finally { setSending(false); }
  };

  const inp = { width: "100%", padding: "0.85rem 1rem", fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.9rem", border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none", background: "white", color: "#0f172a", boxSizing: "border-box", transition: "border-color 0.2s" };
  const isDisabled = sending || cooldown > 0;

  return (
    <section id="contact" ref={ref} className="section-pad" style={{ padding: "8rem 2rem", background: "linear-gradient(135deg,#f8fafc 0%,#f0f4ff 100%)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// get in touch</p>
          <h2 style={{ fontFamily: "'DM Serif Display','Noto Sans Thai',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Let's Work Together</h2>
          <p style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", color: "#64748b", fontSize: "1rem", lineHeight: 1.7 }}>Have a project in mind? I'd love to hear about it.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.75rem", background: "#5865f222", border: "1px solid #5865f244", borderRadius: 100, padding: "0.3rem 0.9rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5865f2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            <span style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.75rem", color: "#5865f2", fontWeight: 500 }}>ส่งตรงถึง Discord</span>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease 0.2s" }}>
          {/* Honeypot */}
          <input type="text" tabIndex="-1" autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="form-grid">
            <div>
              <label style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>ชื่อ *</label>
              <input style={inp} placeholder="ชื่อของคุณ" value={form.name} onChange={e => setForm({...form, name: e.target.value})} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Email *</label>
              <input style={inp} placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>หัวข้อ</label>
            <input style={inp} placeholder="สอบถามงาน, ร่วมงาน…" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontFamily: "'DM Sans','Noto Sans Thai',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>ข้อความ *</label>
            <textarea style={{...inp, minHeight: 130, resize: "vertical"}} placeholder="บอกรายละเอียดโปรเจกต์ของคุณ…" value={form.message} onChange={e => setForm({...form, message: e.target.value})} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", color: "#94a3b8" }}>ส่งได้สูงสุด {SPAM_LIMIT} ครั้ง / นาที</span>
          </div>

          {status === "success"  && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.875rem", color:"#15803d" }}>✅ ส่งข้อความสำเร็จ!</div>}
          {status === "invalid"  && <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.875rem", color:"#c2410c" }}>⚠️ กรุณากรอก ชื่อ, Email ที่ถูกต้อง และ ข้อความ</div>}
          {status === "spam"     && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.875rem", color:"#dc2626" }}>🚫 ส่งบ่อยเกินไป กรุณารอสักครู่</div>}
          {status === "cooldown" && <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.875rem", color:"#2563eb" }}>⏳ กรุณารอ {cooldown} วินาที</div>}
          {status === "error"    && <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.875rem", color:"#be123c" }}>❌ เกิดข้อผิดพลาด ลองใหม่อีกครั้ง</div>}

          <button onClick={submit} disabled={isDisabled}
            style={{ width:"100%", padding:"0.9rem", background: isDisabled ? "#94a3b8" : "#5865f2", color:"white", border:"none", borderRadius:10, cursor: isDisabled ? "not-allowed" : "pointer", fontFamily:"'DM Sans','Noto Sans Thai',sans-serif", fontSize:"0.9rem", fontWeight:600, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}
            onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = "#4752c4"; }}
            onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.background = "#5865f2"; }}>
            {sending
              ? <><span style={{ display:"inline-block", width:16, height:16, border:"2px solid white", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> กำลังส่ง…</>
              : cooldown > 0
                ? <>⏳ รออีก {cooldown} วินาที</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> ส่งไปที่ Discord →</>
            }
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0f172a", color: "#475569", padding: "2rem", textAlign: "center", fontFamily: "'DM Mono','Noto Sans Thai',monospace", fontSize: "0.75rem" }}>
      <span style={{ color: "#64748b" }}>© 2026 </span>
      <span style={{ color: "#3b82f6" }}>&lt;axdxdev /&gt;</span>
      <span style={{ color: "#64748b" }}> — Built with React + Node.js + Vue.js</span>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active, setActive] = useState("Home");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html, body { width:100%; min-height:100%; scroll-behavior:smooth; overflow-x:hidden; }
        body { background:white; font-family:'Noto Sans Thai','DM Sans',sans-serif; }
        #root { width:100%; }
        h1,h2,h3,h4,h5,h6 { font-family:'DM Serif Display','Noto Sans Thai',serif; }
        @keyframes float  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-20px)} }
        @keyframes pulse  { 0%,100%{opacity:1}                 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0}                    to{opacity:1} }
        @keyframes zoomIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @media(max-width:768px){
          .desktop-nav { display:none!important }
          .burger      { display:block!important }
          .skills-grid { grid-template-columns:1fr!important }
          .form-grid   { grid-template-columns:1fr!important }
          .hero-btns   { flex-direction:column!important }
          .hero-btns a { text-align:center!important }
          .proj-grid   { grid-template-columns:1fr!important }
          .cert-grid   { grid-template-columns:1fr!important }
          .section-pad { padding:5rem 1.25rem!important }
          .lightbox-pad{ padding:1rem 3.5rem!important }
          .lb-prev     { left:6px!important; width:36px!important; height:36px!important; font-size:1.2rem!important }
          .lb-next     { right:6px!important; width:36px!important; height:36px!important; font-size:1.2rem!important }
        }
        @media(max-width:480px){
          .cert-grid   { grid-template-columns:1fr!important }
          .proj-grid   { grid-template-columns:1fr!important }
          .section-pad { padding:4rem 1rem!important }
          .stats-row   { gap:0.75rem!important }
        }
      `}</style>
      <Navbar active={active} setActive={setActive} />
      <HeroSection />
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection />
      <Footer />
    </>
  );
}
