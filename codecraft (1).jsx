import { useState, useRef, useEffect, useCallback } from "react";

const SYS = `You are CodeCraft AI — an elite senior frontend developer and UI/UX designer with 15 years of experience. You build websites that look like they cost $50,000+.

## DESIGN PHILOSOPHY
Design like Apple.com, Stripe.com, Linear.app, Vercel.com:
1. Hero sections: full-viewport, 80-120px headings, cinematic backgrounds with overlays
2. Typography: Import 2 Google Fonts via <link> — one display font (Playfair Display, Outfit, Sora, Plus Jakarta Sans) and one body font (DM Sans, Manrope). Large sizes, tight letter-spacing on headings
3. Colors: 1 dominant base, 1 brand accent, 1 subtle secondary. Max 3-4 colors. Use opacity variations
4. Whitespace: 100-140px vertical section padding. Max-width 1200px. Let things breathe
5. Animations: IntersectionObserver scroll reveals with staggered delays. Smooth CSS transitions everywhere
6. Interactivity: Sticky header changing on scroll, smooth scroll nav, working mobile hamburger, hover transforms, tabs, accordions, form validation, carousels
7. Images: Use https://picsum.photos/WIDTH/HEIGHT for realistic photos, or rich CSS gradients
8. Footer: Multi-column with real links, SVG social icons, newsletter signup

## HANDLING VAGUE PROMPTS
If someone says "make me a restaurant website", YOU expand it to a full 6-10 section site. Pick colors, typography, sections, interactivity, and write real compelling copy. NEVER make bare-bones sites.

## CODE STANDARDS
- Semantic HTML5, CSS Grid/Flexbox, CSS custom properties
- Mobile responsive with @media at 768px
- html { scroll-behavior: smooth }
- All elements have hover/focus/active states with 0.3s transitions
- IntersectionObserver for .reveal scroll animations
- Working JS: mobile menu, scroll spy, tabs, accordion, form validation
- Import Google Fonts via <link> in <head>
- NO emoji as design elements — use SVG icons or CSS shapes

## RESPONSE FORMAT
**THINKING:** (2-4 sentences: design vision, hex colors, fonts, sections)

**CODE_START**
<!DOCTYPE html>
<html lang="en">
...complete production website...
</html>
**CODE_END**

**DONE:** (Summary + 2 enhancement suggestions)

## RULES
- ONE self-contained HTML file. ALL CSS in <style>, ALL JS in <script>
- EVERY button/link does something real
- Real copy, not lorem ipsum
- For changes: explain then output FULL updated file
- Non-build questions: answer normally, no CODE markers`;

const C = {
  bg: "#0C0C0C",
  panel: "#111111",
  surface: "#181818",
  surfaceHover: "#222222",
  border: "#252525",
  text: "#ECECEC",
  text2: "#888888",
  text3: "#505050",
  blue: "#3B82F6",
  green: "#22C55E",
  red: "#EF4444",
  mono: "'SF Mono','Fira Code','Consolas',monospace",
};

const SUGGESTIONS = [
  {
    label: "Restaurant Website",
    prompt: "Build a premium restaurant website for 'Bellissimo Ristorante'. Include: sticky transparent nav with smooth scroll links, full-screen hero with dark food background overlay and elegant serif heading, about section, tabbed menu (Antipasti/Primi/Secondi/Dolci) with real Italian dishes and prices, photo gallery grid, testimonials with stars, reservation form with date/time/guests validation, and multi-column footer. Colors: burgundy #722F37 accent, cream #FFF8F0 on dark #1a1a1a. Fonts: Playfair Display headings, DM Sans body."
  },
  {
    label: "SaaS Dashboard",
    prompt: "Build an analytics dashboard for 'MetricFlow'. Include: dark sidebar with icon nav and active states, top bar with search and avatar, 4 KPI cards (Revenue $48.2K +12%, Users 12.4K +8%, Conversion 3.2%, MRR 18%) with trend arrows, SVG area chart with gradient fill, bar chart for traffic sources, sortable data table with status badges, and activity timeline. Sidebar nav switches active on click. Dark theme: bg #0f0f13, cards #1a1a23, accent #6366f1. Font: Inter."
  },
  {
    label: "Portfolio Site",
    prompt: "Build a developer portfolio for 'Alex Chen'. Include: minimal sticky nav, hero with animated gradient text and typing effect cycling roles, about with animated skill bars, 6-project bento grid with hover overlays showing tech tags, experience timeline, testimonials horizontal scroll, contact form with validation, footer with GitHub/LinkedIn SVG icons. Dark theme: bg #0a0a0a, accent cyan #06b6d4. Fonts: Sora headings, DM Sans body."
  },
  {
    label: "E-commerce Product",
    prompt: "Build a sneaker product page for 'Nike Air Max Pulse'. Include: product image with 4 thumbnail selectors, color swatches that change on click, size grid selector, quantity counter, Add to Cart with animation, tabbed content (Overview/Specs/Reviews), 3 customer reviews with stars, related products scroll, sticky bottom cart bar on scroll. Dark theme: bg #111, accent orange #FF6B35. Font: Plus Jakarta Sans."
  },
  {
    label: "Landing Page",
    prompt: "Build a SaaS landing page for 'WriteFlow AI Writing Assistant'. Include: sticky nav, hero with 'Write 10x faster' headline and floating UI cards, trusted-by logo bar, 3-column features with SVG icons, How It Works 3 steps with connecting line, pricing with Monthly/Annual toggle that switches prices, testimonial grid, FAQ accordion, newsletter signup, 4-column footer. Dark gradient: #0a0a12 to #0f0f1a, accent green #10b981. Fonts: Outfit headings, Manrope body."
  },
  {
    label: "Fitness App",
    prompt: "Build a fitness tracker dashboard for 'FitPulse'. Include: top nav, greeting card with date, 4 stat cards (Steps/Calories/Heart Rate/Active) with animated SVG circular progress rings, weekly bar chart Mon-Sun, workout history list with icons, working timer with Start/Pause/Reset, upcoming schedule cards, achievement badges grid, bottom tab navigation that switches active state. Dark: bg #0f0f14, cards #1a1a24, accent orange #f97316. Font: DM Sans."
  },
];

const store = {
  async getAccounts() {
    try {
      const r = await window.storage.get("cc_accounts");
      return r ? JSON.parse(r.value) : {};
    } catch { return {}; }
  },
  async saveAccount(email, data) {
    try {
      const accs = await this.getAccounts();
      accs[email.toLowerCase()] = data;
      await window.storage.set("cc_accounts", JSON.stringify(accs));
    } catch {}
  },
  async getSession() {
    try {
      const r = await window.storage.get("cc_session");
      return r ? JSON.parse(r.value) : null;
    } catch { return null; }
  },
  async setSession(u) {
    try { await window.storage.set("cc_session", JSON.stringify(u)); } catch {}
  },
  async clearSession() {
    try { await window.storage.delete("cc_session"); } catch {}
  }
};

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const BoltSVG = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#000"/>
  </svg>
);

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [gModal, setGModal] = useState(false);
  const [gEmail, setGEmail] = useState("");
  const [gStep, setGStep] = useState(1);
  const [gName, setGName] = useState("");

  const validEmail = (e) => e.includes("@") && e.includes(".");

  const doLogin = async (e) => {
    e.preventDefault();
    setErr("");
    if (!validEmail(email)) return setErr("Enter a valid email");
    if (pw.length < 6) return setErr("Password must be 6+ characters");
    setBusy(true);
    const accs = await store.getAccounts();
    const acc = accs[email.toLowerCase()];
    if (!acc) { setBusy(false); return setErr("No account found. Sign up first."); }
    if (acc.password !== pw) { setBusy(false); return setErr("Incorrect password."); }
    const user = { name: acc.name, email: email.toLowerCase() };
    await store.setSession(user);
    onLogin(user);
  };

  const doSignup = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Enter your name");
    if (!validEmail(email)) return setErr("Enter a valid email");
    if (pw.length < 6) return setErr("Password must be 6+ characters");
    setBusy(true);
    const accs = await store.getAccounts();
    if (accs[email.toLowerCase()]) { setBusy(false); return setErr("Account exists. Sign in instead."); }
    await store.saveAccount(email, { name: name.trim(), password: pw, email: email.toLowerCase() });
    const user = { name: name.trim(), email: email.toLowerCase() };
    await store.setSession(user);
    onLogin(user);
  };

  const doGoogle = async () => {
    setErr("");
    if (gStep === 1) {
      if (!validEmail(gEmail)) return setErr("Enter a valid Gmail");
      const accs = await store.getAccounts();
      const existing = accs[gEmail.toLowerCase()];
      if (existing) {
        const user = { name: existing.name, email: gEmail.toLowerCase() };
        await store.setSession(user);
        onLogin(user);
      } else {
        setGStep(2);
      }
    } else {
      if (!gName.trim()) return setErr("Enter your name");
      setBusy(true);
      await store.saveAccount(gEmail, { name: gName.trim(), password: "google_oauth", email: gEmail.toLowerCase() });
      const user = { name: gName.trim(), email: gEmail.toLowerCase() };
      await store.setSession(user);
      onLogin(user);
    }
  };

  const closeGoogle = () => {
    setGModal(false);
    setGStep(1);
    setGEmail("");
    setGName("");
    setErr("");
  };

  return (
    <div className="a-page">
      <div className="a-grid" />
      <div className="a-glow" />

      {gModal && (
        <div className="mo-ov" onClick={closeGoogle}>
          <div className="mo-box" onClick={(e) => e.stopPropagation()}>
            <div className="mo-top">
              <GoogleSVG />
              <h2>Sign in with Google</h2>
            </div>
            {gStep === 1 ? (
              <>
                <p className="mo-desc">Enter your Gmail to continue</p>
                <div className="a-field">
                  <label>Email</label>
                  <input type="email" placeholder="you@gmail.com" value={gEmail}
                    onChange={(e) => setGEmail(e.target.value)} autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") doGoogle(); }} />
                </div>
              </>
            ) : (
              <>
                <p className="mo-desc">Set up your profile</p>
                <div className="mo-email">{gEmail}</div>
                <div className="a-field">
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe" value={gName}
                    onChange={(e) => setGName(e.target.value)} autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") doGoogle(); }} />
                </div>
              </>
            )}
            {err && gModal && <p className="a-err">{err}</p>}
            <div className="mo-btns">
              <button className="mo-cancel" onClick={closeGoogle}>Cancel</button>
              <button className="mo-go" onClick={doGoogle} disabled={busy}>
                {busy ? <span className="a-spin" /> : gStep === 1 ? "Continue" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="a-box">
        <div className="a-logo-row">
          <div className="a-logo-icon"><BoltSVG size={16} /></div>
          <span className="a-logo-text">CodeCraft</span>
          <span className="a-badge">AI</span>
        </div>
        <h1 className="a-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="a-sub">{mode === "login" ? "Sign in to start building" : "Start building apps in minutes"}</p>

        <button className="a-google" onClick={() => { setGModal(true); setErr(""); }} disabled={busy}>
          <GoogleSVG /> Continue with Google
        </button>
        <div className="a-div"><div className="a-div-line" /><span className="a-div-text">or</span><div className="a-div-line" /></div>

        <form onSubmit={mode === "login" ? doLogin : doSignup} className="a-form">
          {mode === "signup" && (
            <div className="a-field">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="a-field">
            <label>Email</label>
            <input type="email" placeholder="you@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="a-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          {err && !gModal && <p className="a-err">{err}</p>}
          <button className="a-submit" type="submit" disabled={busy}>
            {busy ? <span className="a-spin" /> : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <p className="a-switch">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); setPw(""); }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
      <p className="a-legal">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </div>
  );
}

function MainApp({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(null);
  const [previewCode, setPreviewCode] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState("preview");
  const [copied, setCopied] = useState(false);

  const scrollRef = useRef(null);
  const codeBoxRef = useRef(null);
  const inputRef = useRef(null);
  const iframeRef = useRef(null);
  const timerRef = useRef(null);

  const isEmpty = messages.length === 0 && !loading;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, streaming?.phase]);

  useEffect(() => {
    if (codeBoxRef.current) codeBoxRef.current.scrollTop = codeBoxRef.current.scrollHeight;
  }, [streaming?.code]);

  useEffect(() => {
    if (iframeRef.current && previewCode && viewMode === "preview") {
      const d = iframeRef.current.contentDocument;
      d.open();
      d.write(previewCode);
      d.close();
    }
  }, [previewCode, viewMode, showPreview]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const parse = (raw) => {
    let thinking = "", code = "", done = "";
    const cs = raw.indexOf("**CODE_START**");
    const ce = raw.indexOf("**CODE_END**");
    if (cs !== -1) {
      thinking = raw.slice(0, cs).replace(/\*\*THINKING:\*\*\s*/i, "").trim();
      if (ce !== -1) {
        code = raw.slice(cs + 14, ce).trim();
        done = raw.slice(ce + 12).replace(/\*\*DONE:\*\*\s*/i, "").trim();
      } else {
        code = raw.slice(cs + 14).trim();
      }
    } else {
      const hi = raw.indexOf("<!DOCTYPE");
      const lo = raw.indexOf("<!doctype");
      const start = hi !== -1 ? hi : lo;
      if (start !== -1) {
        thinking = raw.slice(0, start).replace(/\*\*THINKING:\*\*\s*/i, "").trim();
        const end = raw.lastIndexOf("</html>");
        if (end !== -1) {
          code = raw.slice(start, end + 7);
          done = raw.slice(end + 7).replace(/\*\*DONE:\*\*\s*/i, "").trim();
        } else {
          code = raw.slice(start);
        }
      } else {
        thinking = raw.replace(/\*\*THINKING:\*\*\s*/i, "").replace(/\*\*DONE:\*\*\s*/i, "").trim();
      }
    }
    return { thinking, code, done };
  };

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    const userMsg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setStreaming(null);
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: SYS,
          messages: next.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const full = data.content?.map((b) => b.text || "").join("") || "Something went wrong.";

      let idx = 0;
      await new Promise((resolve) => {
        timerRef.current = setInterval(() => {
          idx = Math.min(idx + Math.floor(Math.random() * 20) + 8, full.length);
          const p = parse(full.slice(0, idx));
          setStreaming({ ...p, phase: p.done ? "done" : p.code ? "coding" : "thinking" });
          if (idx >= full.length) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            resolve();
          }
        }, 10);
      });

      const final = parse(full);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: full,
          thinking: final.thinking,
          code: final.code,
          done: final.done,
          hasCode: !!final.code,
        },
      ]);
      setStreaming(null);

      if (final.code) {
        setPreviewCode(final.code);
        setShowPreview(true);
        setViewMode("preview");
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error — try again." },
      ]);
      setStreaming(null);
    }
    setLoading(false);
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const newChat = () => {
    setMessages([]);
    setPreviewCode(null);
    setShowPreview(false);
    setStreaming(null);
  };

  const doCopy = () => {
    if (previewCode) {
      navigator.clipboard.writeText(previewCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const doDownload = () => {
    if (!previewCode) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([previewCode], { type: "text/html" }));
    a.download = "app.html";
    a.click();
  };

  const doLogout = async () => {
    await store.clearSession();
    onLogout();
  };

  const renderMessage = (msg, i) => {
    if (msg.role === "user") {
      return (
        <div key={i} className="m-u">
          <div className="m-ub">{msg.content}</div>
        </div>
      );
    }

    return (
      <div key={i} className="m-a">
        <div className="m-av"><BoltSVG /></div>
        <div className="m-ab">
          {msg.thinking && <div className="m-t">{msg.thinking}</div>}
          {msg.hasCode && msg.code && (
            <div className="m-cb">
              <div className="m-cbh">
                <span className="m-cbl">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  index.html
                  <span className="m-cbn">{msg.code.split("\n").length} lines</span>
                </span>
                <button className="m-cbo" onClick={() => { setPreviewCode(msg.code); setShowPreview(true); setViewMode("preview"); }}>
                  Open Preview
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </button>
              </div>
              <pre className="m-cbp">{msg.code.slice(0, 400)}{msg.code.length > 400 ? "\n..." : ""}</pre>
            </div>
          )}
          {msg.done && <div className="m-d">{msg.done}</div>}
          {!msg.hasCode && !msg.thinking && <div className="m-tx">{msg.content}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="left" style={{ flex: showPreview ? "0 0 440px" : "1 1 auto", maxWidth: showPreview ? 440 : "none" }}>
        <div className="hdr">
          <div className="hdr-l">
            <div className="hdr-logo"><BoltSVG size={14} /></div>
            <span className="hdr-n">CodeCraft</span>
            <span className="hdr-b">AI</span>
          </div>
          <div className="hdr-r">
            {messages.length > 0 && (
              <button className="hdr-btn" onClick={newChat}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New
              </button>
            )}
            <div className="hdr-uw">
              <div className="hdr-ua"><span>{user.name?.[0]?.toUpperCase() || "U"}</span></div>
              <div className="hdr-dd">
                <div className="hdr-di">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="hdr-ds" />
                <button className="hdr-do" onClick={doLogout}>Sign Out</button>
              </div>
            </div>
          </div>
        </div>

        <div className="msgs" ref={scrollRef}>
          {isEmpty ? (
            <div className="empty">
              <h1 className="ht">Don't just <em>think</em> it<br /><span className="hg">Build it</span></h1>
              <p className="hs">Describe any website, app, or game. I'll write production-quality code with a live preview.</p>
            </div>
          ) : (
            <div className="ml">
              {messages.map(renderMessage)}
              {loading && (
                <div className="m-a">
                  <div className="m-av"><BoltSVG /></div>
                  <div className="m-ab">
                    {!streaming ? (
                      <div className="m-tx"><div className="dots"><span /><span /><span /></div></div>
                    ) : (
                      <>
                        {streaming.thinking && (
                          <div className="m-t">{streaming.thinking}{streaming.phase === "thinking" && <span className="cur" />}</div>
                        )}
                        {streaming.phase === "coding" && streaming.code && (
                          <div className="m-cb m-cb-live">
                            <div className="m-cbh">
                              <span className="m-cbl">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                index.html
                                <span className="m-wr">Writing...</span>
                              </span>
                              <div className="m-cbc">{streaming.code.split("\n").length} lines</div>
                            </div>
                            <pre className="m-cbp m-cbs" ref={codeBoxRef}>{streaming.code}<span className="cur" /></pre>
                          </div>
                        )}
                        {streaming.phase === "done" && streaming.done && (
                          <div className="m-d">{streaming.done}<span className="cur" /></div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ia">
          {isEmpty && (
            <div className="chips">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chip" onClick={() => sendMessage(s.prompt)}>{s.label}</button>
              ))}
            </div>
          )}
          <div className="ib">
            <textarea
              ref={inputRef}
              className="it"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEmpty ? "Describe what you want to build..." : "Ask a follow-up or request changes..."}
              rows={1}
              onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <button className="is" onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ opacity: input.trim() && !loading ? 1 : 0.25 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
          <p className="ifooter">Powered by Claude Opus 4.6 · Production-quality generation</p>
        </div>
      </div>

      {showPreview && previewCode && (
        <div className="right">
          <div className="ph">
            <div className="pt">
              <button className={viewMode === "preview" ? "ptb ptb-a" : "ptb"} onClick={() => setViewMode("preview")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </button>
              <button className={viewMode === "code" ? "ptb ptb-a" : "ptb"} onClick={() => setViewMode("code")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Code
              </button>
            </div>
            <div className="pa">
              <button className="pb" onClick={doCopy} title="Copy">
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </button>
              <button className="pb" onClick={doDownload} title="Download">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button className="pb" onClick={() => setShowPreview(false)} title="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div className="pbd">
            {viewMode === "preview" ? (
              <iframe ref={iframeRef} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" className="pif" title="preview" />
            ) : (
              <pre className="pco">{previewCode}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CodeCraft() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    store.getSession().then((s) => {
      if (s) setUser(s);
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div style={{ height: "100vh", width: "100vw", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{CSS}</style>
        <span className="a-spin" style={{ width: 24, height: 24, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {user ? <MainApp user={user} onLogout={() => setUser(null)} /> : <AuthPage onLogin={setUser} />}
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }
textarea:focus, button:focus, input:focus { outline: none; }

@keyframes dotP { 0%,80%,100% { opacity: 0.2; transform: scale(0.85); } 40% { opacity: 1; transform: scale(1); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideR { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes pulse { 0%,100% { border-color: rgba(59,130,246,0.15); } 50% { border-color: rgba(59,130,246,0.35); } }
@keyframes authUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }

.a-page { min-height: 100vh; width: 100vw; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${C.bg}; position: relative; overflow: hidden; font-family: inherit; }
.a-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 55% 55% at 50% 50%, black 20%, transparent 70%); }
.a-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%); pointer-events: none; }
.a-box { position: relative; z-index: 1; width: 100%; max-width: 370px; padding: 0 24px; animation: authUp 0.5s ease-out; }
.a-logo-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 30px; }
.a-logo-icon { width: 28px; height: 28px; border-radius: 7px; background: #fff; display: flex; align-items: center; justify-content: center; }
.a-logo-text { font-size: 15px; font-weight: 700; color: ${C.text}; letter-spacing: -0.02em; }
.a-badge { font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 3px; background: ${C.blue}; color: #fff; letter-spacing: 0.05em; }
.a-title { font-size: 23px; font-weight: 700; color: ${C.text}; text-align: center; letter-spacing: -0.03em; margin-bottom: 7px; }
.a-sub { font-size: 14px; color: ${C.text2}; text-align: center; margin-bottom: 26px; line-height: 1.5; }
.a-google { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid ${C.border}; background: ${C.surface}; color: ${C.text}; font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.15s; }
.a-google:hover { background: ${C.surfaceHover}; border-color: #333; }
.a-google:disabled { opacity: 0.5; cursor: default; }
.a-div { display: flex; align-items: center; gap: 14px; margin: 18px 0; }
.a-div-line { flex: 1; height: 1px; background: ${C.border}; }
.a-div-text { font-size: 12px; color: ${C.text3}; font-weight: 500; }
.a-form { display: flex; flex-direction: column; gap: 14px; }
.a-field { display: flex; flex-direction: column; gap: 5px; }
.a-field label { font-size: 13px; font-weight: 500; color: ${C.text2}; }
.a-field input { width: 100%; padding: 9px 12px; border-radius: 9px; border: 1px solid ${C.border}; background: ${C.surface}; color: ${C.text}; font-size: 14px; font-family: inherit; transition: border-color 0.15s; }
.a-field input::placeholder { color: ${C.text3}; }
.a-field input:focus { border-color: ${C.blue}; }
.a-err { font-size: 13px; color: ${C.red}; margin: 0; padding: 7px 10px; background: rgba(239,68,68,0.07); border-radius: 8px; border: 1px solid rgba(239,68,68,0.12); }
.a-submit { width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fff; color: #000; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; min-height: 40px; transition: all 0.15s; }
.a-submit:hover { background: #e5e5e5; }
.a-submit:disabled { opacity: 0.6; cursor: default; }
.a-spin { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.15); border-top-color: #000; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
.a-switch { text-align: center; margin-top: 20px; font-size: 13px; color: ${C.text2}; }
.a-switch button { background: none; border: none; color: ${C.blue}; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; padding: 0; }
.a-switch button:hover { text-decoration: underline; }
.a-legal { position: absolute; bottom: 22px; text-align: center; font-size: 11px; color: ${C.text3}; max-width: 340px; }

.mo-ov { position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; animation: fadeUp 0.2s ease-out; }
.mo-box { background: ${C.panel}; border: 1px solid ${C.border}; border-radius: 16px; padding: 28px; width: 380px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px; }
.mo-top { display: flex; align-items: center; gap: 12px; }
.mo-top h2 { font-size: 17px; font-weight: 600; color: ${C.text}; letter-spacing: -0.02em; }
.mo-desc { font-size: 13px; color: ${C.text2}; margin-top: -6px; }
.mo-email { font-size: 13px; color: ${C.text}; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 8px; padding: 8px 12px; font-family: ${C.mono}; }
.mo-btns { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
.mo-cancel { padding: 8px 16px; border-radius: 8px; border: 1px solid ${C.border}; background: transparent; color: ${C.text2}; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s; }
.mo-cancel:hover { background: ${C.surface}; color: ${C.text}; }
.mo-go { padding: 8px 20px; border-radius: 8px; border: none; background: #fff; color: #000; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 90px; transition: all 0.15s; }
.mo-go:hover { background: #e5e5e5; }
.mo-go:disabled { opacity: 0.6; cursor: default; }

.app { height: 100vh; width: 100vw; display: flex; background: ${C.bg}; color: ${C.text}; font-family: inherit; overflow: hidden; }
.left { display: flex; flex-direction: column; min-width: 360px; border-right: 1px solid ${C.border}; background: ${C.bg}; transition: flex 0.25s, max-width 0.25s; }
.hdr { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid ${C.border}; flex-shrink: 0; }
.hdr-l { display: flex; align-items: center; gap: 8px; }
.hdr-r { display: flex; align-items: center; gap: 8px; }
.hdr-logo { width: 26px; height: 26px; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; }
.hdr-n { font-size: 14px; font-weight: 600; color: ${C.text}; letter-spacing: -0.02em; }
.hdr-b { font-size: 9px; font-weight: 700; padding: 1.5px 5px; border-radius: 3px; background: ${C.blue}; color: #fff; letter-spacing: 0.05em; line-height: 1.4; }
.hdr-btn { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 7px; border: 1px solid ${C.border}; background: transparent; color: ${C.text2}; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s; }
.hdr-btn:hover { background: ${C.surface}; color: ${C.text}; border-color: #333; }

.hdr-uw { position: relative; }
.hdr-ua { cursor: pointer; }
.hdr-ua span { width: 28px; height: 28px; border-radius: 50%; background: ${C.surface}; border: 1px solid ${C.border}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: ${C.text2}; transition: all 0.15s; }
.hdr-ua:hover span { border-color: #444; color: ${C.text}; }
.hdr-dd { display: none; position: absolute; top: 36px; right: 0; background: ${C.panel}; border: 1px solid ${C.border}; border-radius: 10px; padding: 6px; min-width: 200px; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.hdr-uw:hover .hdr-dd { display: block; }
.hdr-di { padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
.hdr-di strong { font-size: 13px; font-weight: 600; color: ${C.text}; }
.hdr-di span { font-size: 11px; color: ${C.text3}; font-family: ${C.mono}; }
.hdr-ds { height: 1px; background: ${C.border}; margin: 4px 0; }
.hdr-do { width: 100%; padding: 7px 10px; border-radius: 6px; border: none; background: transparent; color: ${C.red}; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; text-align: left; transition: all 0.15s; }
.hdr-do:hover { background: rgba(239,68,68,0.08); }

.msgs { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.ml { padding: 16px 16px 10px; display: flex; flex-direction: column; gap: 16px; }
.empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 28px; text-align: center; animation: fadeUp 0.45s ease-out; }
.ht { font-size: 30px; font-weight: 700; line-height: 1.15; letter-spacing: -0.035em; color: ${C.text}; margin-bottom: 14px; }
.ht em { font-style: italic; color: ${C.text2}; font-weight: 500; }
.hg { background: linear-gradient(to right, #fff 20%, ${C.text2} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hs { font-size: 14px; color: ${C.text2}; line-height: 1.55; max-width: 380px; }

.m-u { display: flex; justify-content: flex-end; animation: fadeUp 0.2s ease-out; }
.m-ub { max-width: 82%; padding: 9px 14px; border-radius: 14px 14px 3px 14px; background: ${C.surface}; border: 1px solid ${C.border}; font-size: 13.5px; line-height: 1.55; color: ${C.text}; white-space: pre-wrap; }
.m-a { display: flex; gap: 10px; align-items: flex-start; animation: fadeUp 0.2s ease-out; }
.m-av { width: 26px; height: 26px; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.m-ab { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.m-t { font-size: 13.5px; line-height: 1.6; color: ${C.text}; white-space: pre-wrap; }
.m-tx { font-size: 13.5px; line-height: 1.6; color: ${C.text}; white-space: pre-wrap; }
.m-d { font-size: 13px; line-height: 1.55; color: ${C.text2}; white-space: pre-wrap; }
.cur { display: inline-block; width: 2px; height: 14px; background: ${C.blue}; margin-left: 2px; vertical-align: text-bottom; animation: blink 0.7s step-end infinite; }

.m-cb { border-radius: 10px; border: 1px solid ${C.border}; background: #0e0e0e; overflow: hidden; }
.m-cb-live { animation: pulse 2s ease-in-out infinite; }
.m-cbh { display: flex; align-items: center; justify-content: space-between; padding: 7px 12px; border-bottom: 1px solid ${C.border}; background: ${C.panel}; }
.m-cbl { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; color: ${C.text2}; font-family: ${C.mono}; }
.m-cbn { color: ${C.text3}; font-weight: 400; margin-left: 4px; }
.m-wr { color: ${C.blue}; font-size: 11px; font-weight: 500; font-family: 'Inter', sans-serif; margin-left: 6px; }
.m-cbc { font-size: 11px; color: ${C.text3}; font-family: ${C.mono}; }
.m-cbo { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: ${C.blue}; background: none; border: none; cursor: pointer; font-family: inherit; }
.m-cbo:hover { opacity: 0.8; }
.m-cbp { padding: 10px 12px; margin: 0; font-size: 11px; line-height: 1.5; font-family: ${C.mono}; color: #666; overflow-y: auto; overflow-x: hidden; max-height: 200px; white-space: pre-wrap; word-break: break-all; }
.m-cbs { color: ${C.text2}; }

.dots { display: flex; gap: 4px; padding: 4px 0; }
.dots span { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: ${C.text2}; animation: dotP 1.2s ease-in-out infinite; }
.dots span:nth-child(2) { animation-delay: 0.15s; }
.dots span:nth-child(3) { animation-delay: 0.3s; }

.ia { padding: 10px 16px 14px; border-top: 1px solid ${C.border}; flex-shrink: 0; }
.chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; justify-content: center; }
.chip { padding: 6px 13px; border-radius: 20px; border: 1px solid ${C.border}; background: transparent; color: ${C.text2}; font-size: 12.5px; font-weight: 450; font-family: inherit; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.chip:hover { background: ${C.surface}; color: ${C.text}; border-color: #333; }
.ib { display: flex; align-items: flex-end; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 12px; padding: 3px 3px 3px 14px; transition: border-color 0.15s; }
.ib:focus-within { border-color: #444; }
.it { flex: 1; border: none; background: transparent; resize: none; color: ${C.text}; font-size: 13.5px; font-family: inherit; padding: 9px 0; line-height: 1.5; max-height: 120px; overflow-y: auto; }
.it::placeholder { color: ${C.text3}; }
.is { width: 34px; height: 34px; border-radius: 9px; border: none; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; transition: all 0.15s; }
.is:hover { background: #e5e5e5; }
.is:disabled { cursor: default; }
.ifooter { text-align: center; font-size: 10.5px; color: ${C.text3}; margin-top: 9px; }

.right { flex: 1; display: flex; flex-direction: column; background: ${C.panel}; animation: slideR 0.25s ease-out; min-width: 0; }
.ph { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border-bottom: 1px solid ${C.border}; flex-shrink: 0; background: ${C.bg}; }
.pt { display: flex; gap: 1px; background: ${C.surface}; border-radius: 8px; padding: 2px; }
.ptb { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 6px; border: none; background: transparent; color: ${C.text2}; font-size: 12.5px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s; }
.ptb:hover { color: ${C.text}; }
.ptb-a { background: ${C.surfaceHover}; color: ${C.text}; }
.pa { display: flex; gap: 3px; }
.pb { width: 30px; height: 30px; border-radius: 7px; border: 1px solid ${C.border}; background: transparent; color: ${C.text2}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
.pb:hover { background: ${C.surface}; color: ${C.text}; border-color: #333; }
.pbd { flex: 1; overflow: hidden; position: relative; }
.pif { width: 100%; height: 100%; border: none; background: #fff; }
.pco { padding: 18px; margin: 0; font-size: 11.5px; line-height: 1.6; font-family: ${C.mono}; color: ${C.text2}; overflow: auto; height: 100%; background: ${C.bg}; white-space: pre-wrap; word-break: break-all; }
`;
