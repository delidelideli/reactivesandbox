import { useState } from 'react'

const DEFAULTS = {
  '--accent-gold':        '#c9a227',
  '--accent-gold-light':  '#e8c84a',
  '--accent-blue':        '#4a7fb5',
  '--accent-blue-light':  '#6ba3d6',
  '--accent-purple':      '#8b44b8',
  '--accent-purple-light':'#c77dff',
  '--text-color':         '#ddc898',
  '--text-gold':          '#e8b422',
  '--text-purple':        '#c77dff',
  '--font-family':        "'IM Fell English', serif",
  '--panel-spacing':      '0.75rem',
  '--bg-primary':         '#04061a',
  '--bg-glow-color':      'rgba(40,55,180,0.3)',
  '--panel-glow':         'rgba(201,162,39,0.12)',
  '--grimoire-glow':      'rgba(74,127,181,0.12)',
}

const THEMES = {
  arcane: {
    label: 'Arcane Blue',
    swatch: ['#04061a', '#c9a227', '#4a7fb5', '#8b44b8'],
    vars: { ...DEFAULTS },
  },
  crimson: {
    label: 'Crimson Sanctum',
    swatch: ['#1a0306', '#cc3322', '#882211', '#661111'],
    vars: {
      '--accent-gold':        '#cc3322',
      '--accent-gold-light':  '#ee5544',
      '--accent-blue':        '#882211',
      '--accent-blue-light':  '#aa3322',
      '--accent-purple':      '#551111',
      '--accent-purple-light':'#ff5533',
      '--text-color':         '#e8c4b8',
      '--text-gold':          '#ee5544',
      '--text-purple':        '#ff5533',
      '--font-family':        "'IM Fell English', serif",
      '--panel-spacing':      '0.75rem',
      '--bg-primary':         '#1a0306',
      '--bg-glow-color':      'rgba(140,20,20,0.35)',
      '--panel-glow':         'rgba(180,40,30,0.14)',
      '--grimoire-glow':      'rgba(120,20,20,0.14)',
    },
  },
  verdant: {
    label: 'Verdant Workshop',
    swatch: ['#021008', '#b8a020', '#2a7a3a', '#1a5a2a'],
    vars: {
      '--accent-gold':        '#b8a020',
      '--accent-gold-light':  '#d8c040',
      '--accent-blue':        '#2a7a3a',
      '--accent-blue-light':  '#4a9a5a',
      '--accent-purple':      '#1a5a2a',
      '--accent-purple-light':'#60aa70',
      '--text-color':         '#cce0c0',
      '--text-gold':          '#d8c040',
      '--text-purple':        '#60aa70',
      '--font-family':        "'IM Fell English', serif",
      '--panel-spacing':      '0.75rem',
      '--bg-primary':         '#021008',
      '--bg-glow-color':      'rgba(20,80,30,0.45)',
      '--panel-glow':         'rgba(160,140,20,0.12)',
      '--grimoire-glow':      'rgba(40,100,50,0.14)',
    },
  },
  void: {
    label: 'Void',
    swatch: ['#060608', '#b0b0b8', '#606070', '#404050'],
    vars: {
      '--accent-gold':        '#a0a0b0',
      '--accent-gold-light':  '#c8c8d8',
      '--accent-blue':        '#606070',
      '--accent-blue-light':  '#8080a0',
      '--accent-purple':      '#404050',
      '--accent-purple-light':'#9090b0',
      '--text-color':         '#c0c0cc',
      '--text-gold':          '#d0d0e0',
      '--text-purple':        '#9090b0',
      '--font-family':        "'IM Fell English', serif",
      '--panel-spacing':      '0.75rem',
      '--bg-primary':         '#060608',
      '--bg-glow-color':      'rgba(50,50,80,0.3)',
      '--panel-glow':         'rgba(120,120,160,0.1)',
      '--grimoire-glow':      'rgba(80,80,120,0.1)',
    },
  },
}

function applyVars(vars) {
  Object.entries(vars).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v)
  })
}

function readVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export default function SettingsModal({ onClose }) {
  const [accentGold,   setAccentGold]   = useState(() => readVar('--accent-gold')   || DEFAULTS['--accent-gold'])
  const [accentBlue,   setAccentBlue]   = useState(() => readVar('--accent-blue')   || DEFAULTS['--accent-blue'])
  const [accentPurple, setAccentPurple] = useState(() => readVar('--accent-purple') || DEFAULTS['--accent-purple'])
  const [textColor,    setTextColor]    = useState(() => readVar('--text-color')    || DEFAULTS['--text-color'])
  const [fontFamily,   setFontFamily]   = useState(() => readVar('--font-family')   || DEFAULTS['--font-family'])
  const [spacing,      setSpacing]      = useState(() => parseFloat(readVar('--panel-spacing')) || 0.75)
  const [activeTheme,  setActiveTheme]  = useState(null)

  function pickTheme(key) {
    setActiveTheme(key)
    applyVars(THEMES[key].vars)
    const v = THEMES[key].vars
    setAccentGold(v['--accent-gold'])
    setAccentBlue(v['--accent-blue'])
    setAccentPurple(v['--accent-purple'])
    setTextColor(v['--text-color'])
    setFontFamily(v['--font-family'])
    setSpacing(parseFloat(v['--panel-spacing']))
  }

  function setVar(name, value) {
    document.documentElement.style.setProperty(name, value)
  }

  function handleGold(val) {
    setAccentGold(val); setActiveTheme(null)
    setVar('--accent-gold', val); setVar('--text-gold', val)
    setVar('--panel-glow', `rgba(${hexToRgb(val)},0.12)`)
  }

  function handleBlue(val) {
    setAccentBlue(val); setActiveTheme(null)
    setVar('--accent-blue', val)
    setVar('--grimoire-glow', `rgba(${hexToRgb(val)},0.12)`)
  }

  function handlePurple(val) {
    setAccentPurple(val); setActiveTheme(null)
    setVar('--accent-purple', val); setVar('--text-purple', val)
  }

  function handleText(val) {
    setTextColor(val); setActiveTheme(null)
    setVar('--text-color', val)
  }

  function handleFont(val) {
    setFontFamily(val); setActiveTheme(null)
    setVar('--font-family', val)
  }

  function handleSpacing(val) {
    setSpacing(val); setActiveTheme(null)
    setVar('--panel-spacing', `${val}rem`)
  }

  function save() {
    const current = {
      '--accent-gold':   accentGold,
      '--accent-blue':   accentBlue,
      '--accent-purple': accentPurple,
      '--text-color':    textColor,
      '--font-family':   fontFamily,
      '--panel-spacing': `${spacing}rem`,
      ...(activeTheme ? THEMES[activeTheme].vars : {}),
    }
    localStorage.setItem('workshop-settings', JSON.stringify(current))
    onClose()
  }

  function reset() {
    applyVars(DEFAULTS)
    setAccentGold(DEFAULTS['--accent-gold'])
    setAccentBlue(DEFAULTS['--accent-blue'])
    setAccentPurple(DEFAULTS['--accent-purple'])
    setTextColor(DEFAULTS['--text-color'])
    setFontFamily(DEFAULTS['--font-family'])
    setSpacing(0.75)
    setActiveTheme('arcane')
    localStorage.removeItem('workshop-settings')
  }

  return (
    <div id="design-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="design-modal">
        <h2>Settings</h2>
        <p>Changes apply instantly. Save to keep them after refresh.</p>
        <hr />

        <div className="design-section">
          <h3>Theme Presets</h3>
          <div id="theme-presets">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                className={`theme-btn ${activeTheme === key ? 'theme-btn--active' : ''}`}
                onClick={() => pickTheme(key)}
              >
                <div className="theme-swatches">
                  {theme.swatch.map((c, i) => (
                    <div key={i} className="theme-swatch" style={{ background: c }} />
                  ))}
                </div>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        <hr />

        <div className="design-section">
          <h3>Colors</h3>
          <div className="settings-row">
            <label>Accent / Interactive
              <input type="color" value={accentGold}   onChange={e => handleGold(e.target.value)} />
            </label>
            <label>Grimoire Glow
              <input type="color" value={accentBlue}   onChange={e => handleBlue(e.target.value)} />
            </label>
            <label>Toxicity / Failure
              <input type="color" value={accentPurple} onChange={e => handlePurple(e.target.value)} />
            </label>
            <label>Text
              <input type="color" value={textColor}    onChange={e => handleText(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="design-section">
          <h3>Font</h3>
          <select value={fontFamily} onChange={e => handleFont(e.target.value)}>
            <option value="'IM Fell English', serif">IM Fell English — Arcane</option>
            <option value="Georgia, serif">Georgia — Classic</option>
            <option value="'Palatino Linotype', Palatino, serif">Palatino — Elegant</option>
            <option value="'Courier New', monospace">Courier New — Runic</option>
          </select>
        </div>

        <div className="design-section">
          <h3>Panel Spacing</h3>
          <div className="settings-row settings-row--slider">
            <span>Tight</span>
            <input
              type="range" min="0.3" max="1.4" step="0.05"
              value={spacing}
              onChange={e => handleSpacing(parseFloat(e.target.value))}
            />
            <span>Spacious</span>
          </div>
        </div>

        <hr />

        <div className="modal-actions">
          <button onClick={save}>Save</button>
          <button onClick={reset}>Reset to Default</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
