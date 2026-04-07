import { useState, useRef, useEffect, useCallback } from "react";

/* ═══ CSS ═══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;background:#09090b;color:#fafafa}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:4px}
textarea:focus,button:focus,input:focus{outline:none}
a{color:inherit;text-decoration:none}

@keyframes dotP{0%,80%,100%{opacity:.2;transform:scale(.85)}40%{opacity:1;transform:scale(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pulse{0%,100%{border-color:rgba(59,130,246,.15)}50%{border-color:rgba(59,130,246,.35)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.hp{min-height:100vh;background:#09090b;color:#fafafa;overflow-x:hidden;overflow-y:auto;height:100vh}
.hp-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 0;background:rgba(9,9,11,.85);backdrop-filter:blur(12px);border-bottom:1px solid #27272a}
.hp-nav-inner{max-width:1100px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between}
.hp-nav-logo{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700}
.hp-logo-icon{width:28px;height:28px;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center}
.hp-badge{font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;background:#3b82f6;color:#fff;letter-spacing:.05em}
.hp-nav-links{display:flex;gap:28px;font-size:14px;color:#a1a1aa;font-weight:500}
.hp-nav-links a{transition:color .15s;cursor:pointer}.hp-nav-links a:hover{color:#fafafa}
.hp-nav-cta{padding:8px 18px;border-radius:8px;border:none;background:#fff;color:#000;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .15s}.hp-nav-cta:hover{background:#e5e5e5}

.hp-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;position:relative;overflow:hidden}
.hp-hero-glow{position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:800px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%);pointer-events:none}
.hp-hero-content{position:relative;z-index:1;max-width:700px;animation:fadeUp .7s ease-out}
.hp-hero-pill{display:inline-block;padding:6px 16px;border-radius:20px;border:1px solid #27272a;background:rgba(59,130,246,.06);color:#a1a1aa;font-size:13px;font-weight:500;margin-bottom:28px}
.hp-hero-title{font-size:56px;font-weight:800;line-height:1.1;letter-spacing:-.04em;margin-bottom:20px}
.hp-hero-title em{font-style:italic;color:#a1a1aa;font-weight:500}
.hp-hero-grad{background:linear-gradient(135deg,#fff 0%,#a1a1aa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hp-hero-sub{font-size:18px;color:#a1a1aa;line-height:1.6;margin-bottom:36px;max-width:520px;margin-left:auto;margin-right:auto}
.hp-hero-btns{display:flex;gap:12px;justify-content:center;margin-bottom:48px;flex-wrap:wrap}
.hp-btn-primary{padding:12px 28px;border-radius:10px;border:none;background:#fff;color:#000;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .15s}.hp-btn-primary:hover{background:#e5e5e5;transform:translateY(-1px)}
.hp-btn-lg{padding:14px 36px;font-size:16px}
.hp-btn-secondary{padding:12px 28px;border-radius:10px;border:1px solid #27272a;background:transparent;color:#fafafa;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .15s}.hp-btn-secondary:hover{background:#18181b;border-color:#444}
.hp-hero-stats{display:flex;gap:0;justify-content:center;align-items:center}
.hp-stat{display:flex;flex-direction:column;align-items:center;padding:0 28px}
.hp-stat strong{font-size:22px;font-weight:700;color:#fafafa}
.hp-stat span{font-size:13px;color:#52525b;margin-top:2px}
.hp-stat-sep{width:1px;height:36px;background:#27272a}

.hp-section{padding:100px 24px;max-width:1100px;margin:0 auto}
.hp-section-dark{background:#111113;max-width:none;border-top:1px solid #27272a;border-bottom:1px solid #27272a}
.hp-section-title{font-size:36px;font-weight:700;text-align:center;letter-spacing:-.03em;margin-bottom:12px}
.hp-section-sub{font-size:16px;color:#a1a1aa;text-align:center;max-width:560px;margin:0 auto 48px;line-height:1.6}
.hp-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.hp-feature-card{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:28px;animation:cardIn .5s ease-out both;transition:all .2s}.hp-feature-card:hover{border-color:#444;transform:translateY(-2px)}
.hp-feature-icon{font-size:28px;margin-bottom:14px}
.hp-feature-card h3{font-size:16px;font-weight:600;margin-bottom:8px}
.hp-feature-card p{font-size:14px;color:#a1a1aa;line-height:1.55}

.hp-reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:0 auto;padding:0 24px}
.hp-review-card{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:24px;animation:cardIn .5s ease-out both;transition:all .2s}.hp-review-card:hover{border-color:#444}
.hp-review-text{font-size:14px;color:#fafafa;line-height:1.6;margin:12px 0 16px;font-style:italic}
.hp-review-author{display:flex;align-items:center;gap:10px}
.hp-review-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
.hp-review-author strong{font-size:13px;font-weight:600;display:block}
.hp-review-author span{font-size:12px;color:#52525b}

.hp-cta-section{text-align:center;padding:100px 24px;position:relative;overflow:hidden}
.hp-cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:600px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%);pointer-events:none}
.hp-cta-section h2{font-size:34px;font-weight:700;letter-spacing:-.03em;margin-bottom:12px;position:relative}
.hp-cta-section p{font-size:16px;color:#a1a1aa;margin-bottom:32px;position:relative}

.hp-footer{border-top:1px solid #27272a;padding:60px 24px 24px}
.hp-footer-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.hp-footer-brand p{font-size:13px;color:#52525b;line-height:1.6;margin-top:12px;max-width:280px}
.hp-footer-col h4{font-size:13px;font-weight:600;color:#fafafa;margin-bottom:14px;text-transform:uppercase;letter-spacing:.05em}
.hp-footer-col a{display:block;font-size:13px;color:#52525b;padding:4px 0;transition:color .15s;cursor:pointer}.hp-footer-col a:hover{color:#fafafa}
.hp-footer-bottom{max-width:1100px;margin:0 auto;padding-top:20px;border-top:1px solid #27272a;text-align:center;font-size:12px;color:#52525b}

@media(max-width:768px){.hp-hero-title{font-size:34px}.hp-features-grid,.hp-reviews-grid{grid-template-columns:1fr}.hp-footer-inner{grid-template-columns:1fr}.hp-nav-links{display:none}.hp-hero-stats{flex-direction:column;gap:12px}.hp-stat-sep{width:40px;height:1px}}

.a-page{min-height:100vh;width:100vw;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#09090b;position:relative;overflow:hidden}
.a-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 55% 55% at 50% 50%,black 20%,transparent 70%)}
.a-glow{position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%);pointer-events:none}
.a-box{position:relative;z-index:1;width:100%;max-width:370px;padding:0 24px;animation:fadeUp .5s ease-out}
.a-back{background:none;border:none;color:#a1a1aa;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;margin-bottom:24px;padding:0;transition:color .15s}.a-back:hover{color:#fafafa}
.a-logo-row{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:28px}
.a-logo-icon{width:28px;height:28px;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center}
.a-logo-text{font-size:15px;font-weight:700;color:#fafafa;letter-spacing:-.02em}
.a-badge{font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;background:#3b82f6;color:#fff;letter-spacing:.05em}
.a-title{font-size:23px;font-weight:700;color:#fafafa;text-align:center;letter-spacing:-.03em;margin-bottom:7px}
.a-sub{font-size:14px;color:#a1a1aa;text-align:center;margin-bottom:24px;line-height:1.5}
.a-google{width:100%;padding:10px;border-radius:10px;border:1px solid #27272a;background:#18181b;color:#fafafa;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .15s}.a-google:hover{background:#1f1f23;border-color:#333}.a-google:disabled{opacity:.5;cursor:default}
.a-div{display:flex;align-items:center;gap:14px;margin:18px 0}.a-div-line{flex:1;height:1px;background:#27272a}.a-div-text{font-size:12px;color:#52525b;font-weight:500}
.a-form{display:flex;flex-direction:column;gap:14px}.a-field{display:flex;flex-direction:column;gap:5px}.a-field label{font-size:13px;font-weight:500;color:#a1a1aa}
.a-field input{width:100%;padding:9px 12px;border-radius:9px;border:1px solid #27272a;background:#18181b;color:#fafafa;font-size:14px;font-family:inherit;transition:border-color .15s}.a-field input::placeholder{color:#52525b}.a-field input:focus{border-color:#3b82f6}
.a-err{font-size:13px;color:#ef4444;margin:0;padding:7px 10px;background:rgba(239,68,68,.07);border-radius:8px;border:1px solid rgba(239,68,68,.12)}
.a-submit{width:100%;padding:10px;border-radius:10px;border:none;background:#fff;color:#000;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:40px;transition:all .15s}.a-submit:hover{background:#e5e5e5}.a-submit:disabled{opacity:.6;cursor:default}
.a-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,.15);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
.a-switch{text-align:center;margin-top:20px;font-size:13px;color:#a1a1aa}.a-switch button{background:none;border:none;color:#3b82f6;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;padding:0}.a-switch button:hover{text-decoration:underline}
.mo-ov{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease-out}
.mo-box{background:#111113;border:1px solid #27272a;border-radius:16px;padding:28px;width:380px;max-width:90vw;display:flex;flex-direction:column;gap:16px}
.mo-top{display:flex;align-items:center;gap:12px}.mo-top h2{font-size:17px;font-weight:600;color:#fafafa}
.mo-desc{font-size:13px;color:#a1a1aa;margin-top:-6px}
.mo-email{font-size:13px;color:#fafafa;background:#18181b;border:1px solid #27272a;border-radius:8px;padding:8px 12px;font-family:'SF Mono','Fira Code',monospace}
.mo-btns{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
.mo-cancel{padding:8px 16px;border-radius:8px;border:1px solid #27272a;background:transparent;color:#a1a1aa;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer}.mo-cancel:hover{background:#18181b;color:#fafafa}
.mo-go{padding:8px 20px;border-radius:8px;border:none;background:#fff;color:#000;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;min-width:90px}.mo-go:hover{background:#e5e5e5}.mo-go:disabled{opacity:.6;cursor:default}

.app{height:100vh;width:100vw;display:flex;background:#09090b;color:#fafafa;font-family:inherit;overflow:hidden}
.left{display:flex;flex-direction:column;min-width:360px;border-right:1px solid #27272a;background:#09090b;transition:flex .25s,max-width .25s}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #27272a;flex-shrink:0}
.hdr-l{display:flex;align-items:center;gap:8px}.hdr-r{display:flex;align-items:center;gap:8px}
.hdr-logo{width:26px;height:26px;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center}
.hdr-n{font-size:14px;font-weight:600;color:#fafafa;letter-spacing:-.02em}
.hdr-b{font-size:9px;font-weight:700;padding:1.5px 5px;border-radius:3px;background:#3b82f6;color:#fff;letter-spacing:.05em}
.hdr-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;border:1px solid #27272a;background:transparent;color:#a1a1aa;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .15s}.hdr-btn:hover{background:#18181b;color:#fafafa;border-color:#333}
.hdr-uw{position:relative}.hdr-ua{cursor:pointer}
.hdr-ua span{width:28px;height:28px;border-radius:50%;background:#18181b;border:1px solid #27272a;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#a1a1aa}.hdr-ua:hover span{border-color:#444;color:#fafafa}
.hdr-dd{display:none;position:absolute;top:36px;right:0;background:#111113;border:1px solid #27272a;border-radius:10px;padding:6px;min-width:200px;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,.4)}.hdr-uw:hover .hdr-dd{display:block}
.hdr-di{padding:8px 10px;display:flex;flex-direction:column;gap:2px}.hdr-di strong{font-size:13px;font-weight:600;color:#fafafa}.hdr-di span{font-size:11px;color:#52525b;font-family:'SF Mono',monospace}
.hdr-ds{height:1px;background:#27272a;margin:4px 0}
.hdr-do{width:100%;padding:7px 10px;border-radius:6px;border:none;background:transparent;color:#ef4444;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;text-align:left}.hdr-do:hover{background:rgba(239,68,68,.08)}

.msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.ml{padding:16px 16px 10px;display:flex;flex-direction:column;gap:16px}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 28px;text-align:center;animation:fadeUp .45s ease-out}
.ht{font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-.035em;color:#fafafa;margin-bottom:14px}
.hg{background:linear-gradient(135deg,#fff 0%,#a1a1aa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hs{font-size:14px;color:#a1a1aa;line-height:1.55;max-width:380px}

.m-u{display:flex;justify-content:flex-end;animation:fadeUp .2s ease-out}
.m-ub{max-width:82%;padding:9px 14px;border-radius:14px 14px 3px 14px;background:#18181b;border:1px solid #27272a;font-size:13.5px;line-height:1.55;color:#fafafa;white-space:pre-wrap}
.m-a{display:flex;gap:10px;align-items:flex-start;animation:fadeUp .2s ease-out}
.m-av{width:26px;height:26px;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.m-ab{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.m-t{font-size:13.5px;line-height:1.6;color:#fafafa;white-space:pre-wrap}
.m-tx{font-size:13.5px;line-height:1.6;color:#fafafa;white-space:pre-wrap}
.m-d{font-size:13px;line-height:1.55;color:#a1a1aa;white-space:pre-wrap;padding:10px 14px;background:rgba(59,130,246,.04);border:1px solid rgba(59,130,246,.1);border-radius:10px;margin-top:2px}
.m-loading{display:flex;flex-direction:column;gap:6px}
.m-phase{font-size:12px;color:#52525b;font-style:italic}
.cur{display:inline-block;width:2px;height:14px;background:#3b82f6;margin-left:2px;vertical-align:text-bottom;animation:blink .7s step-end infinite}
.m-cb{border-radius:10px;border:1px solid #27272a;background:#0e0e10;overflow:hidden}
.m-cb-live{animation:pulse 2s ease-in-out infinite}
.m-cbh{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;border-bottom:1px solid #27272a;background:#111113}
.m-cbl{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:500;color:#a1a1aa;font-family:'SF Mono','Fira Code',monospace}
.m-cbn{color:#52525b;font-weight:400;margin-left:4px}
.m-wr{color:#3b82f6;font-size:11px;font-weight:500;font-family:'Inter',sans-serif;margin-left:6px}
.m-cbc{font-size:11px;color:#52525b;font-family:'SF Mono',monospace}
.m-cbo{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:#3b82f6;background:none;border:none;cursor:pointer;font-family:inherit}.m-cbo:hover{opacity:.8}
.m-cbp{padding:10px 12px;margin:0;font-size:11px;line-height:1.5;font-family:'SF Mono','Fira Code',monospace;color:#666;overflow-y:auto;overflow-x:hidden;max-height:200px;white-space:pre-wrap;word-break:break-all}
.m-cbs{color:#a1a1aa}
.dots{display:flex;gap:4px;padding:4px 0}.dots span{display:inline-block;width:5px;height:5px;border-radius:50%;background:#a1a1aa;animation:dotP 1.2s ease-in-out infinite}.dots span:nth-child(2){animation-delay:.15s}.dots span:nth-child(3){animation-delay:.3s}

.ia{padding:10px 16px 14px;border-top:1px solid #27272a;flex-shrink:0}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px;justify-content:center}
.chip{padding:6px 13px;border-radius:20px;border:1px solid #27272a;background:transparent;color:#a1a1aa;font-size:12.5px;font-weight:450;font-family:inherit;cursor:pointer;transition:all .15s;white-space:nowrap}.chip:hover{background:#18181b;color:#fafafa;border-color:#333}
.ib{display:flex;align-items:flex-end;background:#18181b;border:1px solid #27272a;border-radius:12px;padding:3px 3px 3px 14px;transition:border-color .15s}.ib:focus-within{border-color:#444}
.it{flex:1;border:none;background:transparent;resize:none;color:#fafafa;font-size:13.5px;font-family:inherit;padding:9px 0;line-height:1.5;max-height:120px;overflow-y:auto}.it::placeholder{color:#52525b}
.is{width:34px;height:34px;border-radius:9px;border:none;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:all .15s}.is:hover{background:#e5e5e5}.is:disabled{cursor:default}
.ifooter{text-align:center;font-size:10.5px;color:#52525b;margin-top:9px}

.right{flex:1;display:flex;flex-direction:column;background:#111113;animation:slideR .25s ease-out;min-width:0}
.ph{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;border-bottom:1px solid #27272a;flex-shrink:0;background:#09090b}
.pt{display:flex;gap:1px;background:#18181b;border-radius:8px;padding:2px}
.ptb{display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;border:none;background:transparent;color:#a1a1aa;font-size:12.5px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .15s}.ptb:hover{color:#fafafa}.ptb-a{background:#1f1f23;color:#fafafa}
.pa{display:flex;gap:3px}
.pb{width:30px;height:30px;border-radius:7px;border:1px solid #27272a;background:transparent;color:#a1a1aa;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}.pb:hover{background:#18181b;color:#fafafa;border-color:#333}
.pbd{flex:1;overflow:hidden;position:relative}
.pif{width:100%;height:100%;border:none;background:#fff}
.pco{padding:18px;margin:0;font-size:11.5px;line-height:1.6;font-family:'SF Mono','Fira Code',monospace;color:#a1a1aa;overflow:auto;height:100%;background:#09090b;white-space:pre-wrap;word-break:break-all}
`;

/* ═══ SYSTEM PROMPT ═══ */
const SYS = `You are CodeCraft AI — an elite frontend developer and designer. You build production-quality websites worth $50,000+.

DESIGN LIKE: Apple.com, Stripe.com, Linear.app, Vercel.com, Chick-fil-A.com

MANDATORY FOR EVERY BUILD:
1. HERO: Full-viewport, 60-100px headings, cinematic background with overlay, compelling CTA
2. TYPOGRAPHY: Import 2 Google Fonts via <link>. Display + body font. Large sizes, tight letter-spacing
3. COLORS: Max 3-4 colors. 1 base + 1 accent + 1 secondary
4. WHITESPACE: 80-120px section padding. Max-width 1200px
5. IMAGES: MANDATORY — use https://picsum.photos/seed/KEYWORD/W/H with UNIQUE seeds. Every card/hero/gallery MUST have <img>. NEVER skip images
6. ANIMATIONS: IntersectionObserver scroll reveals. Staggered entrances. Smooth hover transitions
7. INTERACTIVITY: ALL buttons work. Sticky nav. Working hamburger menu. Tabs. Forms validate. Accordions
8. RESPONSIVE: @media at 768px
9. FOOTER: Multi-column links, SVG social icons

VAGUE PROMPTS: Expand to 8+ section site. NEVER bare-bones.
USER URLs: Recreate similar layout/style. USER IMAGE URLs: Use exact URLs in <img>.

RESPONSE FORMAT:
**THINKING:** (design vision, hex colors, fonts, sections)
**CODE_START**
<!DOCTYPE html>
<html lang="en">...complete site...</html>
**CODE_END**
**DONE:** Summary + 2 enhancement suggestions.

RULES: One HTML file. All CSS in <style>, JS in <script>. Every button works. Real images. DONE always included.`;

/* ═══ DATA ═══ */
const SUGGESTIONS=[
  {label:"Restaurant Website",prompt:"Build a premium restaurant website for 'Bellissimo Ristorante'. Sticky nav, full-screen hero with food image background (picsum.photos/seed/italianfood/1600/900), about section with chef photo, tabbed menu (4 categories) with real Italian dishes + prices + food images on every card, photo gallery grid (6 images), testimonials, reservation form with validation, footer. Colors: burgundy #722F37, cream #FFF8F0, dark #1a1a1a. Fonts: Playfair Display + DM Sans."},
  {label:"SaaS Dashboard",prompt:"Build an analytics dashboard for 'MetricFlow'. Dark sidebar with nav icons, top bar with search, 4 KPI cards with trend arrows, SVG area chart, bar chart, sortable data table with status badges, activity timeline. Dark: bg #0f0f13, accent #6366f1. Font: Inter."},
  {label:"Portfolio Site",prompt:"Build a developer portfolio. Hero with animated gradient text + typing effect, about with profile photo, 6-project grid with hover overlays + images, skill bars, timeline, contact form, social icons footer. Dark: #0a0a0a, cyan #06b6d4. Fonts: Sora + DM Sans."},
  {label:"E-commerce Store",prompt:"Build a sneaker product page. Large product image + 4 thumbnails, color swatches, size grid, quantity counter, animated Add to Cart, tabbed content, 3 reviews with avatars, related products with images. Dark: #111, orange #FF6B35. Font: Plus Jakarta Sans."},
  {label:"Landing Page",prompt:"Build a SaaS landing page for 'WriteFlow AI'. Sticky nav, hero with floating UI mockups, trusted-by logos, 3-column features, How It Works steps, pricing toggle Monthly/Annual, testimonials with photos, FAQ accordion, newsletter signup, 4-column footer. Dark gradient, green #10b981. Fonts: Outfit + Manrope."},
  {label:"Fitness App",prompt:"Build a fitness dashboard. Greeting card, 4 stat cards with SVG progress rings, weekly bar chart, workout list, working timer Start/Pause/Reset, schedule cards, achievement badges, bottom tab nav. Dark: #0f0f14, orange #f97316. Font: DM Sans."},
];
const REVIEWS=[
  {name:"Sarah Chen",role:"Startup Founder",text:"I built our entire MVP landing page in under 10 minutes. The code quality is production-ready — my developers were shocked."},
  {name:"Marcus Johnson",role:"Freelance Designer",text:"CodeCraft replaced my entire prototyping workflow. I describe what I want and get a fully functional site."},
  {name:"Emily Rodriguez",role:"Product Manager",text:"We built internal dashboards that would have taken weeks. It understood exactly what we needed."},
  {name:"David Park",role:"Agency Owner",text:"The websites look like they came from a $50K agency. Working animations, responsive layouts, real images."},
  {name:"Priya Sharma",role:"E-commerce Director",text:"Built a complete product page with working cart and galleries in one prompt. Mind-blowing quality."},
  {name:"Alex Turner",role:"Software Engineer",text:"Clean HTML, CSS custom properties, proper JS patterns. This is not the usual AI slop. Genuinely impressed."},
];
const FEATURES=[
  {icon:"⚡",title:"Production-Ready Code",desc:"Clean HTML5, CSS3, and vanilla JS. No dependencies. Deploy anywhere instantly."},
  {icon:"🎨",title:"Premium Design",desc:"Typography, spacing, colors, and animations that match top design agencies."},
  {icon:"🖼️",title:"Real Images",desc:"Every site includes real images with proper aspect ratios and optimization."},
  {icon:"🔗",title:"Fully Interactive",desc:"Every button works. Tabs switch. Forms validate. No dead links anywhere."},
  {icon:"📱",title:"Responsive",desc:"Mobile-first design with proper breakpoints. Perfect on every screen."},
  {icon:"🚀",title:"Live Preview",desc:"Watch your website render in real-time as the AI writes the code."},
];

/* ═══ STORAGE (localStorage for real deployment) ═══ */
const store={
  getAccounts(){try{return JSON.parse(localStorage.getItem("cc_accounts")||"{}")}catch{return{}}},
  saveAccount(e,d){const a=this.getAccounts();a[e.toLowerCase()]=d;localStorage.setItem("cc_accounts",JSON.stringify(a))},
  getSession(){try{return JSON.parse(localStorage.getItem("cc_session"))}catch{return null}},
  setSession(u){localStorage.setItem("cc_session",JSON.stringify(u))},
  clearSession(){localStorage.removeItem("cc_session")}
};

/* ═══ SVGs ═══ */
const GoogleSVG=()=><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
const BoltSVG=({s=12})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#000"/></svg>;
const Stars=()=><span style={{color:"#facc15",fontSize:14,letterSpacing:2}}>★★★★★</span>;

/* ═══ HOMEPAGE ═══ */
function HomePage({onGetStarted}){
  return(
    <div className="hp">
      <nav className="hp-nav"><div className="hp-nav-inner">
        <div className="hp-nav-logo"><div className="hp-logo-icon"><BoltSVG s={14}/></div><span>CodeCraft</span><span className="hp-badge">AI</span></div>
        <div className="hp-nav-links"><a onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}>Features</a><a onClick={()=>document.getElementById("reviews")?.scrollIntoView({behavior:"smooth"})}>Reviews</a></div>
        <button className="hp-nav-cta" onClick={onGetStarted}>Get Started Free</button>
      </div></nav>
      <section className="hp-hero"><div className="hp-hero-glow"/><div className="hp-hero-content">
        <div className="hp-hero-pill">✨ The #1 AI Website Builder</div>
        <h1 className="hp-hero-title">Don't just <em>think</em> it,<br/><span className="hp-hero-grad">build it</span></h1>
        <p className="hp-hero-sub">Describe any website in plain English. Get production-ready code with live preview in minutes. No coding required.</p>
        <div className="hp-hero-btns"><button className="hp-btn-primary" onClick={onGetStarted}>Start Building Free →</button><button className="hp-btn-secondary" onClick={()=>document.getElementById("reviews")?.scrollIntoView({behavior:"smooth"})}>See Reviews</button></div>
        <div className="hp-hero-stats"><div className="hp-stat"><strong>10,000+</strong><span>Sites Built</span></div><div className="hp-stat-sep"/><div className="hp-stat"><strong>4.9/5</strong><span>User Rating</span></div><div className="hp-stat-sep"/><div className="hp-stat"><strong>{"<"}2 min</strong><span>Avg Build Time</span></div></div>
      </div></section>
      <section className="hp-section" id="features"><h2 className="hp-section-title">Everything You Need, Built In</h2><p className="hp-section-sub">Complete, production-ready websites — not templates or wireframes.</p>
        <div className="hp-features-grid">{FEATURES.map((f,i)=><div key={i} className="hp-feature-card" style={{animationDelay:i*.08+"s"}}><div className="hp-feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}</div>
      </section>
      <section className="hp-section hp-section-dark" id="reviews"><h2 className="hp-section-title">Loved by Builders Worldwide</h2><p className="hp-section-sub">Join thousands shipping ideas to production in minutes.</p>
        <div className="hp-reviews-grid">{REVIEWS.map((r,i)=><div key={i} className="hp-review-card" style={{animationDelay:i*.08+"s"}}><Stars/><p className="hp-review-text">"{r.text}"</p><div className="hp-review-author"><div className="hp-review-avatar">{r.name[0]}</div><div><strong>{r.name}</strong><span>{r.role}</span></div></div></div>)}</div>
      </section>
      <section className="hp-cta-section"><div className="hp-cta-glow"/><h2>Ready to build something amazing?</h2><p>Join thousands shipping production websites in minutes.</p><button className="hp-btn-primary hp-btn-lg" onClick={onGetStarted}>Get Started Free →</button></section>
      <footer className="hp-footer"><div className="hp-footer-inner"><div className="hp-footer-brand"><div className="hp-nav-logo"><div className="hp-logo-icon"><BoltSVG s={14}/></div><span>CodeCraft</span><span className="hp-badge">AI</span></div><p>The AI-powered platform for building production-ready websites in minutes.</p></div><div className="hp-footer-col"><h4>Product</h4><a>Features</a><a>Pricing</a><a>Templates</a><a>Changelog</a></div><div className="hp-footer-col"><h4>Resources</h4><a>Docs</a><a>Tutorials</a><a>Blog</a><a>Support</a></div><div className="hp-footer-col"><h4>Company</h4><a>About</a><a>Careers</a><a>Privacy</a><a>Terms</a></div></div><div className="hp-footer-bottom"><span>© 2026 CodeCraft AI. All rights reserved.</span></div></footer>
    </div>
  );
}

/* ═══ AUTH ═══ */
function AuthPage({onLogin,onBack}){
  const[mode,setMode]=useState("login");const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[name,setName]=useState("");
  const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const[gM,setGM]=useState(false);const[gE,setGE]=useState("");const[gS,setGS]=useState(1);const[gN,setGN]=useState("");
  const ve=e=>e.includes("@")&&e.includes(".");
  const doLogin=e=>{e.preventDefault();setErr("");if(!ve(email))return setErr("Enter a valid email");if(pw.length<6)return setErr("Password must be 6+ chars");setBusy(true);const a=store.getAccounts();const ac=a[email.toLowerCase()];if(!ac){setBusy(false);return setErr("No account found. Sign up first.");}if(ac.password!==pw){setBusy(false);return setErr("Incorrect password.");}const u={name:ac.name,email:email.toLowerCase()};store.setSession(u);onLogin(u);};
  const doSignup=e=>{e.preventDefault();setErr("");if(!name.trim())return setErr("Enter your name");if(!ve(email))return setErr("Enter a valid email");if(pw.length<6)return setErr("Password must be 6+ chars");setBusy(true);const a=store.getAccounts();if(a[email.toLowerCase()]){setBusy(false);return setErr("Account exists. Sign in.");}store.saveAccount(email,{name:name.trim(),password:pw,email:email.toLowerCase()});const u={name:name.trim(),email:email.toLowerCase()};store.setSession(u);onLogin(u);};
  const doG=()=>{setErr("");if(gS===1){if(!ve(gE))return setErr("Enter a valid Gmail");const a=store.getAccounts();const ex=a[gE.toLowerCase()];if(ex){const u={name:ex.name,email:gE.toLowerCase()};store.setSession(u);onLogin(u);}else setGS(2);}else{if(!gN.trim())return setErr("Enter your name");setBusy(true);store.saveAccount(gE,{name:gN.trim(),password:"google_oauth",email:gE.toLowerCase()});const u={name:gN.trim(),email:gE.toLowerCase()};store.setSession(u);onLogin(u);}};
  const cG=()=>{setGM(false);setGS(1);setGE("");setGN("");setErr("");};
  return(
    <div className="a-page"><div className="a-grid"/><div className="a-glow"/>
      {gM&&<div className="mo-ov" onClick={cG}><div className="mo-box" onClick={e=>e.stopPropagation()}><div className="mo-top"><GoogleSVG/><h2>Sign in with Google</h2></div>
        {gS===1?<><p className="mo-desc">Enter your Gmail to continue</p><div className="a-field"><label>Email</label><input type="email" placeholder="you@gmail.com" value={gE} onChange={e=>setGE(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter")doG()}}/></div></>:<><p className="mo-desc">Set up your profile</p><div className="mo-email">{gE}</div><div className="a-field"><label>Your Name</label><input type="text" placeholder="John Doe" value={gN} onChange={e=>setGN(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter")doG()}}/></div></>}
        {err&&gM&&<p className="a-err">{err}</p>}<div className="mo-btns"><button className="mo-cancel" onClick={cG}>Cancel</button><button className="mo-go" onClick={doG} disabled={busy}>{busy?<span className="a-spin"/>:gS===1?"Continue":"Create Account"}</button></div>
      </div></div>}
      <div className="a-box"><button className="a-back" onClick={onBack}>← Back</button>
        <div className="a-logo-row"><div className="a-logo-icon"><BoltSVG s={16}/></div><span className="a-logo-text">CodeCraft</span><span className="a-badge">AI</span></div>
        <h1 className="a-title">{mode==="login"?"Welcome back":"Create your account"}</h1><p className="a-sub">{mode==="login"?"Sign in to start building":"Start building apps in minutes"}</p>
        <button className="a-google" onClick={()=>{setGM(true);setErr("");}} disabled={busy}><GoogleSVG/> Continue with Google</button>
        <div className="a-div"><div className="a-div-line"/><span className="a-div-text">or</span><div className="a-div-line"/></div>
        <form onSubmit={mode==="login"?doLogin:doSignup} className="a-form">
          {mode==="signup"&&<div className="a-field"><label>Full Name</label><input type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}/></div>}
          <div className="a-field"><label>Email</label><input type="email" placeholder="you@gmail.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div className="a-field"><label>Password</label><input type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)}/></div>
          {err&&!gM&&<p className="a-err">{err}</p>}
          <button className="a-submit" type="submit" disabled={busy}>{busy?<span className="a-spin"/>:mode==="login"?"Sign In":"Create Account"}</button>
        </form>
        <p className="a-switch">{mode==="login"?"Don't have an account?":"Already have an account?"}{" "}<button onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("");setPw("");}}>{mode==="login"?"Sign up":"Sign in"}</button></p>
      </div>
    </div>
  );
}

/* ═══ MAIN CHAT APP ═══ */
function MainApp({user,onLogout}){
  const[messages,setMessages]=useState([]);const[input,setInput]=useState("");const[loading,setLoading]=useState(false);
  const[streaming,setStreaming]=useState(null);const[loadPhase,setLoadPhase]=useState("");
  const[previewCode,setPreviewCode]=useState(null);const[showPreview,setShowPreview]=useState(false);
  const[viewMode,setViewMode]=useState("preview");const[copied,setCopied]=useState(false);
  const scrollRef=useRef(null);const codeBoxRef=useRef(null);const inputRef=useRef(null);const iframeRef=useRef(null);const timerRef=useRef(null);
  const isEmpty=messages.length===0&&!loading;
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight},[messages,loading,streaming?.phase,loadPhase]);
  useEffect(()=>{if(codeBoxRef.current)codeBoxRef.current.scrollTop=codeBoxRef.current.scrollHeight},[streaming?.code]);
  useEffect(()=>{if(iframeRef.current&&previewCode&&viewMode==="preview"){const d=iframeRef.current.contentDocument;d.open();d.write(previewCode);d.close()}},[previewCode,viewMode,showPreview]);
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current)},[]);

  const parse=raw=>{let t="",c="",d="";const cs=raw.indexOf("**CODE_START**"),ce=raw.indexOf("**CODE_END**");if(cs!==-1){t=raw.slice(0,cs).replace(/\*\*THINKING:\*\*\s*/i,"").trim();if(ce!==-1){c=raw.slice(cs+14,ce).trim();d=raw.slice(ce+12).replace(/\*\*DONE:\*\*\s*/i,"").trim()}else c=raw.slice(cs+14).trim()}else{const hi=raw.indexOf("<!DOCTYPE"),lo=raw.indexOf("<!doctype"),s=hi!==-1?hi:lo;if(s!==-1){t=raw.slice(0,s).replace(/\*\*THINKING:\*\*\s*/i,"").trim();const e=raw.lastIndexOf("</html>");if(e!==-1){c=raw.slice(s,e+7);d=raw.slice(e+7).replace(/\*\*DONE:\*\*\s*/i,"").trim()}else c=raw.slice(s)}else t=raw.replace(/\*\*THINKING:\*\*\s*/i,"").replace(/\*\*DONE:\*\*\s*/i,"").trim()}return{thinking:t,code:c,done:d}};

  const send=useCallback(async text=>{const tr=(text||input).trim();if(!tr||loading)return;const um={role:"user",content:tr};const nx=[...messages,um];setMessages(nx);setInput("");setLoading(true);setStreaming(null);setLoadPhase("sending");if(inputRef.current)inputRef.current.style.height="auto";
    try{setLoadPhase("generating");const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:16000,system:SYS,messages:nx.map(m=>({role:m.role==="user"?"user":"assistant",content:m.content}))})});const data=await r.json();const full=data.content?.map(b=>b.text||"").join("")||"Something went wrong.";
      setLoadPhase("streaming");let i=0;await new Promise(res=>{timerRef.current=setInterval(()=>{i=Math.min(i+Math.floor(Math.random()*20)+8,full.length);const p=parse(full.slice(0,i));setStreaming({...p,phase:p.done?"done":p.code?"coding":"thinking"});if(i>=full.length){clearInterval(timerRef.current);timerRef.current=null;res()}},10)});
      const f=parse(full);let dm=f.done;if(!dm&&f.code)dm="Here's your website — "+f.code.split("\n").length+" lines of production code. Try asking me to change colors, add sections, or tweak the layout.";
      setMessages(prev=>[...prev,{role:"assistant",content:full,thinking:f.thinking,code:f.code,done:dm,hasCode:!!f.code}]);setStreaming(null);setLoadPhase("");
      if(f.code){setPreviewCode(f.code);setShowPreview(true);setViewMode("preview")}
    }catch{setMessages(prev=>[...prev,{role:"assistant",content:"Connection error — try again."}]);setStreaming(null);setLoadPhase("")}setLoading(false)},[input,loading,messages]);

  const kd=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}};
  const nc=()=>{setMessages([]);setPreviewCode(null);setShowPreview(false);setStreaming(null);setLoadPhase("")};
  const cp=()=>{if(previewCode){navigator.clipboard.writeText(previewCode);setCopied(true);setTimeout(()=>setCopied(false),1500)}};
  const dl=()=>{if(!previewCode)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([previewCode],{type:"text/html"}));a.download="app.html";a.click()};
  const lo=()=>{store.clearSession();onLogout()};
  const pl=loadPhase==="sending"?"Sending...":loadPhase==="generating"?"AI is thinking — 30-60s for complex sites...":"";

  const rmsg=(msg,i)=>{
    if(msg.role==="user")return<div key={i} className="m-u"><div className="m-ub">{msg.content}</div></div>;
    return<div key={i} className="m-a"><div className="m-av"><BoltSVG/></div><div className="m-ab">
      {msg.thinking&&<div className="m-t">{msg.thinking}</div>}
      {msg.hasCode&&msg.code&&<div className="m-cb"><div className="m-cbh"><span className="m-cbl"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>index.html<span className="m-cbn">{msg.code.split("\n").length} lines</span></span><button className="m-cbo" onClick={()=>{setPreviewCode(msg.code);setShowPreview(true);setViewMode("preview")}}>Open Preview <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button></div><pre className="m-cbp">{msg.code.slice(0,400)}{msg.code.length>400?"\n...":""}</pre></div>}
      {msg.done&&<div className="m-d">{msg.done}</div>}
      {!msg.hasCode&&!msg.thinking&&<div className="m-tx">{msg.content}</div>}
    </div></div>};

  return(
    <div className="app">
      <div className="left" style={{flex:showPreview?"0 0 440px":"1 1 auto",maxWidth:showPreview?440:"none"}}>
        <div className="hdr"><div className="hdr-l"><div className="hdr-logo"><BoltSVG s={14}/></div><span className="hdr-n">CodeCraft</span><span className="hdr-b">AI</span></div>
          <div className="hdr-r">{messages.length>0&&<button className="hdr-btn" onClick={nc}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New</button>}<div className="hdr-uw"><div className="hdr-ua"><span>{user.name?.[0]?.toUpperCase()||"U"}</span></div><div className="hdr-dd"><div className="hdr-di"><strong>{user.name}</strong><span>{user.email}</span></div><div className="hdr-ds"/><button className="hdr-do" onClick={lo}>Sign Out</button></div></div></div>
        </div>
        <div className="msgs" ref={scrollRef}>
          {isEmpty?<div className="empty"><h1 className="ht">What do you want<br/>to <span className="hg">build</span> today?</h1><p className="hs">Describe any website, paste a URL for inspiration, or include image links.</p></div>:
          <div className="ml">{messages.map(rmsg)}
            {loading&&<div className="m-a"><div className="m-av"><BoltSVG/></div><div className="m-ab">
              {!streaming?<div className="m-loading"><div className="dots"><span/><span/><span/></div>{pl&&<div className="m-phase">{pl}</div>}</div>:<>
                {streaming.thinking&&<div className="m-t">{streaming.thinking}{streaming.phase==="thinking"&&<span className="cur"/>}</div>}
                {streaming.phase==="coding"&&streaming.code&&<div className="m-cb m-cb-live"><div className="m-cbh"><span className="m-cbl"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>index.html<span className="m-wr">Writing...</span></span><div className="m-cbc">{streaming.code.split("\n").length} lines</div></div><pre className="m-cbp m-cbs" ref={codeBoxRef}>{streaming.code}<span className="cur"/></pre></div>}
                {streaming.phase==="done"&&streaming.done&&<div className="m-d">{streaming.done}<span className="cur"/></div>}
              </>}
            </div></div>}
          </div>}
        </div>
        <div className="ia">
          {isEmpty&&<div className="chips">{SUGGESTIONS.map((s,i)=><button key={i} className="chip" onClick={()=>send(s.prompt)}>{s.label}</button>)}</div>}
          <div className="ib"><textarea ref={inputRef} className="it" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={kd} placeholder={isEmpty?"Describe what you want to build...":"Ask for changes or describe something new..."} rows={1} onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"}}/><button className="is" onClick={()=>send()} disabled={loading||!input.trim()} style={{opacity:input.trim()&&!loading?1:.25}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button></div>
          <p className="ifooter">Powered by Claude Opus 4.6 · Production-quality generation</p>
        </div>
      </div>
      {showPreview&&previewCode&&<div className="right"><div className="ph"><div className="pt"><button className={viewMode==="preview"?"ptb ptb-a":"ptb"} onClick={()=>setViewMode("preview")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>Preview</button><button className={viewMode==="code"?"ptb ptb-a":"ptb"} onClick={()=>setViewMode("code")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>Code</button></div>
        <div className="pa"><button className="pb" onClick={cp}>{copied?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}</button><button className="pb" onClick={dl}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button><button className="pb" onClick={()=>setShowPreview(false)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
      </div><div className="pbd">{viewMode==="preview"?<iframe ref={iframeRef} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" className="pif" title="preview"/>:<pre className="pco">{previewCode}</pre>}</div></div>}
    </div>
  );
}

/* ═══ ROOT ═══ */
export default function App(){
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("home");

  useEffect(()=>{
    const s=store.getSession();
    if(s){setUser(s);setPage("app");}
  },[]);

  return(
    <>
      <style>{CSS}</style>
      {page==="home"&&<HomePage onGetStarted={()=>setPage("auth")}/>}
      {page==="auth"&&<AuthPage onLogin={u=>{setUser(u);setPage("app")}} onBack={()=>setPage("home")}/>}
      {page==="app"&&user&&<MainApp user={user} onLogout={()=>{setUser(null);setPage("home")}}/>}
    </>
  );
}
