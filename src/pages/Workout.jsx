import { useEffect, useState } from 'react'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { getProgramsForModel, findProgramById } from '../data/programs'
import ProgramHelp from '../components/ProgramHelp'
import ProgramChart from '../components/ProgramChart'

export default function Workout(){
  const [dogs, setDogs] = useState([])
  const [dogId, setDogId] = useState('')
  const [dogModel, setDogModel] = useState('LF-3.1')

  const [availablePrograms, setAvailablePrograms] = useState([])
  const [programId, setProgramId] = useState('')

  const [mode, setMode] = useState('manual') // manual | timer | program
  const [elapsed, setElapsed] = useState(0)
  const [timerId, setTimerId] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const [f, setF] = useState({
    minutes:'', speedKmh:'', inclinePercent:'', heartBpm:'', tempC:'',
    feelScore:'3', notes:''
  })

  useEffect(() => {
    const load = async()=> {
      const q = query(collection(db,'dogs'), where('ownerId','==', auth.currentUser.uid))
      const snap = await getDocs(q)
      const list = snap.docs.map(d=>({id:d.id, ...d.data()}))
      setDogs(list)
      if (list[0]) {
        const model = list[0].treadmillModel || 'LF-3.1'
        setDogId(list[0].id)
        setDogModel(model)
        setAvailablePrograms(getProgramsForModel(model))
      }
    }
    load()
  }, [])

  useEffect(() => {
    const d = dogs.find(x => x.id === dogId)
    const model = d?.treadmillModel || 'LF-3.1'
    setDogModel(model)
    setAvailablePrograms(getProgramsForModel(model))
    setProgramId('')
    if (mode === 'program') setMode('manual')
  }, [dogId])

  function start(){ if (timerId) return; const id = setInterval(()=>setElapsed(e=>e+1), 1000); setTimerId(id) }
  function stop(){ if (timerId) { clearInterval(timerId); setTimerId(null) } }
  function reset(){ stop(); setElapsed(0) }

  function chooseProgram(pid) {
    setProgramId(pid)
    const p = findProgramById(pid)
    if (p?.durationMinutes) setF(prev => ({ ...prev, minutes: String(p.durationMinutes) }))
    setMode('program')
  }

  async function save(){
    if (!dogId) { alert('בחר כלב'); return }

    const durationSec =
      mode === 'manual' ? Math.max(0, Number(f.minutes||0)*60) :
      mode === 'timer' ? elapsed :
      mode === 'program' ? Math.max(0, Number(f.minutes||0)*60) : 0

    const speed = f.speedKmh ? Number(f.speedKmh) : null
    const incline = f.inclinePercent ? Number(f.inclinePercent) : null
    const bpm = f.heartBpm ? Number(f.heartBpm) : null
    const temp = f.tempC ? Number(f.tempC) : null

    if (mode !== 'program') {
      if (speed && (speed < 0.8 || speed > 12)) { alert('מהירות בין 0.8 ל־12'); return }
      if (incline && (incline < 0 || incline > 15)) { alert('שיפוע בין 0 ל־15'); return }
    }
    if (bpm && (bpm < 40 || bpm > 260)) { alert('דופק בין 40 ל־260'); return }
    if (temp && (temp < 36 || temp > 41.5)) { alert('טמפ׳ בין 36 ל־41.5'); return }

    const prog = programId ? findProgramById(programId) : null

    await addDoc(collection(db,'workouts'), {
      ownerId: auth.currentUser.uid,
      dogId,
      date: new Date(),
      durationSec,
      speedKmh: mode === 'program' ? null : speed,
      inclinePercent: mode === 'program' ? null : incline,
      heartBpm: bpm,
      tempC: temp,
      feelScore: Number(f.feelScore),
      notes: f.notes || null,
      programId: prog?.id || null,
      programName: prog?.name || null,
      programModel: prog?.model || null,
      createdAt: new Date()
    })
    alert('האימון נשמר')

    reset()
    setF({minutes:'', speedKmh:'', inclinePercent:'', heartBpm:'', tempC:'', feelScore:'3', notes:''})
    setProgramId('')
    setMode('manual')
  }

  return (
    <>
      <h1>אימון מהיר</h1>

      <div className="card" style={{display:'grid', gap:12}}>
        <label>בחר כלב</label>
        <select className="select" value={dogId} onChange={e=>setDogId(e.target.value)}>
          {dogs.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <div className="row">
          <button className="btn" onClick={()=>{ setMode('timer'); setProgramId('') }} disabled={mode==='timer'}>טיימר</button>
          <button className="btn" onClick={()=>{ setMode('manual'); setProgramId('') }} disabled={mode==='manual'}>הזנה ידנית</button>
          <button className="btn" onClick={()=> setMode('program')} disabled={mode==='program'}>תוכנית מובנית</button>
        </div>

        {mode==='program' && (
          <div className="card" style={{display:'grid', gap:8}}>
            <div style={{fontSize:12, color:'#666'}}>דגם: <strong>{dogModel}</strong></div>
            <label>בחר תוכנית</label>
            <select className="select" value={programId} onChange={e=>chooseProgram(e.target.value)}>
              <option value="">— בחר תוכנית —</option>
              {availablePrograms.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {programId && (
              <>
                <div style={{fontSize:12, color:'#555'}}>משך מומלץ: {findProgramById(programId)?.durationMinutes || '—'} דק׳</div>
                <div className="card" style={{marginTop:8}}>
                  <ProgramChart
                    segments={(findProgramById(programId)?.segments) || []}
                    title={`תוכנית ${programId} – מהירות לאורך זמן (קמ״ש)`}
                  />
                </div>
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>setHelpOpen(true)}>איך מפעילים במכשיר?</button>
                </div>
              </>
            )}
          </div>
        )}

        {mode==='timer' ? (
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:36, marginBottom:12}}>
              {String(Math.floor(elapsed/60)).padStart(2,'0')}:{String(elapsed%60).padStart(2,'0')}
            </div>
            <div style={{display:'flex', gap:8, justifyContent:'center'}}>
              <button className="btn" onClick={start}>התחל</button>
              <button className="btn" onClick={stop}>עצור</button>
              <button className="btn" onClick={reset}>איפוס</button>
            </div>
          </div>
        ) : (
          <input className="input" placeholder="משך בדקות" type="number" value={f.minutes} onChange={e=>setF({...f, minutes:e.target.value})}/>
        )}

        {mode!=='program' && (
          <div className="row">
            <input className="input" placeholder="מהירות (קמ״ש)" type="number" step="0.1" value={f.speedKmh} onChange={e=>setF({...f, speedKmh:e.target.value})}/>
            <input className="input" placeholder="שיפוע (%)" type="number" step="0.5" value={f.inclinePercent} onChange={e=>setF({...f, inclinePercent:e.target.value})}/>
          </div>
        )}

        <div className="row">
          <input className="input" placeholder="דופק (bpm)" type="number" value={f.heartBpm} onChange={e=>setF({...f, heartBpm:e.target.value})}/>
          <input className="input" placeholder="טמ׳ גוף (°C)" type="number" step="0.1" value={f.tempC} onChange={e=>setF({...f, tempC:e.target.value})}/>
        </div>

        <div className="row">
          <label>איך הרגיש (1-5)</label>
          <select className="select" value={f.feelScore} onChange={e=>setF({...f, feelScore:e.target.value})}>
            <option value="1">1 - קשה מאוד</option>
            <option value="2">2 - קשה</option>
            <option value="3">3 - בינוני</option>
            <option value="4">4 - טוב</option>
            <option value="5">5 - מצוין</option>
          </select>
        </div>

        <textarea className="textarea" rows="3" placeholder="הערות" value={f.notes} onChange={e=>setF({...f, notes:e.target.value})}/>
        <button className="btn" onClick={save}>שמור אימון</button>
      </div>

      <ProgramHelp open={helpOpen} onClose={()=>setHelpOpen(false)} model={dogModel} programId={programId} />
    </>
  )
}