import { useState, useRef } from 'react'

const DEFAULTS = {
  '--accent-gold':         '#c49a2a',
  '--accent-gold-light':   '#d9b040',
  '--accent-blue':         '#6a8fa8',
  '--accent-blue-light':   '#88adc0',
  '--accent-purple':       '#7a4090',
  '--accent-purple-light': '#a060c8',
  '--text-color':          '#c8bda8',
  '--text-gold':           '#c49a2a',
  '--text-purple':         '#a060c8',
  '--font-family':         "'IM Fell English', serif",
  '--panel-spacing':       '0.75rem',
  '--bg-primary':          '#0e0c0a',
  '--bg-glow-color':       'rgba(4,3,2,0.5)',
  '--panel-glow':          'rgba(196,154,42,0.08)',
  '--grimoire-glow':       'rgba(106,143,168,0.08)',
  '--border-panels-rgb':   '106,143,168',
  '--border-cauldron-rgb': '196,154,42',
  '--stat-potency-color':  '#c49a2a',
  '--stat-toxicity-color': '#a060c8',
}

const THEMES = {
  magical: {
    label: 'Magical & Mystical',
    swatch: ['#0e0c0a', '#c49a2a', '#6a8fa8', '#a060c8'],
    vars: {
      '--accent-gold':         '#c49a2a',
      '--accent-gold-light':   '#d9b040',
      '--accent-blue':         '#6a8fa8',
      '--accent-blue-light':   '#88adc0',
      '--accent-purple':       '#7a4090',
      '--accent-purple-light': '#a060c8',
      '--text-color':          '#c8bda8',
      '--text-gold':           '#c49a2a',
      '--text-purple':         '#a060c8',
      '--font-family':         "'IM Fell English', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#0e0c0a',
      '--bg-glow-color':       'rgba(4,3,2,0.5)',
      '--panel-glow':          'rgba(196,154,42,0.08)',
      '--grimoire-glow':       'rgba(106,143,168,0.08)',
      '--border-panels-rgb':   '106,143,168',
      '--border-cauldron-rgb': '196,154,42',
      '--stat-potency-color':  '#c49a2a',
      '--stat-toxicity-color': '#a060c8',
    },
  },
  skyrim: {
    label: 'Skyrim',
    swatch: ['#0f0e0c', '#b8860b', '#7a8fa0', '#6a4080'],
    bodyClass: 'theme-skyrim',
    vars: {
      '--accent-gold':         '#b8860b',
      '--accent-gold-light':   '#d4a520',
      '--accent-blue':         '#7a8fa0',
      '--accent-blue-light':   '#9ab0c0',
      '--accent-purple':       '#6a4080',
      '--accent-purple-light': '#9060b8',
      '--text-color':          '#d8cdb8',
      '--text-gold':           '#c8a040',
      '--text-purple':         '#9060b8',
      '--font-family':         "'IM Fell English', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#0f0e0c',
      '--bg-glow-color':       'rgba(80,60,20,0.15)',
      '--panel-glow':          'rgba(184,134,11,0.07)',
      '--grimoire-glow':       'rgba(122,143,160,0.08)',
      '--border-panels-rgb':   '122,143,160',
      '--border-cauldron-rgb': '184,134,11',
      '--stat-potency-color':  '#c8a040',
      '--stat-toxicity-color': '#9060b8',
    },
  },
  crimson: {
    label: 'Crimson Sanctum',
    swatch: ['#1a0306', '#cc3322', '#882211', '#661111'],
    vars: {
      '--accent-gold':         '#cc3322',
      '--accent-gold-light':   '#ee5544',
      '--accent-blue':         '#882211',
      '--accent-blue-light':   '#aa3322',
      '--accent-purple':       '#551111',
      '--accent-purple-light': '#ff5533',
      '--text-color':          '#e8c4b8',
      '--text-gold':           '#ee5544',
      '--text-purple':         '#ff5533',
      '--font-family':         "'IM Fell English', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#1a0306',
      '--bg-glow-color':       'rgba(140,20,20,0.35)',
      '--panel-glow':          'rgba(180,40,30,0.14)',
      '--grimoire-glow':       'rgba(120,20,20,0.14)',
      '--border-panels-rgb':   '136,34,17',
      '--border-cauldron-rgb': '204,51,34',
      '--stat-potency-color':  '#ee5544',
      '--stat-toxicity-color': '#ff5533',
    },
  },
  verdant: {
    label: 'Verdant Workshop',
    swatch: ['#021008', '#b8a020', '#2a7a3a', '#1a5a2a'],
    vars: {
      '--accent-gold':         '#b8a020',
      '--accent-gold-light':   '#d8c040',
      '--accent-blue':         '#2a7a3a',
      '--accent-blue-light':   '#4a9a5a',
      '--accent-purple':       '#1a5a2a',
      '--accent-purple-light': '#60aa70',
      '--text-color':          '#cce0c0',
      '--text-gold':           '#d8c040',
      '--text-purple':         '#60aa70',
      '--font-family':         "'IM Fell English', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#021008',
      '--bg-glow-color':       'rgba(20,80,30,0.45)',
      '--panel-glow':          'rgba(160,140,20,0.12)',
      '--grimoire-glow':       'rgba(40,100,50,0.14)',
      '--border-panels-rgb':   '42,122,58',
      '--border-cauldron-rgb': '184,160,32',
      '--stat-potency-color':  '#d8c040',
      '--stat-toxicity-color': '#60aa70',
    },
  },
  void: {
    label: 'Void',
    swatch: ['#060608', '#b0b0b8', '#606070', '#404050'],
    vars: {
      '--accent-gold':         '#a0a0b0',
      '--accent-gold-light':   '#c8c8d8',
      '--accent-blue':         '#606070',
      '--accent-blue-light':   '#8080a0',
      '--accent-purple':       '#404050',
      '--accent-purple-light': '#9090b0',
      '--text-color':          '#c0c0cc',
      '--text-gold':           '#d0d0e0',
      '--text-purple':         '#9090b0',
      '--font-family':         "'IM Fell English', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#060608',
      '--bg-glow-color':       'rgba(50,50,80,0.3)',
      '--panel-glow':          'rgba(120,120,160,0.1)',
      '--grimoire-glow':       'rgba(80,80,120,0.1)',
      '--border-panels-rgb':   '96,96,112',
      '--border-cauldron-rgb': '160,160,176',
      '--stat-potency-color':  '#d0d0e0',
      '--stat-toxicity-color': '#9090b0',
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

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function rgbStringToHex(rgb) {
  const parts = rgb.split(',').map(s => parseInt(s.trim()))
  if (parts.length < 3 || parts.some(isNaN)) return '#888888'
  return '#' + parts.slice(0, 3).map(n => n.toString(16).padStart(2, '0')).join('')
}

export default function SettingsModal({ statNames, onStatNamesChange, onClose }) {
  const [accentGold,        setAccentGold]        = useState(() => readVar('--accent-gold')          || DEFAULTS['--accent-gold'])
  const [accentPurple,      setAccentPurple]       = useState(() => readVar('--accent-purple')        || DEFAULTS['--accent-purple'])
  const [textColor,         setTextColor]          = useState(() => readVar('--text-color')           || DEFAULTS['--text-color'])
  const [borderPanels,      setBorderPanels]       = useState(() => rgbStringToHex(readVar('--border-panels-rgb')   || DEFAULTS['--border-panels-rgb']))
  const [borderCauldron,    setBorderCauldron]     = useState(() => rgbStringToHex(readVar('--border-cauldron-rgb') || DEFAULTS['--border-cauldron-rgb']))
  const [statPotencyColor,  setStatPotencyColor]   = useState(() => readVar('--stat-potency-color')  || DEFAULTS['--stat-potency-color'])
  const [statToxicityColor, setStatToxicityColor]  = useState(() => readVar('--stat-toxicity-color') || DEFAULTS['--stat-toxicity-color'])
  const [potencyName,       setPotencyName]        = useState(statNames?.potency  ?? 'Potency')
  const [toxicityName,      setToxicityName]       = useState(statNames?.toxicity ?? 'Toxicity')
  const [fontFamily,        setFontFamily]         = useState(() => readVar('--font-family')          || DEFAULTS['--font-family'])
  const [spacing,           setSpacing]            = useState(() => parseFloat(readVar('--panel-spacing')) || 0.75)
  const [bgFileName,        setBgFileName]         = useState('')
  const [bgDataUrl,         setBgDataUrl]          = useState(null)
  const [activeTheme,       setActiveTheme]        = useState(null)

  const bgInputRef     = useRef()
  const importInputRef = useRef()

  function setVar(name, value) {
    document.documentElement.style.setProperty(name, value)
  }

  function pickTheme(key) {
    setActiveTheme(key)
    applyVars(THEMES[key].vars)
    const v = THEMES[key].vars
    setAccentGold(v['--accent-gold'])
    setAccentPurple(v['--accent-purple'])
    setTextColor(v['--text-color'])
    setBorderPanels(rgbStringToHex(v['--border-panels-rgb']))
    setBorderCauldron(rgbStringToHex(v['--border-cauldron-rgb']))
    setStatPotencyColor(v['--stat-potency-color'])
    setStatToxicityColor(v['--stat-toxicity-color'])
    setFontFamily(v['--font-family'])
    setSpacing(parseFloat(v['--panel-spacing']))
    const bodyClasses = Object.values(THEMES).map(t => t.bodyClass).filter(Boolean)
    document.body.classList.remove(...bodyClasses)
    if (THEMES[key].bodyClass) document.body.classList.add(THEMES[key].bodyClass)
  }

  function handleBorderPanels(val) {
    setBorderPanels(val); setActiveTheme(null)
    setVar('--border-panels-rgb', hexToRgb(val))
  }

  function handleBorderCauldron(val) {
    setBorderCauldron(val); setActiveTheme(null)
    setVar('--border-cauldron-rgb', hexToRgb(val))
  }

  function handleStatPotency(val) {
    setStatPotencyColor(val); setActiveTheme(null)
    setVar('--stat-potency-color', val)
  }

  function handleStatToxicity(val) {
    setStatToxicityColor(val); setActiveTheme(null)
    setVar('--stat-toxicity-color', val)
  }

  function handlePotencyName(val) {
    setPotencyName(val)
    onStatNamesChange({ potency: val, toxicity: toxicityName })
  }

  function handleToxicityName(val) {
    setToxicityName(val)
    onStatNamesChange({ potency: potencyName, toxicity: val })
  }

  function handleGold(val) {
    setAccentGold(val); setActiveTheme(null)
    setVar('--accent-gold', val); setVar('--text-gold', val)
    setVar('--panel-glow', `rgba(${hexToRgb(val)},0.12)`)
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

  function handleBgUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      const dataUrl = evt.target.result
      setBgDataUrl(dataUrl)
      setBgFileName(file.name)
      document.body.style.backgroundImage = `url(${dataUrl})`
    }
    reader.readAsDataURL(file)
  }

  function clearBg() {
    setBgDataUrl(null)
    setBgFileName('')
    document.body.style.backgroundImage = ''
  }

  function exportTheme() {
    const data = {
      version: 1,
      vars: {
        '--accent-gold':         accentGold,
        '--accent-purple':       accentPurple,
        '--text-color':          textColor,
        '--font-family':         fontFamily,
        '--panel-spacing':       `${spacing}rem`,
        '--border-panels-rgb':   hexToRgb(borderPanels),
        '--border-cauldron-rgb': hexToRgb(borderCauldron),
        '--stat-potency-color':  statPotencyColor,
        '--stat-toxicity-color': statToxicityColor,
      },
      statNames: { potency: potencyName, toxicity: toxicityName },
      background: bgDataUrl || null,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'workshop-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (data.vars) {
          applyVars(data.vars)
          if (data.vars['--accent-gold'])         setAccentGold(data.vars['--accent-gold'])
          if (data.vars['--accent-purple'])       setAccentPurple(data.vars['--accent-purple'])
          if (data.vars['--text-color'])          setTextColor(data.vars['--text-color'])
          if (data.vars['--font-family'])         setFontFamily(data.vars['--font-family'])
          if (data.vars['--panel-spacing'])       setSpacing(parseFloat(data.vars['--panel-spacing']))
          if (data.vars['--border-panels-rgb'])   setBorderPanels(rgbStringToHex(data.vars['--border-panels-rgb']))
          if (data.vars['--border-cauldron-rgb']) setBorderCauldron(rgbStringToHex(data.vars['--border-cauldron-rgb']))
          if (data.vars['--stat-potency-color'])  setStatPotencyColor(data.vars['--stat-potency-color'])
          if (data.vars['--stat-toxicity-color']) setStatToxicityColor(data.vars['--stat-toxicity-color'])
        }
        if (data.statNames) {
          setPotencyName(data.statNames.potency ?? 'Potency')
          setToxicityName(data.statNames.toxicity ?? 'Toxicity')
          onStatNamesChange(data.statNames)
        }
        if (data.background) {
          setBgDataUrl(data.background)
          setBgFileName('imported')
          document.body.style.backgroundImage = `url(${data.background})`
        }
        setActiveTheme(null)
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function save() {
    const vars = {
      '--accent-gold':         accentGold,
      '--accent-purple':       accentPurple,
      '--text-color':          textColor,
      '--font-family':         fontFamily,
      '--panel-spacing':       `${spacing}rem`,
      '--border-panels-rgb':   hexToRgb(borderPanels),
      '--border-cauldron-rgb': hexToRgb(borderCauldron),
      '--stat-potency-color':  statPotencyColor,
      '--stat-toxicity-color': statToxicityColor,
      ...(activeTheme ? THEMES[activeTheme].vars : {}),
    }
    localStorage.setItem('workshop-settings', JSON.stringify(vars))
    onClose()
  }

  function reset() {
    applyVars(DEFAULTS)
    setAccentGold(DEFAULTS['--accent-gold'])
    setAccentPurple(DEFAULTS['--accent-purple'])
    setTextColor(DEFAULTS['--text-color'])
    setBorderPanels(rgbStringToHex(DEFAULTS['--border-panels-rgb']))
    setBorderCauldron(rgbStringToHex(DEFAULTS['--border-cauldron-rgb']))
    setStatPotencyColor(DEFAULTS['--stat-potency-color'])
    setStatToxicityColor(DEFAULTS['--stat-toxicity-color'])
    setFontFamily(DEFAULTS['--font-family'])
    setSpacing(0.75)
    setPotencyName('Potency')
    setToxicityName('Toxicity')
    onStatNamesChange({ potency: 'Potency', toxicity: 'Toxicity' })
    clearBg()
    setActiveTheme(null)
    const bodyClasses = Object.values(THEMES).map(t => t.bodyClass).filter(Boolean)
    document.body.classList.remove(...bodyClasses)
    localStorage.removeItem('workshop-settings')
  }

  return (
    <div id="design-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="design-modal">
        <h2>Settings</h2>
        <p>Changes apply instantly. Save to keep them after refresh.</p>
        <hr />

        <div id="settings-columns">

          {/* Column 1 — Theme Presets */}
          <div className="settings-col">
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

          <div className="settings-col-divider" />

          {/* Column 2 — Colors */}
          <div className="settings-col">
            <h3>Panel Borders</h3>
            <div className="settings-row settings-row--wrap">
              <label>Info Panels
                <input type="color" value={borderPanels}   onChange={e => handleBorderPanels(e.target.value)} />
              </label>
              <label>Cauldron
                <input type="color" value={borderCauldron} onChange={e => handleBorderCauldron(e.target.value)} />
              </label>
              <label>Accent / Glow
                <input type="color" value={accentGold}     onChange={e => handleGold(e.target.value)} />
              </label>
              <label>Failure
                <input type="color" value={accentPurple}   onChange={e => handlePurple(e.target.value)} />
              </label>
              <label>Text
                <input type="color" value={textColor}      onChange={e => handleText(e.target.value)} />
              </label>
            </div>

            <h3>Stat System</h3>
            <div className="settings-stat-row">
              <input
                type="text"
                className="settings-stat-name"
                value={potencyName}
                maxLength={20}
                onChange={e => handlePotencyName(e.target.value)}
              />
              <input type="color" value={statPotencyColor} onChange={e => handleStatPotency(e.target.value)} />
            </div>
            <div className="settings-stat-row">
              <input
                type="text"
                className="settings-stat-name"
                value={toxicityName}
                maxLength={20}
                onChange={e => handleToxicityName(e.target.value)}
              />
              <input type="color" value={statToxicityColor} onChange={e => handleStatToxicity(e.target.value)} />
            </div>
          </div>

          <div className="settings-col-divider" />

          {/* Column 3 — Appearance & File */}
          <div className="settings-col">
            <h3>Font</h3>
            <select value={fontFamily} onChange={e => handleFont(e.target.value)}>
              <option value="'IM Fell English', serif">IM Fell English — Arcane</option>
              <option value="Georgia, serif">Georgia — Classic</option>
              <option value="'Palatino Linotype', Palatino, serif">Palatino — Elegant</option>
              <option value="'Courier New', monospace">Courier New — Runic</option>
            </select>

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

            <h3>Background Image</h3>
            <div className="settings-bg-row">
              <span className="settings-bg-label">{bgFileName || 'Default (Skyrim Wallpaper)'}</span>
              <button className="settings-upload-btn" onClick={() => bgInputRef.current.click()}>Upload</button>
              {bgDataUrl && <button className="settings-upload-btn" onClick={clearBg}>Remove</button>}
              <input ref={bgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgUpload} />
            </div>

            <h3>Theme File</h3>
            <p>Export your current settings as a file. Import to restore any saved theme.</p>
            <div className="settings-row" style={{ marginTop: '0.4rem' }}>
              <button onClick={exportTheme}>Export Theme</button>
              <button onClick={() => importInputRef.current.click()}>Import Theme</button>
              <input ref={importInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </div>
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
