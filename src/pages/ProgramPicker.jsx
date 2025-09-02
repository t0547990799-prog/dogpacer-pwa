// src/pages/ProgramPicker.jsx
import { useNavigate } from 'react-router-dom'
import { PROGRAMS, totalMinutes, avgSpeed, UNITS } from '../programs/library'

export default function ProgramPicker(){
  const nav = useNavigate()
  const list = Object.values(PROGRAMS)

  function choose(p){
    // נשמור בחירה ונלך ל-Workout
    localStorage.setItem('dp_selected_program', p.id)
    nav(`/workout?program=${encodeURIComponent(p.id)}`)
  }

  return (
    <main className="container">
      <div className="page-head">
        <h2>בחר תוכנית אימון</h2>
        <span className="badge soft">תוכניות מובנות • ערכים בקמ״ש</span>
      </div>

      <div className="tiles">
        {list.map(p => {
          const mins = totalMinutes(p.segments)
          const avg = avgSpeed(p.segments)
          const empty = p.segments.length === 0
          return (
            <div key={p.id} className="tile">
              <div className="row" style={{justifyContent:'space-between'}}>
                <div style={{fontWeight:800}}>{p.name}</div>
                <div className="badge">{empty ? 'חסר תוכן' : `${mins} דק • ממוצע ${avg} ${UNITS}`}</div>
              </div>
              {p.note ? <div className="muted" style={{fontSize:12}}>{p.note}</div> : null}
              <div className="row" style={{marginTop:10}}>
                <button className="btn" onClick={()=>choose(p)} disabled={empty}>בחר</button>
                {empty && <span className="muted" style={{fontSize:12}}>צריך למלא את המקצעים לפי המדריך</span>}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}