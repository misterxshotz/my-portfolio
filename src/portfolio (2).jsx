import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Projects", "Certificates", "Contact"];

const CERT_DESIGNS = {
  "AWS-SAA-C03-2024": { bg: ["#fff7ed","#ffedd5"], border: "#f97316", accent: "#ea580c" },
  "JSNAD-0124":       { bg: ["#f0fdf4","#dcfce7"], border: "#4ade80", accent: "#16a34a" },
  "DCA-2023-1182":    { bg: ["#eff6ff","#dbeafe"], border: "#60a5fa", accent: "#2563eb" },
  "GCP-PRO-0823":     { bg: ["#f0fdf4","#d1fae5"], border: "#34d399", accent: "#059669" },
  "MDB-DEV-2306":     { bg: ["#f5f3ff","#ede9fe"], border: "#a78bfa", accent: "#7c3aed" },
  "CKA-2304-0091":    { bg: ["#fdf2f8","#fce7f3"], border: "#f472b6", accent: "#db2777" },
};

const CERTS = [
  { title: "AWS Certified Solutions Architect",    issuer: "Amazon Web Services",              date: "Mar 2024", expires: "Mar 2027", credId: "AWS-SAA-C03-2024", logo: "☁" },
  { title: "Node.js Application Developer",        issuer: "OpenJS Foundation",                date: "Jan 2024", expires: "Jan 2027", credId: "JSNAD-0124",       logo: "⬡" },
  { title: "Docker Certified Associate",           issuer: "Docker, Inc.",                     date: "Nov 2023", expires: "Nov 2025", credId: "DCA-2023-1182",    logo: "◫" },
  { title: "Google Cloud Professional",            issuer: "Google Cloud",                     date: "Aug 2023", expires: "Aug 2025", credId: "GCP-PRO-0823",     logo: "◎" },
  { title: "MongoDB Certified Developer",          issuer: "MongoDB University",               date: "Jun 2023", expires: "Jun 2026", credId: "MDB-DEV-2306",     logo: "▣" },
  { title: "Certified Kubernetes Administrator",   issuer: "Cloud Native Computing Foundation",date: "Apr 2023", expires: "Apr 2026", credId: "CKA-2304-0091",    logo: "◈" },
];

const PROJECTS = [
  { title: "REST API Gateway",          tech: ["Node.js","Express","Redis"],    desc: "High-performance API gateway handling 50k+ req/s with rate limiting, caching, and JWT auth.",               tag: "Node.js",  color: "#4ade80" },
  { title: "Vue Dashboard CMS",         tech: ["Vue.js","Node.js","MongoDB"],   desc: "Full-stack CMS with real-time preview, role-based access, and rich editor.",                                  tag: "Vue.js",   color: "#60a5fa" },
  { title: "Microservice Orchestrator", tech: ["Node.js","Docker","RabbitMQ"],  desc: "Event-driven microservice architecture with message queuing, health monitoring, and auto-scaling.",          tag: "Backend",  color: "#f472b6" },
  { title: "React Analytics Board",     tech: ["React","Node.js","PostgreSQL"], desc: "Real-time analytics dashboard with WebSocket updates, D3 charts, and CSV export functionality.",             tag: "React",    color: "#fb923c" },
  { title: "Auth Service SSO",          tech: ["Node.js","OAuth2","JWT"],       desc: "Single Sign-On service supporting OAuth2, SAML, and TOTP with session management.",                          tag: "Security", color: "#a78bfa" },
  { title: "File Storage Engine",       tech: ["Node.js","AWS S3","Vue.js"],    desc: "Scalable file storage with chunked upload, CDN integration, and virus scanning pipeline.",                    tag: "Cloud",    color: "#34d399" },
];

const SKILLS = [
  { name: "Node.js",    level: 95, icon: "⬡" },
  { name: "Vue.js",     level: 88, icon: "◈" },
  { name: "React",      level: 82, icon: "◎" },
  { name: "PostgreSQL", level: 90, icon: "▣" },
  { name: "Docker",     level: 85, icon: "◫" },
  { name: "Redis",      level: 80, icon: "◆" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── CERTIFICATE SVG ─────────────────────────────────────────────────────────

function CertSVG({ cert }) {
  const d = CERT_DESIGNS[cert.credId] || { bg: ["#f8fafc","#f1f5f9"], border: "#94a3b8", accent: "#475569" };
  const id = cert.credId;
  return (
    <svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={"bg-" + id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={d.bg[0]} />
          <stop offset="100%" stopColor={d.bg[1]} />
        </linearGradient>
        <linearGradient id={"br-" + id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={d.border} />
          <stop offset="100%" stopColor={d.accent}  />
        </linearGradient>
      </defs>

      <rect width="800" height="560" fill={"url(#bg-" + id + ")"} />
      <rect x="14" y="14" width="772" height="532" rx="8" fill="none" stroke={"url(#br-" + id + ")"} strokeWidth="3"/>
      <rect x="22" y="22" width="756" height="516" rx="6" fill="none" stroke={d.border} strokeWidth="1" strokeOpacity="0.25"/>
      <rect x="14" y="14" width="772" height="7"   rx="4" fill={"url(#br-" + id + ")"}/>
      <rect x="14" y="539" width="772" height="7"  rx="4" fill={"url(#br-" + id + ")"}/>

      {[[30,30],[770,30],[30,530],[770,530]].map(([cx,cy],i) => (
        <g key={i} transform={"translate(" + cx + "," + cy + ") rotate(" + (i*90) + ")"}>
          <path d="M0,0 L18,0 L0,18 Z" fill={d.border} opacity="0.45"/>
          <circle cx="0" cy="0" r="4" fill={d.accent} opacity="0.9"/>
        </g>
      ))}

      <circle cx="690" cy="95"  r="85" fill={d.border} opacity="0.04"/>
      <circle cx="690" cy="95"  r="55" fill={d.border} opacity="0.04"/>
      <circle cx="115" cy="455" r="70" fill={d.border} opacity="0.04"/>

      <text x="400" y="78"  textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" letterSpacing="7" fill={d.accent} opacity="0.65">CERTIFICATE OF ACHIEVEMENT</text>
      <line x1="155" y1="92" x2="318" y2="92" stroke={d.border} strokeWidth="1" opacity="0.35"/>
      <circle cx="400" cy="92" r="3" fill={d.border} opacity="0.55"/>
      <line x1="482" y1="92" x2="645" y2="92" stroke={d.border} strokeWidth="1" opacity="0.35"/>

      <circle cx="400" cy="155" r="38" fill="white"    stroke={d.border} strokeWidth="2"   opacity="0.9"/>
      <circle cx="400" cy="155" r="30" fill={d.bg[1]}  stroke={d.border} strokeWidth="1.5" opacity="0.65"/>
      <text x="400" y="164" textAnchor="middle" fontFamily="serif" fontSize="26">{cert.logo}</text>

      <text x="400" y="222" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#64748b" fontStyle="italic">This is to certify that</text>
      <text x="400" y="272" textAnchor="middle" fontFamily="Georgia,serif" fontSize="33" fill="#0f172a" fontWeight="bold">Dev Portfolio</text>
      <line x1="210" y1="285" x2="590" y2="285" stroke={d.border} strokeWidth="1.5" opacity="0.45"/>
      <text x="400" y="315" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fill="#94a3b8" fontStyle="italic">has successfully completed and demonstrated proficiency in</text>
      <text x="400" y="357" textAnchor="middle" fontFamily="Georgia,serif" fontSize="21" fill={d.accent} fontWeight="bold">{cert.title}</text>
      <text x="400" y="388" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="12" fill="#64748b">Issued by {cert.issuer}</text>

      <line x1="100" y1="412" x2="700" y2="412" stroke={d.border} strokeWidth="0.7" opacity="0.25" strokeDasharray="5,5"/>

      <text x="180" y="440" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fill="#94a3b8">DATE ISSUED</text>
      <text x="180" y="458" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" fill="#374151" fontWeight="600">{cert.date}</text>
      <text x="400" y="440" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fill="#94a3b8">CREDENTIAL ID</text>
      <text x="400" y="458" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="12" fill={d.accent} fontWeight="600">{cert.credId}</text>
      <text x="620" y="440" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fill="#94a3b8">VALID UNTIL</text>
      <text x="620" y="458" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" fill="#374151" fontWeight="600">{cert.expires}</text>

      <circle cx="400" cy="505" r="15" fill={d.accent} opacity="0.12"/>
      <circle cx="400" cy="505" r="9"  fill={d.accent} opacity="0.22"/>
      <text x="400" y="510" textAnchor="middle" fontFamily="serif" fontSize="10" fill={d.accent}>✓</text>
    </svg>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

function Lightbox({ index, onClose, onGo }) {
  const cert = CERTS[index];
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
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(8,12,24,0.93)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 5rem",
        animation: "fadeIn 0.18s ease",
      }}
    >
      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onGo((index - 1 + total) % total); }}
        style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 50, height: 50, cursor: "pointer", color: "white", fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}
      >‹</button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onGo((index + 1) % total); }}
        style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 50, height: 50, cursor: "pointer", color: "white", fontSize: "1.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}
      >›</button>

      {/* Close */}
      <button
        onClick={onClose}
        style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", color: "white", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
      >✕</button>

      {/* Certificate image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 820, borderRadius: 14, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", animation: "zoomIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <CertSVG cert={cert} />
      </div>

      {/* Dot indicators */}
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem" }}>
        {CERTS.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); onGo(i); }}
            style={{ width: i === index ? 22 : 8, height: 8, borderRadius: 100, background: i === index ? "white" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid #e5e7eb" : "none", transition: "all 0.3s ease", padding: "0 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.25rem", color: "#111", letterSpacing: "-0.02em" }}>&lt;dev /&gt;</div>
        <div style={{ display: "flex", gap: "2rem" }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <a key={link} href={"#" + link.toLowerCase()} onClick={() => setActive(link)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.875rem", fontWeight: active === link ? 600 : 400, color: active === link ? "#111" : "#6b7280", textDecoration: "none", borderBottom: active === link ? "2px solid #111" : "2px solid transparent", paddingBottom: "2px", transition: "all 0.2s" }}>{link}</a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="burger" style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#111" }}>☰</button>
      </div>
      {menuOpen && (
        <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={"#" + link.toLowerCase()} onClick={() => { setActive(link); setMenuOpen(false); }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: "#111", textDecoration: "none", fontWeight: 500 }}>{link}</a>
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
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#15803d", fontWeight: 500 }}>Available for work</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(2.5rem,6vw,5rem)", color: "#0f172a", lineHeight: 1.05, margin: "0 0 1.5rem", letterSpacing: "-0.03em" }}>
            Backend Engineer<br/><span style={{ color: "#3b82f6" }}>who builds things</span><br/>that scale.
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.125rem", color: "#64748b", maxWidth: 520, lineHeight: 1.7, margin: "0 0 2.5rem" }}>Specializing in Node.js, Vue.js, and React. I design robust APIs, microservices, and full-stack systems that power modern applications.</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, background: "#0f172a", color: "white", padding: "0.85rem 2rem", borderRadius: 12, textDecoration: "none", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(15,23,42,0.25)" }}>View Projects →</a>
            <a href="#contact"  style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, background: "white", color: "#0f172a", padding: "0.85rem 2rem", borderRadius: 12, textDecoration: "none", fontSize: "0.9rem", border: "1.5px solid #e2e8f0" }}>Get in Touch</a>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "3rem" }}>
            {["Node.js","Vue.js","React","PostgreSQL","Docker","AWS"].map((t,i) => (
              <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", padding: "0.35rem 0.85rem", borderRadius: 8, opacity: inView ? 1 : 0, transition: "opacity 0.5s " + (0.2 + i*0.08) + "s" }}>{t}</span>
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
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{skill.icon} {skill.name}</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", color: "#6b7280" }}>{skill.level}%</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#3b82f6,#6366f1)", width: inView ? skill.level + "%" : "0%", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1) " + delay + "s" }} />
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState("All");
  const tags = ["All","Node.js","Vue.js","React","Backend"];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tag === filter);

  return (
    <section id="projects" ref={ref} style={{ padding: "8rem 2rem", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// selected work</p>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>Projects</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tags.map(tag => <button key={tag} onClick={() => setFilter(tag)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", padding: "0.4rem 1rem", borderRadius: 100, border: filter===tag ? "none" : "1.5px solid #e2e8f0", background: filter===tag ? "#0f172a" : "white", color: filter===tag ? "white" : "#6b7280", cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}>{tag}</button>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.2s" }} className="skills-grid">
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: "#0f172a", marginBottom: "1.5rem" }}>Core Skills</h3>
            {SKILLS.map((s,i) => <SkillBar key={s.name} skill={s} inView={inView} delay={0.1 + i*0.1} />)}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 20, padding: "2rem" }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: "#0f172a", marginBottom: "1.25rem" }}>About Me</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.8, marginBottom: "1rem" }}>Backend engineer with 5+ years building scalable systems. Passionate about clean architecture, API design, and developer experience.</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.8 }}>I bridge the gap between backend robustness and frontend elegance using React and Vue.js.</p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
              {[["5+","Years Exp."],["30+","Projects"],["15+","Clients"]].map(([n,l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.75rem", color: "#0f172a" }}>{n}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "#94a3b8" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
          {filtered.map((p,i) => (
            <div key={p.title} style={{ background: "white", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "1.75rem", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease " + (0.1+i*0.1) + "s", cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=p.color; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#f1f5f9"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)"; }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color, borderRadius: "16px 16px 0 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.1rem", color: "#0f172a", margin: 0 }}>{p.title}</h3>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", background: p.color+"22", color: p.color, padding: "0.2rem 0.65rem", borderRadius: 100, fontWeight: 600, whiteSpace: "nowrap" }}>{p.tag}</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, margin: "0 0 1.25rem" }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {p.tech.map(t => <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", background: "#f8fafc", color: "#475569", padding: "0.2rem 0.6rem", borderRadius: 6, border: "1px solid #e2e8f0" }}>{t}</span>)}
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
  const [ref, inView] = useInView();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section id="certificates" ref={ref} style={{ padding: "8rem 2rem", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// credentials</p>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 0.4rem", letterSpacing: "-0.02em" }}>Certificates</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.875rem", color: "#94a3b8" }}>คลิกที่ใบเกียรติบัตรเพื่อดูขนาดเต็ม</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
          {CERTS.map((cert, i) => (
            <div
              key={cert.credId}
              onClick={() => setLightboxIndex(i)}
              style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "opacity 0.55s ease " + (i*0.07) + "s, transform 0.55s ease " + (i*0.07) + "s, box-shadow 0.22s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.15)"; e.currentTarget.style.transform="translateY(-5px) scale(1.01)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="none"; }}
            >
              <CertSVG cert={cert} />
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onGo={setLightboxIndex}
        />
      )}
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function ContactSection() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (!form.name || !form.email || !form.message) { setStatus("error"); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setStatus("success"); setForm({ name:"", email:"", subject:"", message:"" }); }, 1500);
  };

  const inp = { width: "100%", padding: "0.85rem 1rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none", background: "white", color: "#0f172a", boxSizing: "border-box", transition: "border-color 0.2s" };

  return (
    <section id="contact" ref={ref} style={{ padding: "8rem 2rem", background: "linear-gradient(135deg,#f8fafc 0%,#f0f4ff 100%)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease", textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// get in touch</p>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0f172a", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Let's Work Together</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#64748b", fontSize: "1rem", lineHeight: 1.7 }}>Have a project in mind? I'd love to hear about it.</p>
        </div>
        <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.7s ease 0.2s" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="form-grid">
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Name *</label>
              <input style={inp} placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Email *</label>
              <input style={inp} placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Subject</label>
            <input style={inp} placeholder="Project inquiry…" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#374151", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Message *</label>
            <textarea style={{...inp, minHeight:130, resize:"vertical"}} placeholder="Tell me about your project…" value={form.message} onChange={e => setForm({...form, message:e.target.value})} onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
          </div>
          {status === "success" && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.875rem", color:"#15803d" }}>✓ Message sent!</div>}
          {status === "error"   && <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:10, padding:"0.85rem", marginBottom:"1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.875rem", color:"#be123c" }}>Please fill in all required fields.</div>}
          <button onClick={submit} disabled={sending} style={{ width:"100%", padding:"0.9rem", background: sending?"#94a3b8":"#0f172a", color:"white", border:"none", borderRadius:10, cursor: sending?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", fontWeight:600, transition:"all 0.2s" }}>
            {sending ? "Sending…" : "Send Message →"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: "#0f172a", color: "#475569", padding: "2rem", textAlign: "center", fontFamily: "'DM Mono',monospace", fontSize: "0.75rem" }}>
      <span style={{ color: "#64748b" }}>© 2026 </span>
      <span style={{ color: "#3b82f6" }}>&lt;dev /&gt;</span>
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background:white; }
        @keyframes float  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-20px)} }
        @keyframes pulse  { 0%,100%{opacity:1}                 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0}                    to{opacity:1} }
        @keyframes zoomIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @media(max-width:768px){
          .desktop-nav { display:none!important }
          .burger      { display:block!important }
          .skills-grid { grid-template-columns:1fr!important }
          .form-grid   { grid-template-columns:1fr!important }
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
