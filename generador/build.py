import json, pathlib
H = pathlib.Path(__file__).parent
INF = H.parent
import tempfile
OUT = pathlib.Path(tempfile.gettempdir()) / "infografia-build"  # salidas pesadas fuera del Drive
OUT.mkdir(exist_ok=True)
GF = "https://fonts.googleapis.com/css2?"

def dark(tok, sel_dark=True):
    """light tokens on :root are given by caller; this builds the two dark blocks."""
    return ("@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]){" + tok + "color-scheme:dark}}"
            ":root[data-theme=\"dark\"]{" + tok + "color-scheme:dark}")

def light_first_dark(tok):
    return ("@media (prefers-color-scheme:light){:root:not([data-theme=\"dark\"]){" + tok + "color-scheme:light}}"
            ":root[data-theme=\"light\"]{" + tok + "color-scheme:light}")

T = []

# 1 ÓRBITA — Claude al centro, todo gira a su alrededor
T.append(dict(f="1_orbita", t="Cómo trabajo hoy · Órbita", body="", cfg={"hero": "orbit"},
 fonts=GF+"family=Unbounded:wght@500;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
 css=":root{--bg:#070A1A;--fg:#EEF0FF;--mut:#9BA2C7;--surface:#10152D;--surface2:#0C1126;--line:#232B52;--ring:#3A4580;--acc:#FF8A4C;--acc-fg:#160B05;--ok:#3DDC97;--warn:#FFC24B;--info:#6AA8FF;--off:#7C83A8;--bad:#FF6B7A;--r:18px;--fd:'Unbounded',system-ui,sans-serif;--fb:'Manrope',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace;--shadow:0 4px 18px rgba(0,0,0,.35);--shadow-h:0 18px 44px rgba(0,0,0,.5);color-scheme:dark}"
 + light_first_dark("--bg:#F5F3FF;--fg:#15183A;--mut:#5D6290;--surface:#FFFFFF;--surface2:#EEEBFF;--line:#DCD8F5;--ring:#B9B2EE;--acc:#E8642A;--acc-fg:#fff;--shadow:0 4px 14px rgba(40,30,120,.08);--shadow-h:0 18px 40px rgba(40,30,120,.16);")
 + "body{background:radial-gradient(1200px 700px at 70% -10%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 60%),radial-gradient(900px 600px at -10% 30%,color-mix(in srgb,#6A5CFF 16%,transparent),transparent 60%),var(--bg);background-attachment:fixed}"
 ".ht{font-weight:800;letter-spacing:-.03em}.ht,.vh h2{font-size:clamp(30px,4.6vw,54px)}"
 ".hero{text-align:center;display:grid;justify-items:center}.lead{text-align:center}.stats{justify-content:center}"
 ".stat{background:color-mix(in srgb,var(--surface) 70%,transparent)}"
 ".tile{background:color-mix(in srgb,var(--surface) 82%,transparent)}.tile:hover{box-shadow:0 0 0 1px var(--cc),0 20px 50px -18px var(--cc)}"
 ".card:hover{box-shadow:0 0 0 1px var(--cc),0 20px 50px -20px var(--cc)}.mark{border-radius:50%}.nb.on{box-shadow:inset 3px 0 0 var(--acc)}"))

# 2 BENTO — mosaico de colores vivos
T.append(dict(f="2_bento", t="Cómo trabajo hoy · Bento", body="tabs", cfg={},
 fonts=GF+"family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
 css=":root{--bg:#EEECE7;--fg:#121212;--mut:#5C5A55;--surface:#FFFFFF;--surface2:#F6F5F1;--line:#DEDBD3;--acc:#FF4F1F;--acc-fg:#fff;--ok:#11A36A;--warn:#C98500;--info:#2F6BFF;--off:#8C8A85;--bad:#E5383B;--r:26px;--fd:'Space Grotesk',system-ui,sans-serif;--fb:'Inter',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace;--shadow:0 1px 3px rgba(0,0,0,.06);--shadow-h:0 18px 40px rgba(0,0,0,.14)}"
 + dark("--bg:#0E0E0F;--fg:#F4F3EF;--mut:#A3A19B;--surface:#1A1A1C;--surface2:#222225;--line:#2E2E31;--acc:#FF6A3D;--acc-fg:#120400;--shadow:0 1px 3px rgba(0,0,0,.4);--shadow-h:0 18px 40px rgba(0,0,0,.55);")
 + ".nb{border-radius:999px;background:var(--surface);border:1px solid var(--line)}.nb.on{background:var(--fg);color:var(--bg);box-shadow:none}.nb.on .ct{color:inherit;opacity:.7}"
 ".hero{background:var(--surface);border-radius:var(--r);padding:28px}"
 ".tiles{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(180px,auto)}"
 ".tile{background:var(--cc);color:#fff;border:0;padding:22px}.tile .td{color:rgba(255,255,255,.86)}.tile .tc,.tile .go{color:#fff}"
 ".tile.lt{color:#141414}.tile.lt .td{color:rgba(20,20,20,.75)}.tile.lt .tc,.tile.lt .go{color:#141414}"
 ".tile .lg{background:#fff}.tile .lg.dk{color:#111}.tile .lg.mono{background:rgba(255,255,255,.22);color:#fff}.tile.lt .lg.mono{background:rgba(0,0,0,.14);color:#141414}"
 ".tile .tc{font-size:40px;font-family:var(--fd);top:16px;right:20px;opacity:.9}"
 ".t-flujo{grid-column:span 2;grid-row:span 2;background:#141414}.t-flujo .tn{font-size:clamp(26px,3vw,40px)}.t-flujo .mini .lg{--s:52px}"
 ".t-marco{grid-column:span 2}.t-pro{grid-column:span 2}"
 ".card{border:0}.card .lg{--s:50px}.card{box-shadow:inset 0 5px 0 var(--cc)}"
 "@media (max-width:980px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}"
 "@media (max-width:540px){.tiles{grid-template-columns:minmax(0,1fr)}.t-flujo,.t-marco,.t-pro{grid-column:auto;grid-row:auto}}"))

# 3 AURORA — vidrio oscuro con auroras
T.append(dict(f="3_aurora", t="Cómo trabajo hoy · Aurora", body="", cfg={},
 fonts=GF+"family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
 css=":root{color-scheme:dark;--bg:#070912;--fg:#EEF1FA;--mut:#A0A8C2;--surface:rgba(255,255,255,.06);--surface2:rgba(255,255,255,.04);--sheet:#121628;--line:rgba(255,255,255,.13);--acc:#9B8CFF;--acc-fg:#0B0E1A;--ok:#4ADE9B;--warn:#F5B84B;--info:#5EB3FF;--off:#8088A0;--bad:#FF6B7A;--r:22px;--fd:'Sora',system-ui,sans-serif;--fb:'Manrope',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace;--shadow:0 8px 24px rgba(0,0,0,.3);--shadow-h:0 24px 60px rgba(0,0,0,.5)}"
 ".bgfx{display:block;position:fixed;inset:-10%;z-index:0;background:radial-gradient(40vw 40vw at 12% 8%,rgba(155,140,255,.42),transparent 62%),radial-gradient(42vw 42vw at 92% 18%,rgba(46,196,255,.30),transparent 62%),radial-gradient(50vw 46vw at 55% 105%,rgba(255,77,141,.26),transparent 62%);filter:blur(30px);animation:drift 26s ease-in-out infinite alternate}"
 "@keyframes drift{to{transform:translate(3%,-4%) scale(1.08)}}"
 ".tile,.card,.sb,.stat,.nb.on,.size,.princ li,.cycle li,.search input,.fb,.btn,.role{-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}"
 ".ht{background:linear-gradient(90deg,#fff 10%,#C3B9FF 50%,#7FD6FF 90%);-webkit-background-clip:text;background-clip:text;color:transparent}"
 ".lg{background:rgba(255,255,255,.93)}.lg.dk{color:#111;background:rgba(255,255,255,.93)}.lg.mono.dk{background:#EEF1FA;color:#111}"
 ".tile:hover,.card:hover{box-shadow:0 0 0 1px color-mix(in srgb,var(--cc) 70%,transparent),0 24px 60px -16px color-mix(in srgb,var(--cc) 60%,transparent)}"
 ".num{background:linear-gradient(135deg,#9B8CFF,#5EB3FF)}.mark{background:linear-gradient(135deg,#9B8CFF,#FF4D8D)}"
 ".btn.pri{background:linear-gradient(135deg,#9B8CFF,#5EB3FF);border:0}nav{background:transparent}"
 "@media (max-width:880px){nav{background:rgba(7,9,18,.8)}}"))

# 3b AURORA 2 — aurora mejorada: órbita en el hero, logos de vidrio, luz que sigue al mouse, bento con jerarquía
T.append(dict(f="3b_aurora2", t="Cómo trabajo hoy · Aurora 2", body="", cfg={"hero": "orbit", "split": True, "fx": True},
 fonts=GF+"family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
 css=":root{color-scheme:dark;--bg:#05060E;--fg:#F1F3FB;--mut:#A3AAC4;--surface:rgba(255,255,255,.055);--surface2:rgba(255,255,255,.035);--sheet:#10132A;--line:rgba(255,255,255,.11);--acc:#B4A2FF;--acc-fg:#0A0B18;--ok:#4ADE9B;--warn:#F5C04B;--info:#67C8FF;--off:#8A91A8;--bad:#FF6B7A;--r:24px;--fd:'Sora',system-ui,sans-serif;--fb:'Manrope',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace;--shadow:0 10px 30px -10px rgba(0,0,0,.6);--shadow-h:0 30px 70px -20px rgba(0,0,0,.7);--g1:#A78BFA;--g2:#38D5F8;--g3:#F472B6;--g4:#34E3A4}"
 "body{background:var(--bg)}"
 ".bgfx{display:block;position:fixed;inset:-15%;z-index:0;background:radial-gradient(38vw 34vw at 10% 6%,rgba(167,139,250,.45),transparent 62%),radial-gradient(40vw 36vw at 94% 12%,rgba(56,213,248,.32),transparent 62%),radial-gradient(46vw 40vw at 60% 104%,rgba(244,114,182,.30),transparent 62%),radial-gradient(30vw 28vw at 30% 70%,rgba(52,227,164,.16),transparent 62%);filter:blur(36px) saturate(1.15);animation:drift2 34s ease-in-out infinite alternate}"
 ".bgfx::after{content:'';position:absolute;inset:0;opacity:.09;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")}"
 "@keyframes drift2{50%{transform:translate(2%,-3%) rotate(4deg) scale(1.06)}to{transform:translate(-3%,2%) rotate(-3deg) scale(1.1)}}"
 ".tile,.card,.stat,.search input,.fb,.btn,.role,nav,.size,.princ li,.cycle li{-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3)}"
 ".mark{background:conic-gradient(from 200deg,var(--g1),var(--g2),var(--g4),var(--g3),var(--g1));color:#0A0B18;box-shadow:0 0 24px -4px var(--g1)}"
 "nav{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid var(--line);border-radius:var(--r);padding:10px}"
 ".nb.on{background:linear-gradient(90deg,color-mix(in srgb,var(--cc,var(--acc)) 26%,transparent),transparent);box-shadow:inset 3px 0 0 var(--cc,var(--acc))}.nb .dot{box-shadow:0 0 10px var(--cc,var(--acc))}"
 ".herow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:8px 28px}"
 "@media (max-width:1180px){.herow{grid-template-columns:minmax(0,1fr)}}"
 ".ht{font-size:clamp(40px,5vw,70px);line-height:1.02;letter-spacing:-.035em;background:linear-gradient(100deg,#fff 0%,#D9D0FF 30%,var(--g2) 55%,var(--g3) 80%,#fff 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sheen 9s ease-in-out infinite alternate}"
 "@keyframes sheen{to{background-position:100% 0}}"
 ".kick{color:var(--g2)}.lead{font-size:17px}"
 ".herow .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}.herow .stat{min-width:0}"
 "@media (max-width:540px){.herow .stats{grid-template-columns:repeat(2,minmax(0,1fr))}}"
 ".stat{position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.02))}"
 ".stat b{font-size:34px;background:linear-gradient(135deg,#fff,var(--g1) 60%,var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}"
 ".orbit{width:min(560px,100%)}.ring{border:1px solid rgba(255,255,255,.10);box-shadow:0 0 40px -10px rgba(167,139,250,.35) inset}"
 ".ring:nth-child(1){border-color:rgba(167,139,250,.35)}.ring:nth-child(2){border-color:rgba(56,213,248,.28)}.ring:nth-child(3){border-color:rgba(244,114,182,.24)}"
 ".core .lg{background:radial-gradient(circle at 35% 30%,#fff,#F3E9FF 60%,#D7C8FF);box-shadow:0 0 0 10px rgba(167,139,250,.14),0 0 0 22px rgba(56,213,248,.06),0 0 90px rgba(167,139,250,.7)}"
 ".lg{background:linear-gradient(145deg,color-mix(in srgb,var(--c) 34%,rgba(255,255,255,.10)),color-mix(in srgb,var(--c) 12%,rgba(255,255,255,.03)));color:color-mix(in srgb,var(--c) 62%,#fff);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 0 0 1px rgba(255,255,255,.08),0 6px 18px -6px color-mix(in srgb,var(--c) 70%,transparent)}"
 ".lg.dk{color:#fff;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.05))}"
 ".lg.mono{background:linear-gradient(145deg,color-mix(in srgb,var(--c) 90%,#fff),color-mix(in srgb,var(--c) 60%,#000));color:#fff}.lg.mono.dk{background:linear-gradient(145deg,#4A4F6A,#1C1F30);color:#fff}"
 ".tile,.card{overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.015));border-color:rgba(255,255,255,.09)}"
 ".tile::before,.card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(420px circle at var(--mx,50%) var(--my,-40%),color-mix(in srgb,var(--cc,var(--acc)) 24%,transparent),transparent 60%);opacity:0;transition:opacity .3s}"
 ".tile::after,.card::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;background:radial-gradient(280px circle at var(--mx,50%) var(--my,-40%),color-mix(in srgb,var(--cc,var(--acc)) 85%,#fff),transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s}"
 ".tile:hover::before,.card:hover::before,.tile:hover::after,.card:hover::after{opacity:1}"
 ".tile:hover,.card:hover{transform:translateY(-3px);box-shadow:0 30px 60px -24px color-mix(in srgb,var(--cc) 55%,transparent)}"
 ".tile>:not(.tc),.card>*{position:relative;z-index:1}.tc{z-index:1}"
 ".tc{padding:5px 9px;border-radius:999px;background:color-mix(in srgb,var(--cc) 22%,transparent);color:color-mix(in srgb,var(--cc) 55%,#fff);box-shadow:0 0 18px -4px var(--cc)}"
 ".tiles{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-flow:dense}"
 ".t-flujo{grid-column:span 2;grid-row:span 2;justify-content:flex-end;background:radial-gradient(120% 90% at 0% 0%,rgba(167,139,250,.28),transparent 60%),radial-gradient(100% 80% at 100% 100%,rgba(56,213,248,.2),transparent 60%),linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.02))}"
 ".t-flujo .tn{font-size:30px;letter-spacing:-.02em}.t-flujo .td{font-size:15px;max-width:38ch}.t-flujo .mini .lg{--s:54px}"
 ".t-marco,.t-pro,.t-ia{grid-column:span 2}"
 "@media (max-width:980px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}"
 "@media (max-width:540px){.tiles{grid-template-columns:minmax(0,1fr)}.t-flujo,.t-marco,.t-pro,.t-ia{grid-column:auto;grid-row:auto}}"
 ".btn.pri{background:linear-gradient(135deg,var(--g1),var(--g2));border:0;color:#0A0B18}.btn.art{color:#D9D0FF}"
 ".marq .lg{--s:38px}.sh-p{background:linear-gradient(170deg,#161A36,#0D1024);border:1px solid var(--line)}"
 "@media (max-width:880px){nav{background:rgba(7,9,18,.85)}}"
 "@media (prefers-reduced-motion:reduce){.bgfx,.ht{animation:none}}"
 ".bgnet{display:block;position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.85;-webkit-mask-image:radial-gradient(120% 90% at 50% 40%,rgba(0,0,0,.35) 10%,#000 70%);mask-image:radial-gradient(120% 90% at 50% 40%,rgba(0,0,0,.35) 10%,#000 70%)}.bgnet .ln path{stroke:rgba(180,162,255,.24);stroke-width:1;fill:none;stroke-dasharray:3 6;animation:bgdash 40s linear infinite}.bgnet .nd circle{opacity:.8}.bgnet .pu{fill:none;stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:bgpulse 6s ease-out infinite}.bgnet .pk{opacity:.95}.bgfx::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.09) 1px,transparent 1.2px);background-size:26px 26px;-webkit-mask-image:linear-gradient(180deg,#000,transparent 85%);mask-image:linear-gradient(180deg,#000,transparent 85%)}@keyframes bgdash{to{stroke-dashoffset:-180}}@keyframes bgpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(5);opacity:0}}@media (prefers-reduced-motion:reduce){.bgnet .ln path,.bgnet .pu{animation:none}.bgnet .pk{display:none}}"))

# 4 SESIÓN EN VIVO — estilo editor + chat con Claude
T.append(dict(f="4_sesion", t="Cómo trabajo hoy · Sesión", body="", cfg={"hero": "chat"},
 fonts=GF+"family=JetBrains+Mono:wght@400;500;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
 css=":root{--bg:#0D1117;--fg:#E6EDF3;--mut:#8B98A9;--surface:#161B22;--surface2:#1C2230;--line:#2A3240;--acc:#E8834A;--acc-fg:#120700;--ok:#3FB950;--warn:#D29922;--info:#58A6FF;--off:#6E7681;--bad:#F85149;--r:10px;--fd:'JetBrains Mono',ui-monospace,monospace;--fb:'IBM Plex Sans',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace;--shadow:0 1px 0 rgba(0,0,0,.4);--shadow-h:0 12px 30px rgba(0,0,0,.45);color-scheme:dark}"
 + light_first_dark("--bg:#F6F8FA;--fg:#1F2328;--mut:#59636E;--surface:#FFFFFF;--surface2:#F0F3F6;--line:#D1D9E0;--acc:#C8541B;--acc-fg:#fff;--shadow:0 1px 0 rgba(0,0,0,.04);--shadow-h:0 12px 30px rgba(0,0,0,.12);")
 + ".ht{font-weight:800;letter-spacing:-.04em}.ht::before{content:'> ';color:var(--acc)}"
 ".hero{display:grid;grid-template-columns:minmax(0,1fr)}"
 "nav{border:1px solid var(--line);border-radius:var(--r);background:var(--surface);padding:8px}"
 ".navg::before{content:'▾ '}.nb{border-radius:6px;font-size:13.5px}.nb .dot{border-radius:2px}.nb.on{background:color-mix(in srgb,var(--acc) 16%,var(--surface));box-shadow:inset 2px 0 0 var(--acc)}"
 ".tile,.card{border-radius:var(--r)}.tile{border-top:3px solid var(--cc)}.tn{font-size:16px}.tile.feat .tn{font-size:18px}"
 ".mark{border-radius:8px}.search input{border-radius:8px;font-family:var(--fm);font-size:13px}"
 ".vh h2{font-size:clamp(24px,3.4vw,36px)}.vh h2::before{content:'# ';color:var(--mut)}"
 "@media (max-width:880px){nav{border-radius:0;border-width:0 0 1px}}"))

# 5 APPS — tu teléfono: cada herramienta es una app
T.append(dict(f="5_apps", t="Cómo trabajo hoy · Apps", body="tabs apps-ui", cfg={"apps": True},
 fonts=GF+"family=Outfit:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap",
 css=":root{--bg:#EDE7F6;--w1:#FFE3D3;--w2:#E4E1FF;--w3:#D3F2EA;--fg:#1C1830;--mut:#5F5A78;--surface:rgba(255,255,255,.62);--surface2:rgba(255,255,255,.45);--sheet:#FFFFFF;--line:rgba(28,24,48,.10);--acc:#6B4EFF;--acc-fg:#fff;--ok:#1FA971;--warn:#E09A00;--info:#2F7BFF;--off:#8E89A6;--bad:#FF3B30;--r:26px;--fd:'Outfit',system-ui,sans-serif;--fb:'Outfit',system-ui,sans-serif;--fm:'DM Mono',ui-monospace,monospace;--shadow:0 6px 16px rgba(40,20,90,.14);--shadow-h:0 18px 40px rgba(40,20,90,.2)}"
 + dark("--bg:#120F22;--w1:#2A1446;--w2:#101C3D;--w3:#0B2B2B;--fg:#F2EFFF;--mut:#A9A3C7;--surface:rgba(30,26,52,.62);--surface2:rgba(30,26,52,.45);--sheet:#1D1934;--line:rgba(255,255,255,.12);--acc:#9C86FF;--acc-fg:#120F22;--shadow:0 6px 16px rgba(0,0,0,.4);--shadow-h:0 18px 40px rgba(0,0,0,.55);")
 + ".bgfx{display:block;position:fixed;inset:0;z-index:0;background:linear-gradient(160deg,var(--w1),var(--w2) 50%,var(--w3))}"
 "body::before{background:var(--w1)}"
 ".hero{text-align:center;display:grid;justify-items:center;padding-top:20px}.lead{text-align:center}.stats{justify-content:center}"
 ".stat,.nb,.search input,.card,.sb,.size,.princ li,.cycle li,.role,.fb,.btn{-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px)}"
 ".nb{border-radius:999px;background:var(--surface)}.nb.on{background:var(--fg);color:var(--bg)}.nb.on .ct{color:inherit;opacity:.7}"
 "body.tabs nav{background:transparent}"
 ".tiles{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:26px 12px}"
 ".tile{background:none;border:0;padding:0;align-items:center;text-align:center;gap:10px}.tile:hover{box-shadow:none;transform:none}"
 ".mini{display:grid;grid-template-columns:repeat(3,auto);place-content:center;gap:7px;width:136px;height:136px;margin:0;border-radius:32px;background:var(--surface);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:var(--shadow);transition:transform .18s}"
 ".tile:hover .mini{transform:scale(1.05)}.mini .lg{--s:32px;border-radius:9px}"
 ".tile .td{display:none}.tn,.tile.feat .tn{font-size:14.5px;font-weight:600}"
 ".tc{top:-6px;right:calc(50% - 76px);background:var(--bad);color:#fff;border-radius:999px;padding:4px 8px;font-size:12px;border:2px solid var(--bg)}"
 ".go{display:none}.t-flujo .mini,.t-marco .mini{background:var(--cc)}"
 ".lg.mono{border-radius:inherit}.appi .lg{background:#fff}.appi .lg.mono{background:var(--c)}.appi .lg.dk{color:#111}"
 "@media (max-width:640px){.sheet{place-items:end center;padding:0}.sh-p{border-radius:28px 28px 0 0;width:100%;padding-bottom:calc(24px + env(safe-area-inset-bottom,0px))}}"))

# 6 STICKERS — neo-brutalismo suave y juguetón
T.append(dict(f="6_stickers", t="Cómo trabajo hoy · Stickers", body="tabs", cfg={},
 fonts=GF+"family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Work+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap",
 css=":root{--bg:#FFF3DF;--fg:#1B1B1B;--mut:#5E574C;--surface:#FFFFFF;--surface2:#FFF9EE;--line:#1B1B1B;--ink:#1B1B1B;--acc:#FF5A36;--acc-fg:#fff;--sun:#FFD23F;--ok:#14915A;--warn:#B87400;--info:#2659D9;--off:#7A7266;--bad:#D7263D;--r:18px;--fd:'Bricolage Grotesque',system-ui,sans-serif;--fb:'Work Sans',system-ui,sans-serif;--fm:'Space Mono',ui-monospace,monospace;--shadow:4px 4px 0 var(--ink);--shadow-h:7px 7px 0 var(--ink)}"
 + dark("--bg:#1D1B18;--fg:#FFF3DF;--mut:#CFC5B4;--surface:#2A2723;--surface2:#24211E;--line:#FFF3DF;--ink:#FFF3DF;--acc:#FF7A57;--acc-fg:#1B1B1B;--sun:#E8B923;--ok:#4ADE9B;--warn:#F5B84B;--info:#7AA7FF;--off:#A39A8C;--bad:#FF6B7A;")
 + ".tile,.card,.stat,.sb,.size,.princ li,.cycle li,.btn,.fb,.nb,.search input,.sh-p,.role,.mark{border:2.5px solid var(--ink);box-shadow:var(--shadow)}"
 ".tile:hover,.card:hover{transform:translate(-3px,-3px);box-shadow:var(--shadow-h)}"
 ".tile{background:color-mix(in srgb,var(--cc) 26%,var(--surface))}.tile:nth-child(3n){rotate:-.6deg}.tile:nth-child(3n+1){rotate:.5deg}"
 ".nb{border-radius:12px;background:var(--surface)}.nb.on{background:var(--acc);color:var(--acc-fg)}.nb.on .ct{color:inherit}"
 ".kick{display:inline-block;background:var(--sun);color:#1B1B1B;padding:6px 10px;border:2px solid var(--ink);rotate:-2deg;border-radius:8px}"
 ".ht{font-weight:800}.lg{border:2px solid var(--ink)}.num{border:2.5px solid var(--ink);box-shadow:3px 3px 0 var(--ink)}"
 ".card{background:var(--surface)}.card .lg{--s:48px}.tc{background:var(--surface);border:2px solid var(--ink);border-radius:999px;padding:4px 8px;color:var(--fg)}"
 ".btn.pri{background:var(--acc);color:var(--acc-fg)}.chip{border:1.5px solid currentColor}"))

import os, re, shutil, datetime
TXT = {".md", ".ps1", ".py", ".js", ".json", ".txt", ".css", ".yml", ".yaml", ".sql", ".tmdl", ".cmd", ".bat", ".sh", ".log", ".csv", ".pbip", ".toml", ".ts", ".dax"}
PUB = {".html": "h", ".htm": "h", ".pdf": "p", ".mp4": "v", ".png": "i", ".jpg": "i", ".jpeg": "i", ".svg": "i", ".webp": "i"}
SECRETO = re.compile(r"(sk-[A-Za-z0-9_\-]{16,}|gsk_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_\-]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_\w{20,}|xox[abpr]-[\w-]{10,}|eyJ[\w-]{15,}\.[\w-]{10,}\.[\w-]{10,})")
CLAVE = re.compile(r"((?:api[_-]?key|apikey|token|secret|password|passwd|pwd|dsn|authorization)[\"']?\s*[:=]\s*[\"']?)([^\"'\s,}]{8,})", re.I)

def video_web(p, lim):
    """Copia liviana (720p/540p) del mp4 para verlo en la web; cacheada por ruta y fecha."""
    import hashlib, subprocess
    cdir = OUT / "vcache"; cdir.mkdir(exist_ok=True)
    k = hashlib.md5(("%s|%s" % (p, os.path.getmtime(p))).encode()).hexdigest()[:12]
    for alto, crf in ((720, 30), (540, 34), (360, 38)):
        out = cdir / ("%s_%d.mp4" % (k, alto))
        if not out.exists():
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", p, "-vf", "scale=-2:'min(%d,ih)'" % alto,
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf), "-c:a", "aac", "-b:a", "96k",
                            "-movflags", "+faststart", str(out)], check=False)
        if out.exists() and out.stat().st_size <= lim: return str(out)
    return None

def visor(data_txt):
    """Arma window.FILES (contenido para ver en la web) y el mapa de archivos a publicar."""
    base, home = (re.search(k + r':\s*"([^"]*)"', data_txt).group(1) for k in ("base", "home"))
    full = lambda r: r if re.match(r"^[A-Za-z]:/", r) else home + r[2:] if r.startswith("~/") else base + r
    refs = set(re.findall(r"(?:\"(?:r|ruta)\"|\b(?:r|ruta|carpeta))\s*:\s*\"([^\"]+)\"", data_txt))
    F, pub, tot = {}, {}, [0]
    pubdir = OUT / "pub"
    shutil.rmtree(pubdir, ignore_errors=True); pubdir.mkdir()

    def one(r, p, hijo):
        n = os.path.basename(p).lower(); e = os.path.splitext(n)[1]
        s = os.path.getsize(p); m = datetime.datetime.fromtimestamp(os.path.getmtime(p)).strftime("%Y-%m-%d %H:%M")
        if n.startswith(".env") or e in (".pem", ".key") or "credential" in n:
            return {"k": "o", "s": s, "m": m, "z": "Oculto: puede contener credenciales."}
        if e in TXT and s <= (60_000 if hijo else 150_000):
            b = open(p, "rb").read()
            for enc in (("utf-16",) if b[:2] in (b"\xff\xfe", b"\xfe\xff") else ()) + ("utf-8-sig", "cp1252"):
                try:
                    x = b.decode(enc); break
                except UnicodeError:
                    x = b.decode("utf-8", errors="replace")
            x = x.replace("�", "?")
            x = CLAVE.sub(lambda g: g.group(1) + "«oculto»", SECRETO.sub("«oculto»", x))
            if "settings" in n and n.endswith(".json"):
                x = re.sub(r"(\"[A-Z0-9_]*(?:KEY|TOKEN|SECRET)[A-Z0-9_]*\"\s*:\s*\")[^\"]+", r"\1«oculto»", x)
            return {"k": "t", "x": x}
        if e in (".html", ".htm") and not open(p, "rb").read(512).lstrip(b"\xef\xbb\xbf \t\r\n").startswith(b"<"):
            return {"k": "t", "x": open(p, encoding="utf-8", errors="ignore").read(60_000)}
        lim = 4_000_000 if hijo else 14_500_000
        if e == ".mp4" and s > lim:
            p2 = video_web(p, lim)
            if p2: p, s = p2, os.path.getsize(p2)
        if e in PUB and s <= lim and tot[0] + s < 60_000_000:
            name = "f/%03d%s" % (len(pub), e); shutil.copyfile(p, pubdir / ("%03d%s" % (len(pub), e)))
            pub[name] = str(pubdir / ("%03d%s" % (len(pub), e))); tot[0] += s
            return {"k": PUB[e], "u": name, "s": s, "m": m}
        return {"k": "o", "s": s, "m": m}

    def carpeta(r, p, nivel):
        try: ents = sorted(os.scandir(p), key=lambda d: (not d.is_dir(), d.name.lower()))
        except OSError: return {"k": "o", "s": 0, "m": ""}
        ents = [d for d in ents if not d.name.startswith((".", "~$")) and d.name not in ("node_modules", "__pycache__")][:150]
        lst = []
        for d in ents:
            cr = r.rstrip("/") + "/" + d.name
            lst.append([d.name, d.is_dir()])
            if cr in F: continue
            if d.is_dir():
                if nivel < 1: F[cr] = carpeta(cr, d.path, nivel + 1)
            else: F[cr] = one(cr, d.path, True)
        return {"k": "d", "l": lst}

    for r in sorted(refs):
        p = full(r)
        if os.path.isdir(p): F[r] = carpeta(r, p, 0)
        elif os.path.exists(p): F[r] = one(r, p, False)
    return F, pub

TPL = (H / "tpl.html").read_text(encoding="utf-8")
base = (H / "base.css").read_text(encoding="utf-8")
core = (H / "core.js").read_text(encoding="utf-8")
data = (INF / "data.js").read_text(encoding="utf-8")
import re as _re
_v = {k: _re.search(k + r':\s*"([^"]*)"', data).group(1) for k in ("autor", "rol")}
TPL = (TPL.replace("{{AUTOR}}", _v["autor"]).replace("{{ROL}}", _v["rol"])
       .replace("{{INI}}", "".join(w[0] for w in _v["autor"].split()[:2]).upper()))
auto = (INF / "auto.js").read_text(encoding="utf-8")
logos = (INF / "logos.js").read_text(encoding="utf-8")
(OUT / "themes").mkdir(exist_ok=True)
for t in T:
    (OUT / "themes" / (t["f"] + ".css")).write_text(t["css"], encoding="utf-8")
    html = (TPL.replace("{{TITLE}}", t["t"]).replace("{{FONTS}}", t["fonts"])
            .replace("{{CSS}}", base + "\n" + t["css"])
            .replace("{{SCRIPTS}}", "<script>window.CFG=" + json.dumps({**t["cfg"], "body": t["body"]}) + "</script>\n<script>" + logos + "</script>\n<script>" + data + "</script>\n<script>" + auto + "</script>\n<script>" + core + "</script>"))
    if t["f"] == "3b_aurora2":
        FILES, PUBM = visor(data + auto)
        from chats import chats_js
        CH = chats_js(data)
        (INF / "chats.js").write_text(CH, encoding="utf-8")
        html = html.replace("<script>" + core, "<script>window.FILES=" + json.dumps(FILES, ensure_ascii=False).replace("</", "<\\/") + "</script>\n<script>" + CH + "</script>\n<script>" + core, 1)
        (OUT / "pub.json").write_text(json.dumps(PUBM, ensure_ascii=False, indent=0), encoding="utf-8")
        print("visor:", len(FILES), "rutas,", len(PUBM), "archivos publicados", sum(os.path.getsize(v) for v in PUBM.values()) // 1048576, "MB")
    (OUT / (t["f"] + ".html")).write_text(html, encoding="utf-8")
    print(t["f"], len(html) // 1024, "KB")
    if t["f"] == "3b_aurora2":
        (INF / "app.js").write_text(core, encoding="utf-8")
        loc = (TPL.replace("{{TITLE}}", "Cómo trabajo hoy").replace("{{FONTS}}", t["fonts"])
               .replace("{{CSS}}", base + "\n" + t["css"])
               .replace("{{SCRIPTS}}", "<script>window.CFG=" + json.dumps({**t["cfg"], "body": t["body"]}) + "</script>\n<script src=\"logos.js\"></script>\n<script src=\"data.js\"></script>\n<script src=\"auto.js\"></script>\n<script src=\"chats.js\"></script>\n<script src=\"app.js\"></script>"))
        (INF / "index.html").write_text('<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' + loc, encoding="utf-8")
        print("index.html local listo")
