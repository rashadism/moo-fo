const INK = '#2b2140'
const EDGE = '#cfc6e8'
const LOOP = 120
const COW_SCALE = 0.95
const FEET = 38
const BEAM = 460
const RISE = 377

const HILL = [
  [
    [0, 800],
    [200, 720],
    [420, 720],
    [640, 790],
  ],
  [
    [640, 790],
    [820, 845],
    [980, 760],
    [1150, 755],
  ],
  [
    [1150, 755],
    [1320, 750],
    [1480, 790],
    [1600, 770],
  ],
]

const COWS = [
  { id: 'a', depth: 10, start: 150, faces: -1, moves: [[80, 88, -90, 150]], lift: [47, 150] },
  {
    id: 'b',
    depth: 26,
    start: 560,
    faces: 1,
    moves: [
      [20, 38, 560, -90],
      [72, 100, 1690, 560],
    ],
  },
  { id: 'c', depth: 14, start: 1040, faces: 1, moves: [[40, 56, 1690, 1040]], lift: [14, 1040] },
  {
    id: 'd',
    depth: 20,
    start: 1340,
    faces: 1,
    moves: [
      [60, 68, 1340, 1200],
      [108, 118, 1690, 1340],
    ],
    lift: [93, 1200],
  },
  {
    id: 'e',
    depth: 30,
    start: 800,
    faces: -1,
    moves: [
      [30, 40, 800, 700],
      [76, 84, 700, 800],
    ],
  },
]

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

const at = t => `${((t / LOOP) * 100).toFixed(2)}%`

const curve = (p, axis, u) =>
  (1 - u) ** 3 * p[0][axis] +
  3 * (1 - u) ** 2 * u * p[1][axis] +
  3 * (1 - u) * u ** 2 * p[2][axis] +
  u ** 3 * p[3][axis]

const hillY = x => {
  const clamped = Math.min(1600, Math.max(0, x))
  const part = HILL.find(p => clamped <= p[3][0])
  let low = 0
  let high = 1

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2

    if (curve(part, 0, mid) < clamped) {
      low = mid
    } else {
      high = mid
    }
  }

  return curve(part, 1, low)
}

const groundY = (cow, x) => Math.round(hillY(x) + cow.depth - FEET)

const track = cow => {
  const stops = [[0, cow.start, 1]]
  let x = cow.start
  let last = 0

  for (const [t0, t1, x0, x1] of cow.moves) {
    if (x0 !== x) {
      if (cow.lift && cow.lift[0] > last && cow.lift[0] < t0) {
        stops.push([cow.lift[0] + 5.8, x, 1], [cow.lift[0] + 6.2, x, 0])
      } else {
        stops.push([last + 0.1, x, 0])
      }
      stops.push([t0 - 0.1, x0, 0])
    }
    const steps = Math.max(1, Math.round(Math.abs(x1 - x0) / 90))

    for (let k = 0; k <= steps; k++) {
      stops.push([t0 + ((t1 - t0) * k) / steps, x0 + ((x1 - x0) * k) / steps, 1])
    }
    x = x1
    last = t1
  }
  stops.push([LOOP, x, 1])

  return stops
    .map(([t, px, o]) => `${at(t)}{transform:translate(${Math.round(px)}px,${groundY(cow, px)}px);opacity:${o}}`)
    .join('')
}

const sway = (t0, t1, step, degrees) => {
  const stops = [[t0, 0]]
  let sign = 1

  for (let t = t0 + step; t < t1 - step / 2; t += step) {
    stops.push([t, degrees * sign])
    sign = -sign
  }
  stops.push([t1, 0])

  return stops
}

const stride = cow => {
  const windows = cow.moves.map(([t0, t1]) => sway(t0, t1, 0.5, 12))

  if (cow.lift) {
    windows.push(sway(cow.lift[0] + 0.6, cow.lift[0] + 6, 0.3, 24))
  }

  return [[0, 0], ...windows.flat().sort((a, b) => a[0] - b[0]), [LOOP, 0]]
    .map(([t, degrees]) => `${at(t)}{transform:rotate(${degrees}deg)}`)
    .join('')
}

const facing = cow =>
  [[0, cow.faces], ...cow.moves.map(([t0, , x0, x1]) => [t0, x1 < x0 ? 1 : -1]), [LOOP, cow.faces]]
    .map(([t, side]) => `${at(t)}{transform:scaleX(${side})}`)
    .join('')

const lifting = ({ id, lift }) => {
  if (!lift) {
    return ''
  }
  const [t] = lift
  const from = `0%,${at(t + 0.6)}`
  const back = `${at(t + 6.4)},100%`

  return `
.l${id}{animation:l${id} ${LOOP}s ease-in infinite}
@keyframes l${id}{${from}{transform:translateY(0) scale(1)}${at(t + 6)}{transform:translateY(-${RISE}px) scale(.3)}${back}{transform:translateY(0) scale(1)}}
.r${id}{animation:r${id} ${LOOP}s linear infinite}
@keyframes r${id}{${from}{transform:rotate(0)}${at(t + 6)}{transform:rotate(-720deg)}${back}{transform:rotate(0)}}
.s${id}{animation:s${id} ${LOOP}s ease-in-out infinite}
@keyframes s${id}{0%,${at(t)}{transform:scale(1)}${at(t + 0.8)},${at(t + 6)}{transform:scale(1.5)}${back}{transform:scale(1)}}`
}

const cowStyle = cow => `
.p${cow.id}{animation:p${cow.id} ${LOOP}s linear infinite}
@keyframes p${cow.id}{${track(cow)}}
.f${cow.id}{animation:f${cow.id} ${LOOP}s step-end infinite}
@keyframes f${cow.id}{${facing(cow)}}
.k${cow.id}{animation:k${cow.id} ${LOOP}s linear infinite}
@keyframes k${cow.id}{${stride(cow)}}${lifting(cow)}`

const VISITS = COWS.filter(cow => cow.lift)
  .map(cow => ({ t: cow.lift[0], x: cow.lift[1], y: Math.round(hillY(cow.lift[1]) + cow.depth - BEAM) }))
  .sort((a, b) => a.t - b.t)
  .map((visit, i) => ({ ...visit, side: i % 2 === 0 ? -1 : 1 }))

const enter = v => `{transform:translate(${v.x + v.side * 700}px,-260px) rotate(${-v.side * 10}deg)}`
const hover = v => `{transform:translate(${v.x}px,${v.y}px) rotate(0deg)}`
const leave = v => `{transform:translate(${v.x - v.side * 700}px,-300px) rotate(${-v.side * 12}deg)}`

const FLIGHT = `0%${enter(VISITS[0])}${VISITS.map(
  v => `${at(v.t - 8)}${enter(v)}${at(v.t - 1.5)},${at(v.t + 7.5)}${hover(v)}${at(v.t + 11)}${leave(v)}`,
).join('')}100%${enter(VISITS[0])}`

const BEAMING = `0%{opacity:0}${VISITS.map(
  v => `${at(v.t - 0.3)}{opacity:0}${at(v.t + 0.3)},${at(v.t + 6.3)}{opacity:1}${at(v.t + 6.9)}{opacity:0}`,
).join('')}100%{opacity:0}`

const cowLeg = (id, x, fill, mirror) =>
  `<g transform="translate(${x},12)${mirror ? ' scale(-1,1)' : ''}"><g class="k${id}"><rect x="-5" width="10" height="28" rx="4.5" fill="${fill}"/><rect x="-5" y="21" width="10" height="7" rx="2.5" fill="${INK}"/></g></g>`

const cowEye = (id, x) =>
  `<g transform="translate(${x},-4)"><g class="s${id}"><circle r="5" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="-1" r="3" fill="${INK}"/><circle cx="-2" cy="-1.2" r="1" fill="#fff"/></g></g>`

const cow = ({ id, depth, start, faces }) => `
<g class="p${id}" transform="translate(${start},${groundY({ depth }, start)})"><g class="l${id}"><g class="r${id}"><g class="f${id}" transform="scale(${faces},1)"><g transform="scale(${COW_SCALE})">
<g transform="translate(42,-12)"><g class="tail"><path d="M0,0 q20,-4 18,22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><ellipse cx="18" cy="26" rx="4.5" ry="7" fill="${INK}"/></g></g>
${cowLeg(id, -22, '#dcd6ee', true)}${cowLeg(id, 22, '#dcd6ee', false)}
<ellipse cx="8" cy="24" rx="12" ry="7" fill="#ffb3d1"/><circle cx="4" cy="30" r="2" fill="#ff8fbc"/><circle cx="12" cy="30" r="2" fill="#ff8fbc"/>
${cowLeg(id, -32, '#fff', false)}${cowLeg(id, 32, '#fff', true)}
<rect x="-44" y="-26" width="88" height="50" rx="25" fill="#fff" stroke="${EDGE}" stroke-width="1.5"/>
<path d="M-8,-25 h22 q8,10 -2,19 q-14,6 -22,-4 q-4,-9 2,-15z" fill="${INK}"/>
<path d="M30,-2 q11,0 13,9 v5 q-11,8 -19,-1 q-2,-9 6,-13z" fill="${INK}"/>
<g transform="translate(-36,-10)"><g class="graze" style="animation-delay:-${depth}s"><g transform="translate(-12,-8)">
<path d="M-11,-15 q-7,-9 -1,-15 M9,-16 q7,-8 2,-15" fill="none" stroke="#f1dfae" stroke-width="5" stroke-linecap="round"/>
<g fill="#fff" stroke="${EDGE}" stroke-width="1.5"><ellipse cx="-21" cy="-8" rx="10" ry="5.5" transform="rotate(-22 -21 -8)"/><ellipse cx="20" cy="-11" rx="10" ry="5.5" transform="rotate(24 20 -11)"/></g>
<g fill="#ffc2dc"><ellipse cx="-21" cy="-8" rx="5.5" ry="2.6" transform="rotate(-22 -21 -8)"/><ellipse cx="20" cy="-11" rx="5.5" ry="2.6" transform="rotate(24 20 -11)"/></g>
<ellipse rx="20" ry="18" fill="#fff" stroke="${EDGE}" stroke-width="1.5"/>
<ellipse cx="8" cy="-5" rx="9" ry="10" fill="${INK}"/>
<path d="M-6,-17 q4,-9 8,-1 q4,-6 7,2z" fill="${INK}"/>
<ellipse cx="-5" cy="11" rx="16" ry="10" fill="#ffc2dc"/>
<ellipse cx="-10" cy="10" rx="2" ry="2.6" fill="${INK}"/><ellipse cy="10" rx="2" ry="2.6" fill="${INK}"/>
<path d="M-10,17 Q-5,20 0,17" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>
${cowEye(id, -9)}${cowEye(id, 7)}
<circle cx="6" cy="23" r="5.5" fill="#ffd23f" stroke="#c98a00" stroke-width="1.5"/><circle cx="6" cy="25.5" r="1.5" fill="#c98a00"/>
</g></g></g>
</g></g></g></g></g>`

const HERD = [...COWS]
  .sort((a, b) => a.depth - b.depth)
  .map(cow)
  .join('')

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
  `<g class="ring ${extra}"><ellipse rx="82" ry="9" fill="none" stroke="#eaffc9" stroke-width="3"/></g>`

const pilotEye = side =>
  `<ellipse cx="${side * 6}" cy="-1" rx="4" ry="5.5" transform="rotate(${side * -14} ${side * 6} -1)" fill="${INK}"/><circle cx="${side * 6 - 1}" cy="-3" r="1.3" fill="#fff"/>`

const STYLE = `
:root{--sky0:#0d0726;--sky1:#2a1060;--sky2:#7b1f73;--hill0:#24114d;--hill1:#170a36;--orb:#ffe7a3;--stars:1;--rays:0;--clouds:0}
@media (prefers-color-scheme:light){:root{--sky0:#7cc8ff;--sky1:#b9e4ff;--sky2:#ffd9ec;--hill0:#8fdc7f;--hill1:#5fc16b;--orb:#ffd23f;--stars:0;--rays:1;--clouds:.9}}
.tw{fill:#fff;animation:tw 3s ease-in-out infinite alternate}
.t1{animation-duration:2.2s;animation-delay:-1s}.t2{animation-duration:4.1s;animation-delay:-2s}.t3{animation-duration:5.3s;animation-delay:-.5s}
@keyframes tw{from{opacity:.2}to{opacity:1}}
.rays{animation:turn 40s linear infinite}
@keyframes turn{to{transform:rotate(360deg)}}
.wink{animation:wink 7s infinite}.blink{animation:wink 5s infinite -2s}
@keyframes wink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}
.orb,.hover{animation:bob 6s ease-in-out infinite alternate}.hover{animation-duration:3.2s}
@keyframes bob{from{transform:translateY(-6px) rotate(-3deg)}to{transform:translateY(6px) rotate(3deg)}}
.cloud{animation:drift 120s linear infinite}.c2{animation-duration:170s;animation-delay:-60s}.c3{animation-duration:210s;animation-delay:-140s}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
.shoot{opacity:0;animation:shoot 11s linear infinite}
@keyframes shoot{0%,80%{transform:translateX(-300px);opacity:0}83%{opacity:1}92%,100%{transform:translateX(700px);opacity:0}}
.ufo{animation:ufo ${LOOP}s ease-in-out infinite}
@keyframes ufo{${FLIGHT}}
.beam{opacity:0;animation:beam ${LOOP}s linear infinite}
@keyframes beam{${BEAMING}}
.ring{opacity:0;animation:ring 2.8s linear infinite}.r2{animation-delay:-.93s}.r3{animation-delay:-1.87s}
@keyframes ring{0%{transform:translateY(455px) scale(1);opacity:0}15%,85%{opacity:.6}100%{transform:translateY(52px) scale(.4);opacity:0}}
.lamp{fill:#ff4fa3;animation:lamp 3.2s steps(1) infinite}.l1{animation-delay:-.8s}.l2{animation-delay:-1.6s}.l3{animation-delay:-2.4s}
@keyframes lamp{0%{fill:#ff4fa3}25%{fill:#ffd23f}50%{fill:#3ddc84}75%{fill:#3fd0ff}}
.tail{animation:tail 2.2s ease-in-out infinite alternate}
@keyframes tail{from{transform:rotate(-10deg)}to{transform:rotate(14deg)}}
.graze{animation:graze 11s ease-in-out infinite}
@keyframes graze{0%,52%,90%,100%{transform:rotate(0)}60%,82%{transform:rotate(-24deg)}}
${COWS.map(cowStyle).join('')}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`

const DEFS = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky0)"/><stop offset=".6" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6ff8a" stop-opacity=".6"/><stop offset="1" stop-color="#b6ff8a" stop-opacity=".05"/></linearGradient>
<linearGradient id="core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6ffdf" stop-opacity=".55"/><stop offset="1" stop-color="#f6ffdf" stop-opacity="0"/></linearGradient>
<linearGradient id="trail" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
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

const UFO = `
<g class="ufo" transform="translate(-600,-260)"><g class="hover">
<g class="beam"><polygon points="-30,36 30,36 86,470 -86,470" fill="url(#ray)"/><polygon points="-14,36 14,36 40,470 -40,470" fill="url(#core)"/>${ring('')}${ring('r2')}${ring('r3')}</g>
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
</g></g>
`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>${SKY}${ORB}<path d="M0,760 C300,690 500,740 800,770 C1100,800 1350,700 1600,740 V900 H0Z" style="fill:var(--hill0)"/><path d="M0,800 C200,720 420,720 640,790 C820,845 980,760 1150,755 C1320,750 1480,790 1600,770 V900 H0Z" style="fill:var(--hill1)"/>${HERD}${UFO}</svg>`
