// src/pages/Workout.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { PROGRAMS, UNITS, totalMinutes, avgSpeed } from '../programs/library'
import SegmentBar from '../components/SegmentBar'
import { speak, stopSpeak } from '../utils/tts'

function useTick(running){
  const [tick, setTick] = useState(0)
  useEffect(()=>{
    if (!running) return
    const id = setInterval(()=> setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return tick
}

export default function Workout(){
  const [params] = useSearchParams()
  const nav = useNavigate()

  // בחירת תוכנית
  const qProg = params.get('program') || localStorage.getItem('dp_selected_program') || ''
  const program = useMemo(()=> PROGRAMS[qProg] || null, [qProg])

  // מצב אימון
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [idx, setIdx] = useState(0)              // אינדקס מקטע
  const [secInSeg, setSecInSeg] = useState(0)    // שניות בתוך המקטע
  const [manualMode, setManualMode] = useState(!program || (program.segments||[]).length === 0)

  // מדדים ידניים
  const [heart, setHeart] = useState('')
  const [temp, setTemp] = useState('')
  const [feel, setFeel] = useState('')

  // הגדרות
  const [tts, setTts] = useState(()=> localStorage.getItem('dp_tts') !== '0')

  // טיימר כל שניה
  const tick = useTick(running && !paused)
  const prevAnnounced = useRef(-1) // כדי שלא נקריא כמה פעמים

  useEffect(()=> { localStorage.setItem('dp_tts', tts ? '1' : '0') }, [tts])

  const segs = program?.segments || []
  const hasSegs = segs.length > 0

  const seg = hasSegs ? segs[idx] : null
  const segSeconds = (seg?.min || 0) * 60
  const progressPct = segSeconds ? (secInSeg / segSeconds) * 100 : 0

  // התקדמות בזמן אמת
  useEffect(()=>{
    if (!running || paused || !hasSegs) return
    if (!seg) return
    // תחילת מקטע - הכרזה
    if (prevAnnounced.current !== idx){
      prevAnnounced.current = idx
      if (tts) {
        const text = `מתחיל מקטע ${idx+1}. מהירות ${seg.speed} ${UNITS}. למשך ${seg.min} דקות.`
        speak(text)
      }
    }
    if (secInSeg >= segSeconds){
      // מעבר למקטע הבא
      if (idx < segs.length - 1){
        setIdx(i => i + 1)
        setSecInSeg(0)
      } else {
        // סיום אימון
        finishSession('program')
      }
    } else {
      const id = setTimeout(()=> setSecInSeg(s => s + 1), 1000)
      return () => clearTimeout(id)
    }
  }, [tick, running, paused, idx, segSeconds, seg, hasSegs, tts])

  function start(){
    if (manualMode){
      setRunning(true); setPaused(false)
      return
    }
    if (!hasSegs){
      alert('לתוכנית אין מקטעים. עבור ל"בחירת תוכנית" והשלם ערכים')
      return
    }
    setRunning(true); setPaused(false)
    // אם התחלנו מחדש, נשמיע פתיח
    if (tts) speak(`מתחיל אימון ${program.name}. סה״כ ${totalMinutes(segs)} דקות. ממוצע ${avgSpeed(segs)} ${UNITS}.`)
  }

  function pause(){ setPaused(p => !p) }
  function stop(){
    if (confirm('לעצור את האימון?')){
      finishSession(manualMode ? 'manual' : 'program')
    }
  }

  function nextSeg(){
    if (!hasSegs) return
    if (idx < segs.length - 1){
      setIdx(i => i + 1); setSecInSeg(0)
    }
  }
  function prevSeg(){
    if (!hasSegs) return
    if (idx > 0){
      setIdx(i => i - 1); setSecInSeg(0)
    }
  }

  // שמירה ל-Firestore
  async function finishSession(kind){
    stopSpeak()
    const uid = auth.currentUser?.uid
    const payload = {
      kind, // 'program' | 'manual'
      programId: program?.id || null,
      createdAt: serverTimestamp(),
      localEndedAt: new Date().toISOString(),
      metrics: {
        heart: heart || null,
        temp: temp || null,
        feel: feel || null,
      },
    }

    if (kind === 'program' && hasSegs){
      payload.summary = {
        totalMinutes: totalMinutes(segs),
        avgSpeed: avgSpeed(segs),
        segments: segs,
      }
    }

    try{
      // נשמור תחת users/<uid>/workouts
      if (!uid) throw new Error('no user')
      await addDoc(collection(db, 'users', uid, 'workouts'), payload)
      // אופליין-פרסט: אם אין רשת זה יסתנכרן כשיהיה
      setRunning(false); setPaused(false); setIdx(0); setSecInSeg(0)
      alert('האימון נשמר. אפשר לראות בהיסטוריה וסטטיסטיקות.')
      nav('/history')
    }catch(e){
      console.error(e)
      setRunning(false); setPaused(false)
      alert('נשמר מקומית וייסתנכרן מאוחר יותר. תוכל לראות בהיסטוריה כאשר יהיה חיבור.')
      nav('/history')
    }
  }

  return (
    <main className="container">
      <div className="page-head">
        <h2>אימון</h2>
        <div className="row" style={{gap:12}}>
          <label className="row" style={{gap:8, alignItems:'center'}}>
            <span className="muted">קול</span>
            <input type="checkbox" checked={tts} onChange={e=>setTts(e.target.checked)} />
          </label>
          <button className="btn ghost" onClick={()=>nav('/programs')}>בחירת תוכנית</button>
        </div>
      </div>

      {!manualMode && program ? (
        <>
          <div className="card" style={{marginBottom:12}}>
            <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontWeight:800}}>{program.name}</div>
              <div className="badge">{totalMinutes(segs)} דק • ממוצע {avgSpeed(segs)} {UNITS}</div>
            </div>
            <div style={{marginTop:10}}>
              <SegmentBar segments={segs} currentIndex={idx} currentPct={progressPct} />
            </div>

            <div style={{marginTop:12}} className="row" dir="rtl">
              <button className="btn ghost" onClick={prevSeg} disabled={idx===0}>מקטע קודם</button>
              <div className="card" style={{display:'flex',gap:12,alignItems:'center'}}>
                <div>מקטע {idx+1} מתוך {segs.length}</div>
                <div className="badge">מהירות {seg?.speed ?? '—'} {UNITS}</div>
                <div className="badge">זמן נוכחי {secInSeg}s / {(seg?.min||0)*60}s</div>
              </div>
              <button className="btn ghost" onClick={nextSeg} disabled={idx>=segs.length-1}>מקטע הבא</button>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{marginBottom:12}}>
          <strong>מצב ידני</strong>
          <div className="muted" style={{marginTop:6}}>לא נבחרה תוכנית או שהתוכנית ריקה. אפשר לעבור ל"בחירת תוכנית" או להפעיל אימון ידני.</div>
        </div>
      )}

      <div className="card">
        <h3 style={{marginTop:0}}>מדדים ידניים</h3>
        <div className="form-grid" style={{marginTop:8}}>
          <div>
            <label>דופק</label>
            <input className="input" inputMode="numeric" placeholder="לדוגמה 90" value={heart} onChange={e=>setHeart(e.target.value)} />
          </div>
          <div>
            <label>חום גוף</label>
            <input className="input" inputMode="decimal" placeholder="לדוגמה 38.5" value={temp} onChange={e=>setTemp(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <label>איך הכלב הרגיש באימון</label>
          <input className="input" placeholder="שמח, רגוע, עייף..." value={feel} onChange={e=>setFeel(e.target.value)} />
        </div>
      </div>

      <div className="row" style={{gap:10, marginTop:12, flexWrap:'wrap'}}>
        {!running ? (
          <button className="btn lg" onClick={start}>התחל</button>
        ) : (
          <>
            <button className="btn" onClick={pause}>{paused ? 'המשך' : 'השהה'}</button>
            <button className="btn danger" onClick={stop}>עצור ושמור</button>
          </>
        )}
      </div>
    </main>
  )
}