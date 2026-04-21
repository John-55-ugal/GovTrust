import { useState, useEffect, useRef } from "react";

// ── Google Fonts ──────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family:'DM Sans', sans-serif; background: #050d1a; color: #e2e8f0; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #0a1628; }
    ::-webkit-scrollbar-thumb { background: #00c896; border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes grid-drift {
      from { background-position: 0 0; }
      to   { background-position: 60px 60px; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes scanline {
      0%   { top: -2px; }
      100% { top: 100%; }
    }
    @keyframes countUp { from { opacity:0; } to { opacity:1; } }

    .fade-up   { animation: fadeUp 0.7s ease both; }
    .float-el  { animation: float 4s ease-in-out infinite; }
    .shimmer-text {
      background: linear-gradient(90deg, #00c896 0%, #ffffff 40%, #00c896 60%, #ffd700 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }
    .grid-bg {
      background-image:
        linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: grid-drift 12s linear infinite;
    }
    .glass {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(0,200,150,0.12);
    }
    .card-hover {
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      border-color: rgba(0,200,150,0.5) !important;
      box-shadow: 0 0 32px rgba(0,200,150,0.12);
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a878);
      color: #050d1a;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      letter-spacing: 0.03em;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,200,150,0.35); }
    .btn-primary:hover::after { opacity: 1; }

    .btn-outline {
      border: 1.5px solid rgba(0,200,150,0.45);
      color: #00c896;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      transition: all 0.25s ease;
    }
    .btn-outline:hover {
      background: rgba(0,200,150,0.08);
      border-color: #00c896;
      box-shadow: 0 0 20px rgba(0,200,150,0.15);
    }

    .input-field {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(0,200,150,0.18);
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    .input-field::placeholder { color: rgba(226,232,240,0.3); }
    .input-field:focus {
      outline: none;
      border-color: #00c896;
      box-shadow: 0 0 0 3px rgba(0,200,150,0.12);
    }

    .satellite-orb {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(0,200,150,0.2);
    }
    .satellite-orb::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 50%;
      border: 1px solid rgba(0,200,150,0.2);
      animation: pulse-ring 2.5s ease-out infinite;
    }

    .nav-link {
      position: relative;
      color: rgba(226,232,240,0.7);
      transition: color 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1.5px;
      background: #00c896;
      transition: width 0.2s;
    }
    .nav-link:hover { color: #00c896; }
    .nav-link:hover::after { width: 100%; }

    .step-connector {
      position: absolute;
      top: 28px; left: calc(50% + 40px);
      width: calc(100% - 80px);
      height: 1px;
      background: linear-gradient(90deg, #00c896, rgba(0,200,150,0.1));
    }
    .stat-num {
      font-family: 'Space Mono', monospace;
      color: #00c896;
    }
  `}</style>
);

// ── Shared Nav ────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.3s",
      background: scrolled ? "rgba(5,13,26,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,200,150,0.1)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg,#00c896,#00a878)",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050d1a" strokeWidth="2.5">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: "#e2e8f0", letterSpacing: "0.01em" }}>
            Imani<span style={{ color: "#00c896" }}>.NG</span>
          </span>
        </button>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Features","How It Works","About"].map(l => (
            <button key={l} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-outline" onClick={() => setPage("login")}
            style={{ padding: "8px 22px", borderRadius: 8, fontSize: 14, cursor: "pointer", background: "none" }}>
            Log In
          </button>
          <button className="btn-primary" onClick={() => setPage("signup")}
            style={{ padding: "8px 22px", borderRadius: 8, fontSize: 14, cursor: "pointer", border: "none" }}>
            Get Access
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Home Page ─────────────────────────────────────────────────
function HomePage({ setPage }) {
  const features = [
    { icon: "🛰️", title: "Satellite Imagery Analysis", desc: "Real-time corroboration of construction sites via multispectral satellite feeds. AI detects excavation, material presence, and progress stages with sub-meter precision." },
    { icon: "📡", title: "IoT Sensor Network", desc: "Ground-truth sensors log temperature, vibration, concrete curing, and equipment uptime — creating tamper-evident audit trails throughout a project's lifecycle." },
    { icon: "📸", title: "Crowdsourced Verification", desc: "Citizens submit geo-tagged photographic evidence reviewed by smart contracts, community validators, and machine vision to surface discrepancies instantly." },
    { icon: "🔐", title: "Blockchain Audit Trail", desc: "Every data point — satellite pass, sensor reading, community report — is immutably hashed to a public ledger, producing undeniable milestone evidence." },
    { icon: "⚡", title: "Real-Time Alerts", desc: "Anomaly detection surfaces stalled projects, inconsistent data, or suspicious milestone claims and routes them to oversight agencies within minutes." },
    { icon: "📊", title: "Multi-Source Correlation", desc: "A proprietary trust score synthesizes all three data layers into a unified confidence index, flagging ghost projects before funds are released." },
  ];

  const steps = [
    { n: "01", title: "Data Ingestion", desc: "Satellite passes, IoT logs, and citizen reports flow into the corroboration engine simultaneously." },
    { n: "02", title: "AI Correlation", desc: "Machine learning cross-references all three data sources to detect alignment or anomalies." },
    { n: "03", title: "Trust Scoring", desc: "A composite confidence score is generated and logged to the immutable blockchain ledger." },
    { n: "04", title: "Oversight Action", desc: "Verified milestones unlock fund tranches; flagged projects trigger automatic agency escalation." },
  ];

  const stats = [
    { val: "₦4.2T", label: "In Public Funds Monitored" },
    { val: "2,800+", label: "Active Projects Tracked" },
    { val: "98.6%", label: "Detection Accuracy" },
    { val: "< 4min", label: "Avg. Alert Response Time" },
  ];

  return (
    <div style={{ background: "#050d1a", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />

        {/* Orbs */}
        <div style={{ position: "absolute", top: "18%", right: "8%", width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "5%", width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

        {/* Floating satellite graphic */}
        <div className="float-el" style={{ position: "absolute", top: "14%", right: "12%", opacity: 0.22 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" stroke="#00c896" strokeWidth="0.8" strokeDasharray="4 3"/>
            <circle cx="60" cy="60" r="40" stroke="#00c896" strokeWidth="0.5" strokeDasharray="2 4"/>
            <circle cx="60" cy="60" r="6" fill="#00c896"/>
            <line x1="60" y1="2" x2="60" y2="20" stroke="#00c896" strokeWidth="1.5"/>
            <line x1="60" y1="100" x2="60" y2="118" stroke="#00c896" strokeWidth="1.5"/>
            <rect x="20" y="55" width="20" height="10" rx="2" stroke="#00c896" strokeWidth="1" fill="none"/>
            <rect x="80" y="55" width="20" height="10" rx="2" stroke="#00c896" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        <div style={{ position: "relative", maxWidth: 760, textAlign: "center" }}>
          {/* Badge */}
          <div className="fade-up" style={{ animationDelay: "0.05s", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(0,200,150,0.3)",
            background: "rgba(0,200,150,0.06)", marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00c896", display: "inline-block",
              boxShadow: "0 0 8px #00c896" }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#00c896", letterSpacing: "0.12em" }}>
              FEDERAL REPUBLIC OF NIGERIA · PUBLIC INFRASTRUCTURE INTEGRITY
            </span>
          </div>

          <h1 className="fade-up shimmer-text" style={{ animationDelay: "0.15s",
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2.6rem,6vw,4.4rem)",
            lineHeight: 1.1, marginBottom: 24 }}>
            Ending Ghost Projects.<br/>Verifying Every Naira.
          </h1>

          <p className="fade-up" style={{ animationDelay: "0.25s", fontSize: "1.1rem", lineHeight: 1.75,
            color: "rgba(226,232,240,0.65)", maxWidth: 560, margin: "0 auto 40px" }}>
            A multi-layered trust architecture that correlates satellite imagery,
            IoT sensor data, and crowdsourced evidence to verify government project
            milestones in real time — before funds are released.
          </p>

          <div className="fade-up" style={{ animationDelay: "0.35s", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => setPage("signup")}
              style={{ padding: "14px 34px", borderRadius: 10, fontSize: 16, cursor: "pointer", border: "none" }}>
              Request Access →
            </button>
            <button className="btn-outline" style={{ padding: "14px 34px", borderRadius: 10, fontSize: 16, cursor: "pointer", background: "none" }}>
              View Demo
            </button>
          </div>

          {/* Mini trust indicators */}
          <div className="fade-up" style={{ animationDelay: "0.45s", display: "flex", justifyContent: "center", gap: 24, marginTop: 56, flexWrap: "wrap" }}>
            {["NITDA Compliant", "ISO 27001 Ready", "Open-Source Core"].map(t => (
              <span key={t} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10,
                color: "rgba(0,200,150,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "64px 24px", borderTop: "1px solid rgba(0,200,150,0.08)", borderBottom: "1px solid rgba(0,200,150,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="stat-num" style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
              <div style={{ color: "rgba(226,232,240,0.5)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DATA LAYERS VISUAL ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#00c896", letterSpacing: "0.15em", marginBottom: 12 }}>THE ARCHITECTURE</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#e2e8f0" }}>
              Three Layers. One Truth.
            </h2>
          </div>

          {/* 3-layer visual */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, maxWidth: 800, margin: "0 auto 80px" }}>
            {[
              { label: "LAYER 01", name: "Satellite", color: "#00c896", icon: "🛰️", desc: "Multispectral orbital data" },
              { label: "LAYER 02", name: "IoT Mesh", color: "#ffd700", icon: "📡", desc: "Ground sensor telemetry" },
              { label: "LAYER 03", name: "Crowd", color: "#60a5fa", icon: "📸", desc: "Citizen photo submissions" },
            ].map((l, i) => (
              <div key={i} className="card-hover" style={{
                padding: "32px 20px", textAlign: "center",
                background: `rgba(${l.color === "#00c896" ? "0,200,150" : l.color === "#ffd700" ? "255,215,0" : "96,165,250"},0.05)`,
                border: `1px solid ${l.color}22`,
                borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : 0,
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{l.icon}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: l.color, letterSpacing: "0.12em", marginBottom: 6 }}>{l.label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#e2e8f0", marginBottom: 6 }}>{l.name}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(226,232,240,0.45)" }}>{l.desc}</div>
              </div>
            ))}
          </div>

          {/* Merge indicator */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 32px",
              borderRadius: 100, background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.25)" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#00c896" }}>
                ↓ AI Correlation Engine
              </span>
              <span style={{ width: 1, height: 20, background: "rgba(0,200,150,0.3)" }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(226,232,240,0.5)" }}>
                Composite Trust Score → Blockchain Ledger
              </span>
            </div>
          </div>

          {/* Feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="glass card-hover" style={{ padding: "28px 24px", borderRadius: 14, cursor: "default" }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#e2e8f0", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(226,232,240,0.55)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "100px 24px", background: "rgba(0,200,150,0.025)", borderTop: "1px solid rgba(0,200,150,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#00c896", letterSpacing: "0.15em", marginBottom: 12 }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#e2e8f0" }}>
              From Raw Data to Verified Truth
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="card-hover" style={{ position: "relative", padding: "32px 24px",
                borderRadius: 14, border: "1px solid rgba(0,200,150,0.12)", background: "rgba(0,10,20,0.6)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "2rem", fontWeight: 700,
                  color: "rgba(0,200,150,0.2)", marginBottom: 12 }}>{s.n}</div>
                <div style={{ width: 42, height: 2, background: "linear-gradient(90deg,#00c896,transparent)", margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#e2e8f0", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(226,232,240,0.5)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom,transparent,#00c896)", margin: "0 auto 40px" }} />
          <blockquote style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700,
            fontSize: "clamp(1.4rem,3.5vw,2.1rem)", lineHeight: 1.4, color: "rgba(226,232,240,0.85)",
            borderLeft: "3px solid #00c896", paddingLeft: 28, textAlign: "left", maxWidth: 700, margin: "0 auto 40px" }}>
            "Every public naira spent must leave a verifiable trail. TrustVerify.NG closes the gap between project approval and physical reality."
          </blockquote>
          <p style={{ color: "rgba(0,200,150,0.7)", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.1em" }}>
            — CORE MISSION · BUREAU OF PUBLIC PROCUREMENT INTEGRATION
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center",
          padding: "64px 40px", borderRadius: 20,
          background: "linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,168,120,0.05))",
          border: "1px solid rgba(0,200,150,0.2)" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2rem", color: "#e2e8f0", marginBottom: 16 }}>
            Ready to Enforce Accountability?
          </h2>
          <p style={{ color: "rgba(226,232,240,0.55)", marginBottom: 36, lineHeight: 1.7 }}>
            Join oversight agencies, anti-corruption bodies, and civil society organisations already using TrustVerify.NG to monitor public infrastructure.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => setPage("signup")}
              style={{ padding: "14px 36px", borderRadius: 10, fontSize: 16, cursor: "pointer", border: "none" }}>
              Create Account
            </button>
            <button className="btn-outline" onClick={() => setPage("login")}
              style={{ padding: "14px 36px", borderRadius: 10, fontSize: 16, cursor: "pointer", background: "none" }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(0,200,150,0.08)", padding: "36px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        maxWidth: 1100, margin: "0 auto" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "rgba(226,232,240,0.4)", fontSize: 14 }}>
          TrustVerify<span style={{ color: "#00c896" }}>.NG</span> © 2025
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy","Terms","API Docs","FOIA"].map(l => (
            <span key={l} style={{ color: "rgba(226,232,240,0.35)", fontSize: 13, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#00c896"} onMouseLeave={e => e.target.style.color="rgba(226,232,240,0.35)"}>
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ── Auth Shell ────────────────────────────────────────────────
function AuthShell({ children, title, sub }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "stretch" }}>
      {/* Left panel */}
      <div style={{ flex: "0 0 45%", position: "relative", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 56px", overflow: "hidden" }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ position: "absolute", top: "30%", left: "20%", width: 300, height: 300,
          background: "radial-gradient(circle,rgba(0,200,150,0.15) 0%,transparent 70%)", filter: "blur(50px)" }} />

        <div style={{ position: "relative" }}>
          <div className="float-el" style={{ marginBottom: 48 }}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <circle cx="45" cy="45" r="43" stroke="rgba(0,200,150,0.25)" strokeWidth="1"/>
              <circle cx="45" cy="45" r="30" stroke="rgba(0,200,150,0.15)" strokeWidth="1" strokeDasharray="3 4"/>
              <circle cx="45" cy="45" r="6" fill="#00c896"/>
              {[0,60,120,180,240,300].map((deg, i) => {
                const r = 30, rad = (deg * Math.PI) / 180;
                const x = 45 + r * Math.sin(rad), y = 45 - r * Math.cos(rad);
                return <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(0,200,150,0.5)"/>;
              })}
            </svg>
          </div>

          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2rem",
            color: "#e2e8f0", lineHeight: 1.25, marginBottom: 16 }}>
            Multi-Layered<br/><span style={{ color: "#00c896" }}>Trust Architecture</span>
          </h2>
          <p style={{ color: "rgba(226,232,240,0.5)", lineHeight: 1.8, marginBottom: 40, maxWidth: 340, fontSize: "0.9rem" }}>
            Correlating satellite imagery, IoT sensor logs, and crowdsourced evidence to eliminate ghost projects across Nigeria's public infrastructure.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Satellite-verified milestones", "Tamper-evident audit logs", "Real-time anomaly detection"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,200,150,0.15)",
                  border: "1px solid rgba(0,200,150,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#00c896" strokeWidth="1.8"/>
                  </svg>
                </div>
                <span style={{ fontSize: "0.85rem", color: "rgba(226,232,240,0.6)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 40px", borderLeft: "1px solid rgba(0,200,150,0.08)" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.9rem", color: "#e2e8f0", marginBottom: 8 }}>{title}</h1>
            <p style={{ color: "rgba(226,232,240,0.45)", fontSize: "0.9rem" }}>{sub}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────
function LoginPage({ setPage }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <AuthShell title="Welcome Back" sub="Sign in to your TrustVerify.NG account">
      <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226,232,240,0.6)",
            letterSpacing: "0.06em", marginBottom: 8, fontFamily: "'Space Mono',monospace" }}>
            EMAIL ADDRESS
          </label>
          <input type="email" required placeholder="you@agency.gov.ng" className="input-field"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15 }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226,232,240,0.6)",
            letterSpacing: "0.06em", marginBottom: 8, fontFamily: "'Space Mono',monospace" }}>
            PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input type={show ? "text" : "password"} required placeholder="••••••••••" className="input-field"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ padding: "12px 44px 12px 16px", borderRadius: 10, fontSize: 15 }} />
            <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer",
              color: "rgba(226,232,240,0.4)", fontSize: 13 }}>
              {show ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })}
              style={{ accentColor: "#00c896" }} />
            <span style={{ fontSize: 13, color: "rgba(226,232,240,0.5)" }}>Remember me</span>
          </label>
          <span style={{ fontSize: 13, color: "#00c896", cursor: "pointer" }}>Forgot password?</span>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}
          style={{ padding: "14px", borderRadius: 10, fontSize: 16, cursor: "pointer", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(5,13,26,0.3)",
                borderTopColor: "#050d1a", borderRadius: "50%", display: "inline-block",
                animation: "spin 0.8s linear infinite" }} />
              Authenticating…
            </>
          ) : "Sign In →"}
        </button>

        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1,
            background: "rgba(0,200,150,0.1)", transform: "translateY(-50%)" }} />
          <span style={{ position: "relative", background: "#050d1a", padding: "0 12px",
            fontSize: 12, color: "rgba(226,232,240,0.3)", fontFamily: "'Space Mono',monospace" }}>OR</span>
        </div>

        <button type="button" className="btn-outline" style={{ padding: "13px", borderRadius: 10, fontSize: 14,
          cursor: "pointer", background: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🏛️</span> Sign in with Government SSO
        </button>

        <p style={{ textAlign: "center", fontSize: 14, color: "rgba(226,232,240,0.4)" }}>
          No account yet?{" "}
          <button type="button" onClick={() => setPage("signup")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#00c896", fontWeight: 600 }}>
            Request Access
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

// ── Sign Up Page ──────────────────────────────────────────────
function SignupPage({ setPage }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", agency: "", role: "", phone: "", password: "", confirm: "", agree: false
  });
  const [loading, setLoading] = useState(false);

  const roles = ["Federal Agency Official","State Government Rep","Anti-Corruption Investigator",
    "Civil Society Monitor","Journalist / Researcher","Technical Integrator"];

  const next = (e) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <AuthShell title="Request Access" sub="Join the infrastructure accountability network">
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {[1,2].map(n => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2,
            background: n <= step ? "#00c896" : "rgba(0,200,150,0.15)",
            transition: "background 0.4s" }} />
        ))}
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "rgba(0,200,150,0.6)", letterSpacing: "0.1em", marginBottom: 24 }}>
        STEP {step} OF 2 — {step === 1 ? "IDENTITY DETAILS" : "ACCESS CONFIGURATION"}
      </div>

      <form onSubmit={next} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {step === 1 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                  letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>FULL NAME</label>
                <input required placeholder="Chukwuemeka Obi" className="input-field"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                  letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>PHONE</label>
                <input required placeholder="+234 8xx xxx xxxx" className="input-field"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>OFFICIAL EMAIL</label>
              <input type="email" required placeholder="name@agency.gov.ng" className="input-field"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>AGENCY / ORGANISATION</label>
              <input required placeholder="e.g. ICPC, BPP, EFCC, Ministry of Works…" className="input-field"
                value={form.agency} onChange={e => setForm({ ...form, agency: e.target.value })}
                style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
            </div>

            <button type="submit" className="btn-primary"
              style={{ padding: "13px", borderRadius: 10, fontSize: 15, cursor: "pointer", border: "none", marginTop: 4 }}>
              Continue →
            </button>
          </>
        ) : (
          <>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>YOUR ROLE</label>
              <select required className="input-field"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }}>
                <option value="">Select role…</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>CREATE PASSWORD</label>
              <input type="password" required placeholder="Min. 12 characters" className="input-field"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(226,232,240,0.5)",
                letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>CONFIRM PASSWORD</label>
              <input type="password" required placeholder="Repeat password" className="input-field"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                style={{ padding: "11px 14px", borderRadius: 9, fontSize: 14 }} />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" required checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })}
                style={{ accentColor: "#00c896", marginTop: 2 }} />
              <span style={{ fontSize: 12.5, color: "rgba(226,232,240,0.45)", lineHeight: 1.6 }}>
                I certify I am an authorised government or civil society actor and agree to the{" "}
                <span style={{ color: "#00c896" }}>Data Use Policy</span> and{" "}
                <span style={{ color: "#00c896" }}>Terms of Access</span>.
              </span>
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setStep(1)} className="btn-outline"
                style={{ flex: "0 0 auto", padding: "13px 20px", borderRadius: 10, fontSize: 15, cursor: "pointer", background: "none" }}>
                ←
              </button>
              <button type="submit" className="btn-primary" disabled={loading}
                style={{ flex: 1, padding: "13px", borderRadius: 10, fontSize: 15, cursor: "pointer", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? (
                  <>
                    <span style={{ width: 15, height: 15, border: "2px solid rgba(5,13,26,0.3)",
                      borderTopColor: "#050d1a", borderRadius: "50%", display: "inline-block",
                      animation: "spin 0.8s linear infinite" }} />
                    Submitting…
                  </>
                ) : "Submit Application"}
              </button>
            </div>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(226,232,240,0.4)", marginTop: 4 }}>
          Already have access?{" "}
          <button type="button" onClick={() => setPage("login")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#00c896", fontWeight: 600 }}>
            Sign In
          </button>
        </p>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #0a1628; color: #e2e8f0; }
      `}</style>
    </AuthShell>
  );
}

// ── App Root ──────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <>
      <FontLoader />
      <Navbar page={page} setPage={setPage} />
      {page === "home"   && <HomePage   setPage={setPage} />}
      {page === "login"  && <LoginPage  setPage={setPage} />}
      {page === "signup" && <SignupPage setPage={setPage} />}
    </>
  );
}
