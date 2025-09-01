import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { he } from 'date-fns/locale'

function sumMinutes(list){ return Math.round(list.reduce((s,w)=> s + (w.durationSec||0), 0)/60) }
function avg(arr){ return arr.length ? Math.round(arr.reduce((s,x)=> s + (x||0),0)/arr.length*10)/10 : 0 }
function toJsDate(d){ return d?.seconds ? new Date(d.seconds*1000) : new Date(d) }

export default function Stats(){
  const [all, setAll] = useState([])
  useEffect(()=>{ (async ()=>{
    const q = query(collection(db,'workouts'), where('ownerId','==', auth.currentUser.uid))
    const snap = await getDocs(q)
    setAll(snap.docs.map(d=>({id:d.id, ...d.data(), date: toJsDate(d.data().date)})))
  })() },[])

  const now = new Date()
  const wRange = { start: startOfWeek(now, { weekStartsOn:0, locale: he }), end: endOfWeek(now, { weekStartsOn:0, locale: he }) }
  const mRange = { start: startOfMonth(now), end: endOfMonth(now) }

  const week = all.filter(w=> isWithinInterval(w.date, wRange))
  const month = all.filter(w=> isWithinInterval(w.date, mRange))

  const weeklyGoal = 3
  const weekDone = week.length
  const goalText = weekDone >= weeklyGoal ? 'עמדת ביעד השבועי' : `חסר עוד ${weeklyGoal - weekDone} אימון`

  return (
    <>
      <h1>סטטיסטיקות</h1>

      <div className="card">
        <h2>שבוע נוכחי</h2>
        <div>מספר אימונים: <strong>{week.length}</strong></div>
        <div>דקות אימון כולל: <strong>{sumMinutes(week)}</strong></div>
        <div>ממוצע מהירות: <strong>{avg(week.map(w=>w.speedKmh))}</strong></div>
        <div className="badge" style={{marginTop:8}}>{goalText}</div>
      </div>

      <div className="card">
        <h2>חודש נוכחי</h2>
        <div>מספר אימונים: <strong>{month.length}</strong></div>
        <div>דקות אימון כולל: <strong>{sumMinutes(month)}</strong></div>
        <div>ממוצע מהירות: <strong>{avg(month.map(w=>w.speedKmh))}</strong></div>
      </div>
    </>
  )
}