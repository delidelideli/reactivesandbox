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
  '--font-family':         "'Cormorant Garamond', serif",
  '--panel-spacing':       '0.75rem',
  '--bg-primary':          '#0e0c0a',
  '--bg-glow-color':       'rgba(4,3,2,0.5)',
  '--panel-glow':          'rgba(196,154,42,0.08)',
  '--grimoire-glow':       'rgba(106,143,168,0.08)',
  '--border-panels-rgb':   '106,143,168',
  '--border-cauldron-rgb': '196,154,42',
  '--border-vessel-rgb':   '105,50,185',
  '--stat-potency-color':  '#c49a2a',
  '--stat-toxicity-color': '#a060c8',
  '--panel-bg-rgb':        '14,12,10',
  '--panel-bg-alpha':      '0.82',
  '--header-height':       '80px',
  '--header-bg-rgb':       '8,6,4',
  '--header-bg-alpha':     '0.97',
  '--header-glow-rgb':     '196,154,42',
  '--header-title-size':   '2rem',
  '--header-star-rgb':     '255,255,255',
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
      '--font-family':         "'Cormorant Garamond', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#0e0c0a',
      '--bg-glow-color':       'rgba(4,3,2,0.5)',
      '--panel-glow':          'rgba(196,154,42,0.08)',
      '--grimoire-glow':       'rgba(106,143,168,0.08)',
      '--border-panels-rgb':   '106,143,168',
      '--border-cauldron-rgb': '196,154,42',
      '--border-vessel-rgb':   '105,50,185',
      '--stat-potency-color':  '#c49a2a',
      '--stat-toxicity-color': '#a060c8',
      '--panel-bg-rgb':        '14,12,10',
      '--panel-bg-alpha':      '0.82',
      '--header-height':       '80px',
      '--header-bg-rgb':       '8,6,4',
      '--header-bg-alpha':     '0.97',
      '--header-glow-rgb':     '196,154,42',
      '--header-title-size':   '2rem',
      '--header-star-rgb':     '255,255,255',
        },
  },
  skyrim: {
    label: 'Skyrim',
    swatch: ['#1a1208', '#d4950a', '#607888', '#7a3068'],
    bodyClass: 'theme-skyrim',
    vars: {
      '--accent-gold':         '#d4950a',
      '--accent-gold-light':   '#f0b020',
      '--accent-blue':         '#4a6878',
      '--accent-blue-light':   '#6a8898',
      '--accent-purple':       '#703068',
      '--accent-purple-light': '#9050a0',
      '--text-color':          '#e0d8c8',
      '--text-gold':           '#d4950a',
      '--text-purple':         '#9050a0',
      '--font-family':         "'Cormorant Garamond', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#0e0b07',
      '--bg-glow-color':       'rgba(50,35,5,0.25)',
      '--panel-glow':          'rgba(212,149,10,0.12)',
      '--grimoire-glow':       'rgba(74,104,120,0.12)',
      '--border-panels-rgb':   '74,104,120',
      '--border-cauldron-rgb': '212,149,10',
      '--border-vessel-rgb':   '112,48,104',
      '--stat-potency-color':  '#d4950a',
      '--stat-toxicity-color': '#9050a0',
      '--panel-bg-rgb':        '22,16,8',
      '--panel-bg-alpha':      '0.86',
      '--header-height':       '80px',
      '--header-bg-rgb':       '18,13,7',
      '--header-bg-alpha':     '0.96',
      '--header-glow-rgb':     '212,149,10',
      '--header-title-size':   '2rem',
      '--header-star-rgb':     '255,220,120',
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
      '--font-family':         "'Cormorant Garamond', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#1a0306',
      '--bg-glow-color':       'rgba(140,20,20,0.35)',
      '--panel-glow':          'rgba(180,40,30,0.14)',
      '--grimoire-glow':       'rgba(120,20,20,0.14)',
      '--border-panels-rgb':   '136,34,17',
      '--border-cauldron-rgb': '204,51,34',
      '--border-vessel-rgb':   '85,17,17',
      '--stat-potency-color':  '#ee5544',
      '--stat-toxicity-color': '#ff5533',
      '--panel-bg-rgb':        '20,8,8',
      '--panel-bg-alpha':      '0.85',
      '--header-height':       '80px',
      '--header-bg-rgb':       '20,3,6',
      '--header-bg-alpha':     '0.97',
      '--header-glow-rgb':     '204,51,34',
      '--header-title-size':   '2rem',
      '--header-star-rgb':     '255,120,100',
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
      '--font-family':         "'Cormorant Garamond', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#021008',
      '--bg-glow-color':       'rgba(20,80,30,0.45)',
      '--panel-glow':          'rgba(160,140,20,0.12)',
      '--grimoire-glow':       'rgba(40,100,50,0.14)',
      '--border-panels-rgb':   '42,122,58',
      '--border-cauldron-rgb': '184,160,32',
      '--border-vessel-rgb':   '26,90,42',
      '--stat-potency-color':  '#d8c040',
      '--stat-toxicity-color': '#60aa70',
      '--panel-bg-rgb':        '8,14,8',
      '--panel-bg-alpha':      '0.83',
      '--header-height':       '80px',
      '--header-bg-rgb':       '2,10,2',
      '--header-bg-alpha':     '0.97',
      '--header-glow-rgb':     '184,160,32',
      '--header-title-size':   '2rem',
      '--header-star-rgb':     '160,220,140',
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
      '--font-family':         "'Cormorant Garamond', serif",
      '--panel-spacing':       '0.75rem',
      '--bg-primary':          '#060608',
      '--bg-glow-color':       'rgba(50,50,80,0.3)',
      '--panel-glow':          'rgba(120,120,160,0.1)',
      '--grimoire-glow':       'rgba(80,80,120,0.1)',
      '--border-panels-rgb':   '96,96,112',
      '--border-cauldron-rgb': '160,160,176',
      '--border-vessel-rgb':   '64,64,80',
      '--stat-potency-color':  '#d0d0e0',
      '--stat-toxicity-color': '#9090b0',
      '--panel-bg-rgb':        '8,8,12',
      '--panel-bg-alpha':      '0.88',
      '--header-height':       '80px',
      '--header-bg-rgb':       '6,6,8',
      '--header-bg-alpha':     '0.98',
      '--header-glow-rgb':     '160,160,176',
      '--header-title-size':   '2rem',
      '--header-star-rgb':     '180,180,220',
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

function lightenHex(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return '#' + [r, g, b].map(c => Math.min(255, Math.round(c + (255 - c) * amount)).toString(16).padStart(2, '0')).join('')
}

const DEFAULT_LABELS = {
  siteTitle:          "Alchemist's Workshop",
  satchel:            'Satchel',
  cauldron:           'Cauldron',
  output:             'Output',
  ingredientGrimoire: 'Ingredient Grimoire',
  potionGrimoire:     'Potion Grimoire',
  brew:               'Brew',
  dispel:             'Dispel',
}

export default function SettingsModal({ statNames, onStatNamesChange, labels, onLabelsChange, onClose }) {
  const [accentGold,        setAccentGold]        = useState(() => readVar('--accent-gold')          || DEFAULTS['--accent-gold'])
  const [accentPurple,      setAccentPurple]       = useState(() => readVar('--accent-purple')        || DEFAULTS['--accent-purple'])
  const [textColor,         setTextColor]          = useState(() => readVar('--text-color')           || DEFAULTS['--text-color'])
  const [borderPanels,      setBorderPanels]       = useState(() => rgbStringToHex(readVar('--border-panels-rgb')   || DEFAULTS['--border-panels-rgb']))
  const [borderCauldron,    setBorderCauldron]     = useState(() => rgbStringToHex(readVar('--border-cauldron-rgb') || DEFAULTS['--border-cauldron-rgb']))
  const [borderVessel,      setBorderVessel]       = useState(() => rgbStringToHex(readVar('--border-vessel-rgb')   || DEFAULTS['--border-vessel-rgb']))
  const [statPotencyColor,  setStatPotencyColor]   = useState(() => readVar('--stat-potency-color')  || DEFAULTS['--stat-potency-color'])
  const [statToxicityColor, setStatToxicityColor]  = useState(() => readVar('--stat-toxicity-color') || DEFAULTS['--stat-toxicity-color'])
  const [potencyName,       setPotencyName]        = useState(statNames?.potency  ?? 'Potency')
  const [toxicityName,      setToxicityName]       = useState(statNames?.toxicity ?? 'Toxicity')
  const [fontFamily,        setFontFamily]         = useState(() => readVar('--font-family')          || DEFAULTS['--font-family'])
  const [spacing,           setSpacing]            = useState(() => parseFloat(readVar('--panel-spacing')) || 0.75)
  const [panelBgColor,      setPanelBgColor]       = useState(() => rgbStringToHex(readVar('--panel-bg-rgb')   || DEFAULTS['--panel-bg-rgb']))
  const [panelBgAlpha,      setPanelBgAlpha]       = useState(() => parseFloat(readVar('--panel-bg-alpha'))    || 0.82)
  const [headerBgColor,     setHeaderBgColor]      = useState(() => rgbStringToHex(readVar('--header-bg-rgb')  || DEFAULTS['--header-bg-rgb']))
  const [headerBgAlpha,     setHeaderBgAlpha]      = useState(() => parseFloat(readVar('--header-bg-alpha'))   || 0.97)
  const [headerGlowColor,   setHeaderGlowColor]    = useState(() => rgbStringToHex(readVar('--header-glow-rgb')|| DEFAULTS['--header-glow-rgb']))
  const [headerHeight,      setHeaderHeight]       = useState(() => parseFloat(readVar('--header-height'))     || 80)
  const [headerTitleSize,   setHeaderTitleSize]    = useState(() => parseFloat(readVar('--header-title-size')) || 2)
  const [headerStarColor,   setHeaderStarColor]    = useState(() => rgbStringToHex(readVar('--header-star-rgb')|| DEFAULTS['--header-star-rgb']))
  const [headerEffect,      setHeaderEffect]       = useState(() => localStorage.getItem('workshop-header-effect') || 'stars')
  const [bgFileName,        setBgFileName]         = useState('')
  const [bgDataUrl,         setBgDataUrl]          = useState(null)
  const [activeTheme,       setActiveTheme]        = useState(null)
  const [activeTab,         setActiveTab]           = useState('theme')

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
    setBorderVessel(rgbStringToHex(v['--border-vessel-rgb']))
    setStatPotencyColor(v['--stat-potency-color'])
    setStatToxicityColor(v['--stat-toxicity-color'])
    setFontFamily(v['--font-family'])
    setSpacing(parseFloat(v['--panel-spacing']))
    if (v['--panel-bg-rgb'])        setPanelBgColor(rgbStringToHex(v['--panel-bg-rgb']))
    if (v['--panel-bg-alpha'])      setPanelBgAlpha(parseFloat(v['--panel-bg-alpha']))
    if (v['--header-bg-rgb'])       setHeaderBgColor(rgbStringToHex(v['--header-bg-rgb']))
    if (v['--header-bg-alpha'])     setHeaderBgAlpha(parseFloat(v['--header-bg-alpha']))
    if (v['--header-glow-rgb'])     setHeaderGlowColor(rgbStringToHex(v['--header-glow-rgb']))
    if (v['--header-height'])       setHeaderHeight(parseFloat(v['--header-height']))
    if (v['--header-title-size'])   setHeaderTitleSize(parseFloat(v['--header-title-size']))
    if (v['--header-star-rgb'])     setHeaderStarColor(rgbStringToHex(v['--header-star-rgb']))
    const bodyClasses = Object.values(THEMES).map(t => t.bodyClass).filter(Boolean)
    document.body.classList.remove(...bodyClasses)
    if (THEMES[key].bodyClass) document.body.classList.add(THEMES[key].bodyClass)
  }

  function handleBorderPanels(val) {
    setBorderPanels(val); setActiveTheme(null)
    const rgb = hexToRgb(val)
    setVar('--border-panels-rgb', rgb)
    setVar('--accent-blue', val)
    setVar('--accent-blue-light', lightenHex(val, 0.15))
    setVar('--grimoire-glow', `rgba(${rgb},0.1)`)
  }

  function handleBorderVessel(val) {
    setBorderVessel(val); setActiveTheme(null)
    setVar('--border-vessel-rgb', hexToRgb(val))
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
    setVar('--accent-gold', val)
    setVar('--accent-gold-light', lightenHex(val, 0.18))
    setVar('--text-gold', val)
    setVar('--panel-glow', `rgba(${hexToRgb(val)},0.12)`)
  }

  function handlePurple(val) {
    setAccentPurple(val); setActiveTheme(null)
    setVar('--accent-purple', val)
    setVar('--accent-purple-light', lightenHex(val, 0.25))
    setVar('--text-purple', val)
  }

  function handlePanelBgColor(val) {
    setPanelBgColor(val); setActiveTheme(null)
    setVar('--panel-bg-rgb', hexToRgb(val))
  }

  function handlePanelBgAlpha(val) {
    setPanelBgAlpha(val); setActiveTheme(null)
    setVar('--panel-bg-alpha', val)
  }

  function handleHeaderBgColor(val) {
    setHeaderBgColor(val); setActiveTheme(null)
    setVar('--header-bg-rgb', hexToRgb(val))
  }

  function handleHeaderBgAlpha(val) {
    setHeaderBgAlpha(val); setActiveTheme(null)
    setVar('--header-bg-alpha', val)
  }

  function handleHeaderGlow(val) {
    setHeaderGlowColor(val); setActiveTheme(null)
    setVar('--header-glow-rgb', hexToRgb(val))
  }

  function handleHeaderHeight(val) {
    setHeaderHeight(val); setActiveTheme(null)
    setVar('--header-height', `${val}px`)
  }

  function handleHeaderTitleSize(val) {
    setHeaderTitleSize(val); setActiveTheme(null)
    setVar('--header-title-size', `${val}rem`)
  }

  function handleHeaderStarColor(val) {
    setHeaderStarColor(val); setActiveTheme(null)
    setVar('--header-star-rgb', hexToRgb(val))
  }

  function handleHeaderEffect(val) {
    setHeaderEffect(val); setActiveTheme(null)
    document.querySelector('header')?.setAttribute('data-effect', val)
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
    const vars = {}
    Object.keys(DEFAULTS).forEach(k => { vars[k] = readVar(k) || DEFAULTS[k] })
    if (activeTheme) Object.assign(vars, THEMES[activeTheme].vars)
    const data = {
      version: 1,
      vars,
      bodyClass: activeTheme ? (THEMES[activeTheme].bodyClass || '') : '',
      headerEffect,
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
          if (data.vars['--border-vessel-rgb'])   setBorderVessel(rgbStringToHex(data.vars['--border-vessel-rgb']))
          if (data.vars['--stat-potency-color'])  setStatPotencyColor(data.vars['--stat-potency-color'])
          if (data.vars['--stat-toxicity-color']) setStatToxicityColor(data.vars['--stat-toxicity-color'])
          if (data.vars['--panel-bg-rgb'])         setPanelBgColor(rgbStringToHex(data.vars['--panel-bg-rgb']))
          if (data.vars['--panel-bg-alpha'])       setPanelBgAlpha(parseFloat(data.vars['--panel-bg-alpha']))
          if (data.vars['--header-bg-rgb'])        setHeaderBgColor(rgbStringToHex(data.vars['--header-bg-rgb']))
          if (data.vars['--header-bg-alpha'])      setHeaderBgAlpha(parseFloat(data.vars['--header-bg-alpha']))
          if (data.vars['--header-glow-rgb'])      setHeaderGlowColor(rgbStringToHex(data.vars['--header-glow-rgb']))
          if (data.vars['--header-height'])        setHeaderHeight(parseFloat(data.vars['--header-height']))
          if (data.vars['--header-title-size'])    setHeaderTitleSize(parseFloat(data.vars['--header-title-size']))
          if (data.vars['--header-star-rgb'])      setHeaderStarColor(rgbStringToHex(data.vars['--header-star-rgb']))
          if (data.headerEffect) { setHeaderEffect(data.headerEffect); document.querySelector('header')?.setAttribute('data-effect', data.headerEffect) }
        }
        if (data.statNames) {
          setPotencyName(data.statNames.potency ?? 'Potency')
          setToxicityName(data.statNames.toxicity ?? 'Toxicity')
          onStatNamesChange(data.statNames)
        }
        if (data.bodyClass !== undefined) {
          const allBodyClasses = Object.values(THEMES).map(t => t.bodyClass).filter(Boolean)
          document.body.classList.remove(...allBodyClasses)
          if (data.bodyClass) document.body.classList.add(data.bodyClass)
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
    const vars = {}
    Object.keys(DEFAULTS).forEach(k => { vars[k] = readVar(k) || DEFAULTS[k] })
    if (activeTheme) Object.assign(vars, THEMES[activeTheme].vars)
    localStorage.setItem('workshop-settings', JSON.stringify(vars))
    const bodyClass = activeTheme ? (THEMES[activeTheme].bodyClass || '') : ''
    localStorage.setItem('workshop-body-class', bodyClass)
    localStorage.setItem('workshop-header-effect', headerEffect)
    document.querySelector('header')?.setAttribute('data-effect', headerEffect)
    onClose()
  }

  function reset() {
    applyVars(DEFAULTS)
    setAccentGold(DEFAULTS['--accent-gold'])
    setAccentPurple(DEFAULTS['--accent-purple'])
    setTextColor(DEFAULTS['--text-color'])
    setBorderPanels(rgbStringToHex(DEFAULTS['--border-panels-rgb']))
    setBorderCauldron(rgbStringToHex(DEFAULTS['--border-cauldron-rgb']))
    setBorderVessel(rgbStringToHex(DEFAULTS['--border-vessel-rgb']))
    setStatPotencyColor(DEFAULTS['--stat-potency-color'])
    setStatToxicityColor(DEFAULTS['--stat-toxicity-color'])
    setFontFamily(DEFAULTS['--font-family'])
    setSpacing(0.75)
    setPanelBgColor(rgbStringToHex(DEFAULTS['--panel-bg-rgb']))
    setPanelBgAlpha(0.82)
    setHeaderBgColor(rgbStringToHex(DEFAULTS['--header-bg-rgb']))
    setHeaderBgAlpha(0.97)
    setHeaderGlowColor(rgbStringToHex(DEFAULTS['--header-glow-rgb']))
    setHeaderHeight(80)
    setHeaderTitleSize(2)
    setHeaderStarColor(rgbStringToHex(DEFAULTS['--header-star-rgb']))
    setHeaderEffect('stars')
    document.querySelector('header')?.setAttribute('data-effect', 'stars')
    setPotencyName('Potency')
    setToxicityName('Toxicity')
    onStatNamesChange({ potency: 'Potency', toxicity: 'Toxicity' })
    clearBg()
    setActiveTheme(null)
    const bodyClasses = Object.values(THEMES).map(t => t.bodyClass).filter(Boolean)
    document.body.classList.remove(...bodyClasses)
    localStorage.removeItem('workshop-settings')
    localStorage.removeItem('workshop-body-class')
    localStorage.removeItem('workshop-header-effect')
  }

  return (
    <div id="design-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="design-modal">
        <div className="modal-header">
          <div>
            <h2>Theme Settings</h2>
            <p>Changes apply instantly. Save to keep them after refresh.</p>
          </div>
          <div className="modal-warning">
            ⚠ Theme changes are not saved permanently.<br />Use <strong>Export Theme</strong> to save your settings as a file.
          </div>
        </div>
        <hr />

        <div className="settings-tabs">
          <button className={`settings-tab ${activeTab === 'theme'  ? 'settings-tab--active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</button>
          <button className={`settings-tab ${activeTab === 'header' ? 'settings-tab--active' : ''}`} onClick={() => setActiveTab('header')}>Header</button>
          <button className={`settings-tab ${activeTab === 'labels' ? 'settings-tab--active' : ''}`} onClick={() => setActiveTab('labels')}>Labels</button>
        </div>

        <div className="settings-tab-content">

        {activeTab === 'labels' && (
          <div id="settings-labels">
            {Object.entries(DEFAULT_LABELS).map(([key, placeholder]) => (
              <div key={key} className="settings-label-row">
                <span className="settings-label-name">{placeholder}</span>
                <input
                  type="text"
                  className="settings-label-input"
                  value={labels?.[key] ?? ''}
                  placeholder={placeholder}
                  maxLength={40}
                  onChange={e => onLabelsChange({ ...labels, [key]: e.target.value })}
                />
              </div>
            ))}
            <p className="settings-label-hint">Leave a field blank to use the default name.</p>
          </div>
        )}

        {activeTab === 'header' && <div id="settings-columns">

          <div className="settings-col">
            <h3>Title</h3>
            <div className="settings-row settings-row--wrap">
              <label>Accent Color
                <input type="color" value={headerGlowColor} onChange={e => handleHeaderGlow(e.target.value)} />
              </label>
            </div>
            <div className="settings-row settings-row--slider">
              <span>Small</span>
              <input
                type="range" min="1" max="2.4" step="0.05"
                value={headerTitleSize}
                onChange={e => handleHeaderTitleSize(parseFloat(e.target.value))}
              />
              <span>Large</span>
            </div>

            <h3>Effect</h3>
            <div className="effect-picker">
              {['Stars', 'Embers', 'Scanlines', 'None'].map(label => (
                <button
                  key={label}
                  className={`effect-btn ${headerEffect === label.toLowerCase() ? 'effect-btn--active' : ''}`}
                  onClick={() => handleHeaderEffect(label.toLowerCase())}
                >{label}</button>
              ))}
            </div>
            <div className="settings-row settings-row--wrap" style={{ opacity: headerEffect === 'none' ? 0.35 : 1 }}>
              <label>Effect Color
                <input type="color" value={headerStarColor} onChange={e => handleHeaderStarColor(e.target.value)} disabled={headerEffect === 'none'} />
              </label>
            </div>
          </div>

          <div className="settings-col-divider" />

          <div className="settings-col">
            <h3>Header Bar</h3>
            <div className="settings-row settings-row--wrap">
              <label>Background Color
                <input type="color" value={headerBgColor} onChange={e => handleHeaderBgColor(e.target.value)} />
              </label>
            </div>
            <div className="settings-row settings-row--slider">
              <span>Clear</span>
              <input
                type="range" min="0.1" max="1" step="0.01"
                value={headerBgAlpha}
                onChange={e => handleHeaderBgAlpha(parseFloat(e.target.value))}
              />
              <span>Solid</span>
            </div>

            <h3>Height</h3>
            <div className="settings-row settings-row--slider">
              <span>Short</span>
              <input
                type="range" min="50" max="120" step="1"
                value={headerHeight}
                onChange={e => handleHeaderHeight(parseFloat(e.target.value))}
              />
              <span>Tall</span>
            </div>
          </div>

        </div>}

        {activeTab === 'theme' && <div id="settings-columns">

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
              <label>Cauldron Panel
                <input type="color" value={borderVessel}   onChange={e => handleBorderVessel(e.target.value)} />
              </label>
              <label>Cauldron Accent
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
              <option value="'Cormorant Garamond', serif">Cormorant Garamond — Refined</option>
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

            <h3>Panel Background</h3>
            <div className="settings-row settings-row--wrap">
              <label>Color
                <input type="color" value={panelBgColor} onChange={e => handlePanelBgColor(e.target.value)} />
              </label>
            </div>
            <div className="settings-row settings-row--slider">
              <span>Clear</span>
              <input
                type="range" min="0.1" max="1" step="0.01"
                value={panelBgAlpha}
                onChange={e => handlePanelBgAlpha(parseFloat(e.target.value))}
              />
              <span>Solid</span>
            </div>

            <h3>Background Image</h3>
            <div className="settings-bg-row">
              <span className="settings-bg-label">{bgFileName || 'Default (Skyrim Wallpaper)'}</span>
              <button className="settings-upload-btn" onClick={() => bgInputRef.current.click()}>Upload</button>
              {bgDataUrl && <button className="settings-upload-btn" onClick={clearBg}>Remove</button>}
              <input ref={bgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgUpload} />
            </div>

          </div>

        </div>}

        </div>{/* end settings-tab-content */}

        <hr />

        <div className="modal-actions">
          <div className="modal-actions-left">
            <button onClick={exportTheme}>Export Theme</button>
            <button onClick={() => importInputRef.current.click()}>Import Theme</button>
            <input ref={importInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </div>
          <div className="modal-actions-right">
            <button onClick={save}>Save</button>
            <button onClick={reset}>Reset to Default</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
