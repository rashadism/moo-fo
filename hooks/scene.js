const INK = '#2b2140'

const random = (seed => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)(7)

const stars = Array.from({ length: 90 }, () => {
  const x = Math.round(random() * 1600)
  const y = Math.round(random() * 640)
  const r = (0.8 + random() * 1.6).toFixed(1)

  return `<circle class="tw t${Math.floor(random() * 4)}" cx="${x}" cy="${y}" r="${r}"/>`
}).join('')

const rays = Array.from(
  { length: 12 },
  (_, i) => `<rect x="-5" y="-106" width="10" height="28" rx="5" transform="rotate(${i * 30})"/>`,
).join('')

const cloud = (y, extra) =>
  `<g transform="translate(0,${y})"><g class="cloud ${extra}"><ellipse rx="70" ry="26"/><ellipse cx="-42" cy="10" rx="46" ry="20"/><ellipse cx="46" cy="12" rx="50" ry="20"/></g></g>`

const legs = [-30, -15, 10, 25]
  .map(
    x =>
      `<rect x="${x}" y="14" width="9" height="28" rx="4" fill="#fff"/><rect x="${x}" y="36" width="9" height="6" rx="2" fill="${INK}"/>`,
  )
  .join('')

const lamps = [-54, -27, 0, 27, 54]
  .map((x, i) => `<circle class="lamp l${i % 4}" cx="${x}" cy="${12 - Math.abs(x) / 14}" r="5"/>`)
  .join('')

const STYLE = `
:root{--sky0:#0d0726;--sky1:#2a1060;--sky2:#7b1f73;--hill0:#24114d;--hill1:#170a36;--orb:#ffe7a3;--alien:#3ddc84;--stars:1;--rays:0;--clouds:0}
@media (prefers-color-scheme:light){:root{--sky0:#7cc8ff;--sky1:#b9e4ff;--sky2:#ffd9ec;--hill0:#8fdc7f;--hill1:#5fc16b;--orb:#ffd23f;--alien:#a05cff;--stars:0;--rays:1;--clouds:.9}}
text{font-family:ui-rounded,'Arial Rounded MT Bold',system-ui,sans-serif;font-weight:800;fill:#fff;stroke:${INK};stroke-width:1.5;paint-order:stroke}
.tw{fill:#fff;animation:tw 3s ease-in-out infinite alternate}
.t1{animation-duration:2.2s;animation-delay:-1s}.t2{animation-duration:4.1s;animation-delay:-2s}.t3{animation-duration:5.3s;animation-delay:-.5s}
@keyframes tw{from{opacity:.2}to{opacity:1}}
.rays{animation:turn 40s linear infinite}
@keyframes turn{to{transform:rotate(360deg)}}
.wink{animation:wink 7s infinite}.blink{animation:wink 5s infinite -2s}
@keyframes wink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}
.orb,.hover{animation:bob 6s ease-in-out infinite alternate}.hover{animation-duration:2.4s}
@keyframes bob{from{transform:translateY(-6px) rotate(-3deg)}to{transform:translateY(6px) rotate(3deg)}}
.cloud{animation:drift 120s linear infinite}.c2{animation-duration:170s;animation-delay:-60s}.c3{animation-duration:210s;animation-delay:-140s}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
.shoot{opacity:0;animation:shoot 11s linear infinite}
@keyframes shoot{0%,80%{transform:translateX(-300px);opacity:0}83%{opacity:1}92%,100%{transform:translateX(700px);opacity:0}}
.ufo{transform:translate(0,250px);animation:ufo 30s ease-in-out infinite}
@keyframes ufo{0%{transform:translate(-1500px,90px)}18%,60%{transform:translate(0,250px)}64%{transform:translate(0,232px)}78%,100%{transform:translate(800px,-260px)}}
.beam{opacity:0;animation:beam 30s linear infinite}
@keyframes beam{0%,21%{opacity:0}23%{opacity:1}24%{opacity:.4}25%,55%{opacity:1}58%,100%{opacity:0}}
.lamp{fill:#ff4fa3;animation:lamp 1.2s steps(1) infinite}.l1{animation-delay:-.3s}.l2{animation-delay:-.6s}.l3{animation-delay:-.9s}
@keyframes lamp{0%{fill:#ff4fa3}25%{fill:#ffd23f}50%{fill:#3ddc84}75%{fill:#3fd0ff}}
.lift{animation:lift 30s linear infinite}
@keyframes lift{0%,27%{transform:translate(0,0) scale(1);opacity:1}54%{transform:translate(0,-440px) scale(.3);opacity:1}55%{transform:translate(0,-440px) scale(.3);opacity:0}84%{transform:translate(560px,10px) scale(1);opacity:0}86%{transform:translate(520px,8px) scale(1);opacity:1}100%{transform:translate(0,0) scale(1);opacity:1}}
.spin{animation:spin 30s linear infinite}
@keyframes spin{0%,27%{transform:rotate(0)}54%{transform:rotate(-720deg)}55%,100%{transform:rotate(0)}}
.trot{animation:trot .45s ease-in-out infinite alternate}
@keyframes trot{from{transform:translateY(0)}to{transform:translateY(-3px)}}
.tail{animation:tail 1.1s ease-in-out infinite alternate}
@keyframes tail{from{transform:rotate(-12deg)}to{transform:rotate(18deg)}}
.moo,.yay{opacity:0}
.moo{animation:moo 30s linear infinite}
@keyframes moo{0%,25%{opacity:0}27%,36%{opacity:1}38%,100%{opacity:0}}
.yay{animation:yay 30s linear infinite}
@keyframes yay{0%,56%{opacity:0;transform:scale(.4)}59%{opacity:1;transform:scale(1.25)}61%,68%{opacity:1;transform:scale(1)}71%,100%{opacity:0;transform:scale(1)}}
.peek{transform:translateY(95px);animation:peek 17s ease-in-out infinite}
@keyframes peek{0%,50%{transform:translateY(95px)}56%{transform:translateY(-6px)}58%,80%{transform:translateY(0)}86%,100%{transform:translateY(95px)}}
.wave{animation:wave .5s ease-in-out infinite alternate}
@keyframes wave{from{transform:rotate(-25deg)}to{transform:rotate(30deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`

const DEFS = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky0)"/><stop offset=".6" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6ff8a" stop-opacity=".75"/><stop offset="1" stop-color="#b6ff8a" stop-opacity=".08"/></linearGradient>
<linearGradient id="trail" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
`

const SKY = `
<rect width="1600" height="900" fill="url(#sky)"/>
<g style="opacity:var(--stars)">${stars}<g transform="translate(620,90) rotate(18)"><g class="shoot"><rect x="-140" y="-1.5" width="140" height="3" rx="1.5" fill="url(#trail)"/><circle r="4" fill="#fff"/></g></g></g>
<g style="opacity:var(--clouds)" fill="#fff">${cloud(150, '')}${cloud(300, 'c2')}${cloud(90, 'c3')}</g>
`

const ORB = `
<g transform="translate(330,190)"><g class="orb">
<g style="opacity:var(--rays);fill:var(--orb)"><g class="rays">${rays}</g></g>
<circle r="62" style="fill:var(--orb)"/>
<g fill="#000" opacity=".08"><circle cx="-28" cy="-32" r="9"/><circle cx="32" cy="30" r="11"/><circle cx="36" cy="-34" r="6"/></g>
<g transform="translate(-20,-8)"><ellipse class="blink" rx="6" ry="9" fill="${INK}"/></g>
<g transform="translate(20,-8)"><ellipse class="wink" rx="6" ry="9" fill="${INK}"/></g>
<path d="M-22,16 Q0,38 22,16" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
<g fill="#ff7aa8" opacity=".55"><circle cx="-38" cy="12" r="8"/><circle cx="38" cy="12" r="8"/></g>
</g></g>
`

const ALIEN = `
<g transform="translate(250,722)"><g class="peek">
<g style="stroke:var(--alien)" stroke-width="4" stroke-linecap="round"><line x1="-10" y1="-28" x2="-18" y2="-52"/><line x1="10" y1="-28" x2="18" y2="-52"/></g>
<circle cx="-18" cy="-54" r="5" fill="#ff4fa3"/><circle cx="18" cy="-54" r="5" fill="#ff4fa3"/>
<g transform="translate(32,2)"><g class="wave"><rect x="-4" y="-36" width="8" height="38" rx="4" style="fill:var(--alien)"/></g></g>
<ellipse rx="28" ry="34" style="fill:var(--alien)"/>
<ellipse cx="-10" cy="-8" rx="8" ry="10" fill="#fff"/><ellipse cx="10" cy="-8" rx="8" ry="10" fill="#fff"/>
<circle cx="-9" cy="-6" r="4" fill="${INK}"/><circle cx="11" cy="-6" r="4" fill="${INK}"/>
<path d="M-8,12 Q0,20 8,12" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
</g></g>
`

const COW = `
<g transform="translate(1150,715)"><g class="lift"><g class="spin"><g class="trot">
<g transform="translate(40,-8)"><path class="tail" d="M0,0 q18,-2 14,22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>
${legs}
<ellipse cx="4" cy="24" rx="10" ry="7" fill="#ff9ecb"/>
<ellipse rx="42" ry="26" fill="#fff"/>
<path d="M-12,-24 q14,-6 22,4 q2,14 -12,14 q-14,-2 -10,-18z" fill="${INK}"/>
<ellipse cx="22" cy="8" rx="10" ry="8" fill="${INK}"/>
<g transform="translate(-46,-16)">
<ellipse cx="-17" cy="-8" rx="8" ry="5" fill="#fff" transform="rotate(-25 -17 -8)"/><ellipse cx="15" cy="-10" rx="8" ry="5" fill="#fff" transform="rotate(25 15 -10)"/>
<ellipse rx="18" ry="16" fill="#fff"/>
<ellipse cx="-3" cy="9" rx="13" ry="8" fill="#ffc2dc"/>
<circle cx="-7" cy="9" r="1.8" fill="${INK}"/><circle cx="1" cy="9" r="1.8" fill="${INK}"/>
<circle cx="-8" cy="-4" r="3" fill="${INK}"/><circle cx="5" cy="-4" r="3" fill="${INK}"/>
</g>
</g></g></g></g>
<text class="moo" x="1085" y="662" font-size="34" text-anchor="end">moo?!</text>
`

const UFO = `
<g transform="translate(1150,0)"><g class="ufo"><g class="hover">
<polygon class="beam" points="-34,18 34,18 96,480 -96,480" fill="url(#ray)"/>
<ellipse cy="-12" rx="36" ry="30" fill="#9df3ff" opacity=".8"/>
<circle cy="-14" r="11" fill="#3ddc84"/><circle cx="-4" cy="-16" r="2.5" fill="${INK}"/><circle cx="4" cy="-16" r="2.5" fill="${INK}"/>
<ellipse cy="8" rx="82" ry="20" fill="#8f86c9"/>
<ellipse cy="3" rx="82" ry="15" fill="#d9d3f7"/>
${lamps}
<g transform="translate(0,-58)"><text class="yay" font-size="40" text-anchor="middle">yay!</text></g>
</g></g></g>
`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>${SKY}${ORB}<path d="M0,760 C300,690 500,740 800,770 C1100,800 1350,700 1600,740 V900 H0Z" style="fill:var(--hill0)"/>${ALIEN}<path d="M0,800 C200,720 420,720 640,790 C820,845 980,760 1150,755 C1320,750 1480,790 1600,770 V900 H0Z" style="fill:var(--hill1)"/>${COW}${UFO}</svg>`
