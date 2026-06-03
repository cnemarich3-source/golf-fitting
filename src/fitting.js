// ── HELPERS ──────────────────────────────────────────────────────────────────

export function parseHeightToInches(raw) {
  if (!raw || !raw.trim()) return null
  const s = raw.trim().toLowerCase().replace(/[""''`]/g,"'").replace(/\s+/g,'')
  const ftIn = s.match(/^(\d+)['''ft]+(\d+)/)
  if (ftIn) return parseInt(ftIn[1])*12 + parseInt(ftIn[2])
  const ftOnly = s.match(/^(\d+)['''ft]+$/)
  if (ftOnly) return parseInt(ftOnly[1])*12
  const cm = s.match(/^(\d+(?:\.\d+)?)cm$/)
  if (cm) return parseFloat(cm[1])/2.54
  const n = parseFloat(s)
  if (!isNaN(n) && n > 100) return n/2.54
  return null
}

export function fmtH(inches) {
  return Math.floor(inches/12)+"'"+Math.round(inches%12)+'"'
}

// ── SCORING ENGINE ────────────────────────────────────────────────────────────

function score(item, ss, spin, smash, hcp) {
  let pts = 0
  const r = item.ranges
  if (ss >= r.ssMin && ss <= r.ssMax) pts += 40
  else pts += Math.max(0, 40 - Math.abs(ss < r.ssMin ? r.ssMin-ss : ss-r.ssMax)*2)
  if (spin >= r.spinMin && spin <= r.spinMax) pts += 30
  else pts += Math.max(0, 30 - Math.abs(spin < r.spinMin ? r.spinMin-spin : spin-r.spinMax)*0.008)
  if (smash >= r.smashMin && smash <= r.smashMax) pts += 20
  else pts += Math.max(0, 20 - Math.abs(smash < r.smashMin ? r.smashMin-smash : smash-r.smashMax)*40)
  if (hcp !== null && r.hcpMin !== undefined) {
    if (hcp >= r.hcpMin && hcp <= r.hcpMax) pts += 10
    else pts += Math.max(0, 10 - Math.abs(hcp < r.hcpMin ? r.hcpMin-hcp : hcp-r.hcpMax)*0.5)
  }
  return pts
}

function topThree(pool, ss, spin, smash, hcp) {
  return pool
    .map(item => ({ item, pts: score(item, ss, spin, smash, hcp) }))
    .sort((a,b) => b.pts - a.pts)
    .slice(0,3)
    .map(x => x.item)
}

// ── PLACEHOLDER DATA ──────────────────────────────────────────────────────────
// This will be replaced with full shaft and clubhead data in a future update.

const PLACEHOLDER_SHAFTS = {
  driver: [
    { name:'Placeholder Shaft A', brand:'Brand TBD', flex:'R/S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft B', brand:'Brand TBD', flex:'S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft C', brand:'Brand TBD', flex:'X', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
  ],
  fairway: [
    { name:'Placeholder Shaft A', brand:'Brand TBD', flex:'R/S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft B', brand:'Brand TBD', flex:'S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
  ],
  hybrid: [
    { name:'Placeholder Shaft A', brand:'Brand TBD', flex:'R/S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft B', brand:'Brand TBD', flex:'S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
  ],
  iron: [
    { name:'Placeholder Shaft A', brand:'Brand TBD', flex:'R/S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft B', brand:'Brand TBD', flex:'S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
  ],
  wedge: [
    { name:'Placeholder Shaft A', brand:'Brand TBD', flex:'S', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
    { name:'Placeholder Shaft B', brand:'Brand TBD', flex:'S/X', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live shaft data will be loaded here in a future update.' },
  ],
}

const PLACEHOLDER_HEADS = {
  driver: [
    { name:'Placeholder Head A', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
    { name:'Placeholder Head B', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
  ],
  fairway: [
    { name:'Placeholder Head A', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
  ],
  hybrid: [
    { name:'Placeholder Head A', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
  ],
  iron: [
    { name:'Placeholder Head A', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
    { name:'Placeholder Head B', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
  ],
  wedge: [
    { name:'Placeholder Head A', brand:'Brand TBD', sub:'Data coming soon',
      ranges:{ssMin:0,ssMax:200,spinMin:0,spinMax:99999,smashMin:1.0,smashMax:2.0,hcpMin:-10,hcpMax:54},
      pills:[['Data pending','pill-amber']], reason:'Live clubhead data will be loaded here in a future update.' },
  ],
}

// ── EXPORTS ───────────────────────────────────────────────────────────────────

export function getShafts(ss, bs, spin, club, hcp) {
  const smash = ss > 0 ? parseFloat((bs/ss).toFixed(3)) : 1.44
  return topThree(PLACEHOLDER_SHAFTS[club] || [], ss, spin, smash, hcp)
}

export function getHeads(ss, bs, spin, club, hcp) {
  const smash = ss > 0 ? parseFloat((bs/ss).toFixed(3)) : 1.44
  return topThree(PLACEHOLDER_HEADS[club] || [], ss, spin, smash, hcp)
}

export function getLie(inches, club) {
  if (inches === null) return null
  const h = fmtH(inches)
  let base, offset, label
  if (club==='driver'||club==='fairway') {
    base=58
    offset=inches>=74?'+1°':inches>=67?'Standard':inches>=63?'−0.5°':'−1°'
    label=inches>=74?'upright':inches>=67?'standard':inches>=63?'slightly flat':'flat'
  } else if (club==='iron') {
    base=62
    offset=inches>=76?'+2°':inches>=72?'+1°':inches>=68?'Standard':inches>=64?'−1°':'−2°'
    label=inches>=76?'upright':inches>=72?'slightly upright':inches>=68?'standard':inches>=64?'slightly flat':'flat'
  } else if (club==='wedge') {
    base=64
    offset=inches>=72?'+1°':inches>=64?'Standard':'−1°'
    label=inches>=72?'upright':inches>=64?'standard':'flat'
  } else {
    base=59
    offset=inches>=72?'+1°':inches>=66?'Standard':'−1°'
    label=inches>=72?'upright':inches>=66?'standard':'flat'
  }
  const display = offset==='Standard'?`${base}° (Standard)`:`${base}° ${offset}`
  return { display, label, note:`At ${h}, a ${label} lie angle is recommended for your ${club}. Always validate with a lie board test during a professional fitting.` }
}
