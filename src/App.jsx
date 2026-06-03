import { useState } from 'react'
import { parseHeightToInches, getShafts, getHeads, getLie } from './fitting.js'

function Pill({ label, color }) {
  return <span className={`pill ${color}`}>{label}</span>
}

function RecCard({ item, index, showFlex }) {
  const isTop = index === 0
  return (
    <div className={`rec-card ${isTop ? 'top' : ''}`}>
      {isTop && <div className="top-flag">Best match</div>}
      <div className="card-brand">{item.brand}</div>
      <div className="card-name">{item.name}</div>
      <div className="card-sub">{item.sub}{showFlex && item.flex ? ` · Flex: ${item.flex}` : ''}</div>
      <div className="pills">
        {item.pills.map(([label, color], i) => <Pill key={i} label={label} color={color} />)}
      </div>
      <div className="card-reason">{item.reason}</div>
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState({ ss:'', bs:'', spin:'', height:'', handicap:'', clubType:'' })
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.id]: e.target.value }))
  }

  function analyze() {
    const ss = parseFloat(form.ss)
    const bs = parseFloat(form.bs)
    const spin = parseFloat(form.spin)
    const club = form.clubType
    if (!ss || !bs || !spin || !club) {
      setError('Please fill in swing speed, ball speed, spin rate, and club type.')
      return
    }
    setError('')
    const heightIn = parseHeightToInches(form.height)
    if (form.height.trim() && heightIn === null) {
      setError("Could not read height. Try: 5'9\" or 175cm")
      return
    }
    let hcp = null
    const hcpRaw = form.handicap.trim()
    if (hcpRaw !== '') {
      const isPlus = hcpRaw.startsWith('+')
      const parsed = parseFloat(hcpRaw.replace('+',''))
      if (!isNaN(parsed)) hcp = isPlus ? -parsed : parsed
    }
    const smash = (bs/ss).toFixed(2)
    const hcpLabel = hcp===null ? '—' : (hcp<0 ? '+'+Math.abs(hcp).toFixed(1) : hcp.toFixed(1))
    const hcpTier = hcp===null ? '' : hcp<0 ? 'plus handicap' : hcp===0 ? 'scratch' : hcp<=5 ? 'low amateur' : hcp<=12 ? 'mid-handicap' : hcp<=20 ? 'high amateur' : 'beginner'
    const smashLabel = parseFloat(smash)>=1.48 ? 'excellent' : parseFloat(smash)>=1.42 ? 'solid' : 'room to improve'
    let spinAlert = null
    if (spin > 3500) spinAlert = { danger:true, msg:`Spin of ${spin.toLocaleString()} rpm is high — prioritize a low-spin, stiff-tip shaft.` }
    else if (spin > 3000) spinAlert = { danger:false, msg:`Spin of ${spin.toLocaleString()} rpm is slightly elevated. A low-spin shaft profile can help bring this into the optimal 2,400–2,800 rpm window.` }
    else if (spin < 1800) spinAlert = { danger:false, msg:`Spin of ${spin.toLocaleString()} rpm is low — consider a higher-lofting head and mid-kick shaft.` }
    setResults({
      ss, bs, spin, smash, smashLabel, hcpLabel, hcpTier, spinAlert,
      shafts: getShafts(ss, bs, spin, club, hcp),
      heads: getHeads(ss, bs, spin, club, hcp),
      lie: getLie(heightIn, club),
    })
    setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior:'smooth', block:'start' }), 50)
  }

  return (
    <>
      <header className="header">
        <div className="logo"><span className="logo-dot" />SHAFTFIT</div>
        <div className="header-tag">Amateur Club Fitting</div>
      </header>

      <div className="hero">
        <div className="hero-eyebrow">Precision club fitting</div>
        <h1>FIND YOUR<br /><span>PERFECT</span> SHAFT</h1>
        <p>Enter your launch monitor numbers and we'll match you to the exact brand, make, and model shaft for your game.</p>
      </div>

      <main>
        <div className="form-card">
          <div className="form-section-title">Your swing stats</div>
          <div className="inputs-grid">
            <div className="field">
              <label htmlFor="ss">Swing Speed (mph)</label>
              <input id="ss" type="number" placeholder="e.g. 85" value={form.ss} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="bs">Ball Speed (mph)</label>
              <input id="bs" type="number" placeholder="e.g. 125" value={form.bs} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="spin">Spin Rate (rpm)</label>
              <input id="spin" type="number" placeholder="e.g. 2800" value={form.spin} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="height">Height</label>
              <input id="height" type="text" placeholder="5'9&quot; or 175cm" value={form.height} onChange={handleChange} />
              <span className="field-hint">5'9", 5ft9, or 175cm</span>
            </div>
            <div className="field">
              <label htmlFor="handicap">Handicap Index</label>
              <input id="handicap" type="text" placeholder="e.g. 14 or +2" value={form.handicap} onChange={handleChange} />
              <span className="field-hint">Use + prefix for plus handicap</span>
            </div>
            <div className="field">
              <label htmlFor="clubType">Club Type</label>
              <select id="clubType" value={form.clubType} onChange={handleChange}>
                <option value="">— select —</option>
                <option value="driver">Driver</option>
                <option value="fairway">Fairway Wood</option>
                <option value="hybrid">Hybrid</option>
                <option value="iron">Irons</option>
                <option value="wedge">Wedges</option>
              </select>
            </div>
          </div>
          {error && <p style={{color:'var(--red)',fontSize:'0.85rem',marginBottom:'1rem'}}>{error}</p>}
          <button className="submit-btn" onClick={analyze}>ANALYZE MY SWING →</button>
        </div>

        {results && (
          <div id="results-section">
            <div className="metrics-row fade-up">
              <div className="metric-tile">
                <div className="metric-label">Swing Speed</div>
                <div className="metric-value">{results.ss}</div>
                <div className="metric-unit">mph</div>
              </div>
              <div className="metric-tile">
                <div className="metric-label">Ball Speed</div>
                <div className="metric-value">{results.bs}</div>
                <div className="metric-unit">mph</div>
              </div>
              <div className="metric-tile">
                <div className="metric-label">Smash Factor</div>
                <div className="metric-value">{results.smash}</div>
                <div className="metric-unit">{results.smashLabel}</div>
              </div>
              <div className="metric-tile">
                <div className="metric-label">Handicap</div>
                <div className="metric-value">{results.hcpLabel}</div>
                <div className="metric-unit">{results.hcpTier}</div>
              </div>
            </div>

            {results.spinAlert && (
              <div className={`spin-alert ${results.spinAlert.danger ? 'danger' : ''}`}>
                <span style={{flexShrink:0}}>{results.spinAlert.danger ? '⚠' : '◆'}</span>
                <span>{results.spinAlert.msg}</span>
              </div>
            )}

            <div className="results-section fade-up-2">
              <div className="section-heading">Shaft Recommendations <span className="badge">Best match first</span></div>
              <div className="cards-grid">
                {results.shafts.map((s,i) => <RecCard key={i} item={s} index={i} showFlex={true} />)}
              </div>
            </div>

            <div className="results-section fade-up-3">
              <div className="section-heading">Clubhead Recommendations <span className="badge">Best match first</span></div>
              <div className="cards-grid">
                {results.heads.map((h,i) => <RecCard key={i} item={h} index={i} showFlex={false} />)}
              </div>
            </div>

            <div className="results-section fade-up-3">
              <div className="section-heading">Lie Angle</div>
              <div className="lie-card">
                {results.lie ? (
                  <>
                    <div className="lie-angle-display">{results.lie.display}</div>
                    <div className="lie-info">
                      <div className="lie-label">Recommended lie · {results.lie.label}</div>
                      <div className="lie-note">{results.lie.note}</div>
                    </div>
                  </>
                ) : (
                  <div className="lie-note" style={{color:'#aaa'}}>Enter your height above to receive a lie angle recommendation.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer>
        ShaftFit — Amateur Golf Club Fitting Tool — Always validate with a certified club fitter and lie board test.
      </footer>
    </>
  )
}
