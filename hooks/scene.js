const INK = '#2b2140'
const EDGE = '#cfc6e8'

const random = (seed => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)(7)

const stars = Array.from({ length: 90 }, () => {
  const x = Math.round(random() * 1600)
  const y = Math.round(random() * 640)
  const r = (0.8 + random() * 1.6).toFixed(1)

  return `<circle class="tw t${Math.floor(random() * 4)}" cx="${x}" cy="${y}" r="${r}"/>`
}).join('')

const rays = Array.from({ length: 24 }, (_, i) =>
  i % 2 === 0
    ? `<line y1="-84" y2="-120" stroke-width="5" transform="rotate(${i * 15})"/>`
    : `<line y1="-84" y2="-100" stroke-width="4" transform="rotate(${i * 15})"/>`,
).join('')

const dots = Array.from({ length: 12 }, (_, i) => `<circle cy="-134" r="2.8" transform="rotate(${i * 30})"/>`).join('')

const cloud = (y, extra) =>
  `<g transform="translate(0,${y})"><g class="cloud ${extra}"><ellipse rx="70" ry="26"/><ellipse cx="-42" cy="10" rx="46" ry="20"/><ellipse cx="46" cy="12" rx="50" ry="20"/></g></g>`

const swing = (from, step, count, degrees) =>
  Array.from(
    { length: count },
    (_, i) => `${(from + i * step).toFixed(2)}%{transform:rotate(${i % 2 === 0 ? degrees : -degrees}deg)}`,
  ).join('')

const kick = sign =>
  `0%,26.9%{transform:rotate(0)}${swing(27, 1.125, 25, 22 * sign)}54.5%,85.9%{transform:rotate(0)}${swing(86, 1.4, 10, 14 * sign)}100%{transform:rotate(0)}`

const leg = (x, cls, fill) =>
  `<g transform="translate(${x},12)"><g class="${cls}"><rect x="-5" width="10" height="28" rx="4.5" fill="${fill}"/><rect x="-5" y="21" width="10" height="7" rx="2.5" fill="${INK}"/></g></g>`

const cowEye = x =>
  `<g transform="translate(${x},-4)"><g class="shock"><circle r="5" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="-1" r="3" fill="${INK}"/><circle cx="-2" cy="-1.2" r="1" fill="#fff"/></g></g>`

const lamps = [
  [-64, 22],
  [-40, 28],
  [-14, 30],
  [14, 30],
  [40, 28],
  [64, 22],
]
  .map(
    ([x, y], i) =>
      `<circle class="lamp l${i % 4}" cx="${x}" cy="${y}" r="8" opacity=".3"/><circle class="lamp l${i % 4}" cx="${x}" cy="${y}" r="4.2"/>`,
  )
  .join('')

const ring = extra =>
  `<g class="ring ${extra}"><ellipse rx="74" ry="9" fill="none" stroke="#eaffc9" stroke-width="3"/></g>`

const pilotEye = side =>
  `<ellipse cx="${side * 6}" cy="-1" rx="4" ry="5.5" transform="rotate(${side * -14} ${side * 6} -1)" fill="${INK}"/><circle cx="${side * 6 - 1}" cy="-3" r="1.3" fill="#fff"/>`

const STYLE = `
:root{--sky0:#0d0726;--sky1:#2a1060;--sky2:#7b1f73;--hill0:#24114d;--hill1:#170a36;--orb:#f4e6b8;--orb-l:#fffbea;--orb-d:#d9c48a;--stars:1;--rays:0;--clouds:0}
@media (prefers-color-scheme:light){:root{--sky0:#7cc8ff;--sky1:#b9e4ff;--sky2:#ffd9ec;--hill0:#8fdc7f;--hill1:#5fc16b;--orb:#ffc75f;--orb-l:#fff4d1;--orb-d:#ff9671;--stars:0;--rays:1;--clouds:.9}}
text{font-family:ui-rounded,'Arial Rounded MT Bold',system-ui,sans-serif;font-weight:800;fill:#fff;stroke:${INK};stroke-width:1.5;paint-order:stroke}
.tw{fill:#fff;animation:tw 3s ease-in-out infinite alternate}
.t1{animation-duration:2.2s;animation-delay:-1s}.t2{animation-duration:4.1s;animation-delay:-2s}.t3{animation-duration:5.3s;animation-delay:-.5s}
@keyframes tw{from{opacity:.2}to{opacity:1}}
.rays{animation:turn 40s linear infinite}
@keyframes turn{to{transform:rotate(360deg)}}
.pulse{animation:pulse 2s ease-in-out infinite alternate}
@keyframes pulse{from{transform:scale(1)}to{transform:scale(1.07)}}
.halo{animation:halo 3.5s ease-in-out infinite alternate}
@keyframes halo{from{transform:scale(.9)}to{transform:scale(1.12)}}
.rays2{animation:turn 70s linear infinite reverse}
.orb,.hover{animation:bob 6s ease-in-out infinite alternate}.hover{animation-duration:2.4s}
@keyframes bob{from{transform:translateY(-6px) rotate(-3deg)}to{transform:translateY(6px) rotate(3deg)}}
.cloud{animation:drift 120s linear infinite}.c2{animation-duration:170s;animation-delay:-60s}.c3{animation-duration:210s;animation-delay:-140s}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
.shoot{opacity:0;animation:shoot 11s linear infinite}
@keyframes shoot{0%,80%{transform:translateX(-300px);opacity:0}83%{opacity:1}92%,100%{transform:translateX(700px);opacity:0}}
.ufo{transform:translate(0,250px) rotate(0);animation:ufo 30s ease-in-out infinite}
@keyframes ufo{0%{transform:translate(-1500px,90px) rotate(14deg)}16%{transform:translate(-40px,244px) rotate(8deg)}18%,60%{transform:translate(0,250px) rotate(0)}64%{transform:translate(0,232px) rotate(0)}78%,100%{transform:translate(800px,-300px) rotate(-18deg)}}
.beam{opacity:0;animation:beam 30s linear infinite}
@keyframes beam{0%,21%{opacity:0}23%{opacity:1}24%{opacity:.4}25%,55%{opacity:1}58%,100%{opacity:0}}
.ring{opacity:0;animation:ring 2.4s linear infinite}.r2{animation-delay:-.8s}.r3{animation-delay:-1.6s}
@keyframes ring{0%{transform:translateY(350px) scale(1);opacity:0}15%,85%{opacity:.75}100%{transform:translateY(52px) scale(.44);opacity:0}}
.lamp{fill:#ff4fa3;animation:lamp 1.2s steps(1) infinite}.l1{animation-delay:-.3s}.l2{animation-delay:-.6s}.l3{animation-delay:-.9s}
@keyframes lamp{0%{fill:#ff4fa3}25%{fill:#ffd23f}50%{fill:#3ddc84}75%{fill:#3fd0ff}}
.lift{animation:lift 30s linear infinite}
@keyframes lift{0%,27%{transform:translate(0,0) scale(1);opacity:1}54%{transform:translate(0,-430px) scale(.3);opacity:1}55%{transform:translate(0,-430px) scale(.3);opacity:0}84%{transform:translate(560px,10px) scale(1);opacity:0}86%{transform:translate(520px,8px) scale(1);opacity:1}100%{transform:translate(0,0) scale(1);opacity:1}}
.spin{animation:spin 30s linear infinite}
@keyframes spin{0%,27%{transform:rotate(0)}54%{transform:rotate(-720deg)}55%,100%{transform:rotate(0)}}
.trot{animation:trot .45s ease-in-out infinite alternate}
@keyframes trot{from{transform:translateY(0)}to{transform:translateY(-2px)}}
.ka{animation:ka 30s linear infinite}.kb{animation:kb 30s linear infinite}
@keyframes ka{${kick(1)}}
@keyframes kb{${kick(-1)}}
.shock{animation:shock 30s ease-in-out infinite}
@keyframes shock{0%,26%{transform:scale(1)}28%,54%{transform:scale(1.5)}56%,100%{transform:scale(1)}}
.tail{animation:tail 1.1s ease-in-out infinite alternate}
@keyframes tail{from{transform:rotate(-12deg)}to{transform:rotate(18deg)}}
.moo{opacity:0}
.moo{animation:moo 30s linear infinite}
@keyframes moo{0%,25%{opacity:0}27%,36%{opacity:1}38%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`

const DEFS = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky0)"/><stop offset=".6" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6ff8a" stop-opacity=".75"/><stop offset="1" stop-color="#b6ff8a" stop-opacity=".08"/></linearGradient>
<linearGradient id="core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6ffdf" stop-opacity=".7"/><stop offset="1" stop-color="#f6ffdf" stop-opacity="0"/></linearGradient>
<linearGradient id="trail" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<radialGradient id="orb" cx=".38" cy=".34" r=".78"><stop offset="0" style="stop-color:var(--orb-l)"/><stop offset=".55" style="stop-color:var(--orb)"/><stop offset="1" style="stop-color:var(--orb-d)"/></radialGradient>
<radialGradient id="halo"><stop offset=".5" style="stop-color:var(--orb-l)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--orb-l)" stop-opacity="0"/></radialGradient>
<linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d9d3f7"/><stop offset="1" stop-color="#a79fdb"/></linearGradient>
<linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f86c9"/><stop offset="1" stop-color="#4f477f"/></linearGradient>
<linearGradient id="dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2fcff" stop-opacity=".9"/><stop offset="1" stop-color="#7fdfff" stop-opacity=".5"/></linearGradient>
`

const SKY = `
<rect width="1600" height="900" fill="url(#sky)"/>
<g style="opacity:var(--stars)">${stars}<g transform="translate(620,90) rotate(18)"><g class="shoot"><rect x="-140" y="-1.5" width="140" height="3" rx="1.5" fill="url(#trail)"/><circle r="4" fill="#fff"/></g></g></g>
<g style="opacity:var(--clouds)" fill="#fff">${cloud(150, '')}${cloud(300, 'c2')}${cloud(90, 'c3')}</g>
`

const ORB = `
<g transform="translate(330,205) scale(1.25)"><g class="orb">
<g style="opacity:calc(.45 + var(--rays) * .55)"><circle class="halo" r="150" fill="url(#halo)"/></g>
<g style="opacity:var(--rays)"><g class="pulse">
<g class="rays" style="stroke:var(--orb)" stroke-linecap="round">${rays}</g>
<g class="rays2" style="fill:var(--orb-d)">${dots}</g>
</g></g>
<circle r="73" fill="none" style="stroke:var(--orb)" stroke-width="2" opacity=".5"/>
<circle r="62" fill="url(#orb)"/>
<ellipse cx="-22" cy="-30" rx="24" ry="13" transform="rotate(-32 -22 -30)" fill="#fff" opacity=".28"/>
<g fill="${INK}" style="opacity:calc(var(--stars) * .09)"><circle cx="-26" cy="-14" r="11"/><circle cx="24" cy="26" r="13"/><circle cx="30" cy="-28" r="7"/><circle cx="-18" cy="34" r="6"/><circle cx="2" cy="-40" r="4"/></g>
</g></g>
`

const COW = `
<g transform="translate(1150,706)"><g class="lift"><g class="spin"><g class="trot"><g transform="scale(1.25)">
<g transform="translate(42,-12)"><g class="tail"><path d="M0,0 q20,-4 18,22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><ellipse cx="18" cy="26" rx="4.5" ry="7" fill="${INK}"/></g></g>
${leg(-22, 'kb', '#dcd6ee')}${leg(22, 'ka', '#dcd6ee')}
<ellipse cx="8" cy="24" rx="12" ry="7" fill="#ffb3d1"/><circle cx="4" cy="30" r="2" fill="#ff8fbc"/><circle cx="12" cy="30" r="2" fill="#ff8fbc"/>
${leg(-32, 'ka', '#fff')}${leg(32, 'kb', '#fff')}
<rect x="-44" y="-26" width="88" height="50" rx="25" fill="#fff" stroke="${EDGE}" stroke-width="1.5"/>
<path d="M-8,-25 h22 q8,10 -2,19 q-14,6 -22,-4 q-4,-9 2,-15z" fill="${INK}"/>
<path d="M30,-2 q11,0 13,9 v5 q-11,8 -19,-1 q-2,-9 6,-13z" fill="${INK}"/>
<g transform="translate(-48,-18)">
<path d="M-11,-15 q-7,-9 -1,-15 M9,-16 q7,-8 2,-15" fill="none" stroke="#f1dfae" stroke-width="5" stroke-linecap="round"/>
<g fill="#fff" stroke="${EDGE}" stroke-width="1.5"><ellipse cx="-21" cy="-8" rx="10" ry="5.5" transform="rotate(-22 -21 -8)"/><ellipse cx="20" cy="-11" rx="10" ry="5.5" transform="rotate(24 20 -11)"/></g>
<g fill="#ffc2dc"><ellipse cx="-21" cy="-8" rx="5.5" ry="2.6" transform="rotate(-22 -21 -8)"/><ellipse cx="20" cy="-11" rx="5.5" ry="2.6" transform="rotate(24 20 -11)"/></g>
<ellipse rx="20" ry="18" fill="#fff" stroke="${EDGE}" stroke-width="1.5"/>
<ellipse cx="8" cy="-5" rx="9" ry="10" fill="${INK}"/>
<path d="M-6,-17 q4,-9 8,-1 q4,-6 7,2z" fill="${INK}"/>
<ellipse cx="-5" cy="11" rx="16" ry="10" fill="#ffc2dc"/>
<ellipse cx="-10" cy="10" rx="2" ry="2.6" fill="${INK}"/><ellipse cy="10" rx="2" ry="2.6" fill="${INK}"/>
<path d="M-10,17 Q-5,20 0,17" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>
${cowEye(-9)}${cowEye(7)}
<circle cx="6" cy="23" r="5.5" fill="#ffd23f" stroke="#c98a00" stroke-width="1.5"/><circle cx="6" cy="25.5" r="1.5" fill="#c98a00"/>
</g>
</g></g></g></g></g>
<text class="moo" x="1050" y="650" font-size="34" text-anchor="end">moo?!</text>
`

const UFO = `
<g transform="translate(1150,0)"><g class="ufo"><g class="hover">
<g transform="scale(1.3)">
<g class="beam"><polygon points="-30,36 30,36 78,365 -78,365" fill="url(#ray)"/><polygon points="-14,36 14,36 36,365 -36,365" fill="url(#core)"/>${ring('')}${ring('r2')}${ring('r3')}</g>
<ellipse cy="40" rx="26" ry="5" fill="#fff7a8"/>
<path d="M-88,6 C-74,50 74,50 88,6Z" fill="url(#bowl)"/>
${lamps}
<ellipse cy="5" rx="88" ry="17" fill="url(#hull)" stroke="#5d5599" stroke-opacity=".45" stroke-width="1.5"/>
<ellipse cy="1" rx="60" ry="8" fill="#fff" opacity=".35"/>
<ellipse cy="-5" rx="42" ry="8" fill="#6f67b0"/>
<g transform="translate(0,-22)"><ellipse rx="15" ry="14" fill="#3ddc84"/>${pilotEye(-1)}${pilotEye(1)}<path d="M-4,7 Q0,10 4,7" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/></g>
<path d="M-40,-5 C-40,-58 40,-58 40,-5Z" fill="url(#dome)" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/>
<path d="M-29,-22 C-26,-36 -16,-43 -6,-45" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>
<line y1="-45" y2="-60" stroke="#8f86c9" stroke-width="3"/><circle class="lamp l2" cy="-63" r="4.5"/>
</g>
</g></g></g>
`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>${SKY}${ORB}<path d="M0,760 C300,690 500,740 800,770 C1100,800 1350,700 1600,740 V900 H0Z" style="fill:var(--hill0)"/><path d="M0,800 C200,720 420,720 640,790 C820,845 980,760 1150,755 C1320,750 1480,790 1600,770 V900 H0Z" style="fill:var(--hill1)"/>${COW}${UFO}</svg>`
