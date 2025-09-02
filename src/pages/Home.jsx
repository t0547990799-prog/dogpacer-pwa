// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import HomeScene from '../three/HomeScene'

// בדיקת תמיכת WebGL
function supportsWebGL(){
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

export default function Home(){
  const [enable3D, setEnable3D] = useState(()=> {
    const saved = localStorage.getItem('dp_3d_enabled')
    return saved ? saved === '1' : true
  })
  const [webglOK, setWebglOK] = useState(true)

  useEffect(()=> {
    const ok = supportsWebGL()
    setWebglOK(ok)
  }, [])

  useEffect(()=> {
    localStorage.setItem('dp_3d_enabled', enable3D ? '1' : '0')
  }, [enable3D])

  return (
    <main className="container" style={{position:'relative'}}>
      {/* מתג הפעלה/כיבוי 3D */}
      <div className="row" style={{justifyContent:'space-between', marginBottom:12}}>
        <h2 style={{margin:0}}>ברוך הבא ל-dogPACER coach</h2>
        <label className="row" style={{gap:8, alignItems:'center'}}>
          <span className="muted">תלת־מימד</span>
          <input type="checkbox" checked={enable3D && webglOK} onChange={e=>setEnable3D(e.target.checked)} />
        </label>
      </div>

      {/* גיבור 3D או פלייסהולדר */}
      {enable3D && webglOK ? (
        <div className="hero-wrap">
          <HomeScene />
          {/* Overlay עם כפתורים גדולים */}
          <div className="hero-overlay">
            <div className="overlay-card">
              <h3 style={{margin:'0 0 6px'}}>התחל אימון</h3>
              <p className="muted" style={{marginBottom:12}}>בחר פעולה מהירה</p>
              <div className="row" style={{flexWrap:'wrap', gap:10}}>
                <a className="btn lg" href="/workout">⚡ אימון חדש</a>
                <a className="btn ghost lg" href="/dogs">🐾 נהל כלבים</a>
                <a className="btn ghost lg" href="/history">🕘 היסטוריה</a>
                <a className="btn ghost lg" href="/stats">📈 סטטיסטיקות</a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // גרסה ללא 3D – כרטיסים רגילים
        <div className="grid-2">
          <div className="card">
            <h3>פעולות מהירות</h3>
            <div className="row" style={{flexWrap:'wrap', gap:10, marginTop:8}}>
              <a className="btn lg" href="/workout">⚡ אימון חדש</a>
              <a className="btn ghost lg" href="/dogs">🐾 נהל כלבים</a>
              <a className="btn ghost lg" href="/history">🕘 היסטוריה</a>
              <a className="btn ghost lg" href="/stats">📈 סטטיסטיקות</a>
            </div>
          </div>
          <div className="card">
            <h3>טיפים מהירים</h3>
            <ul style={{margin:'8px 0 0 0', paddingInlineStart:'18px'}}>
              <li>ניתן לכבות/להפעיל 3D לפי ביצועי המכשיר.</li>
              <li>בהמשך נחליף למודל GLTF של ההליכון האמיתי.</li>
              <li>כל הכפתורים נגישים גם בלי תלת־מימד.</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}