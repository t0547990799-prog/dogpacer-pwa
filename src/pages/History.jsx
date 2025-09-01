import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase'

function toJsDate(d){
  if (!d) return new Date(0)
  if (d.seconds) return new Date(d.seconds*1000)
  return new Date(d)
}

export default function History(){
  const [dogs, setDogs] = useState([])
  const [dogId, setDogId] = useState('ALL')
  const [items, setItems] = useState([])

  useEffect(()=>{ (async ()=>{
    const dq = query(collection(db,'dogs'), where('ownerId','==', auth.currentUser.uid))
    const ds = await getDocs(dq)
    const list = ds.docs.map(d=>({id:d.id, ...d.data()}))
    setDogs(list)
  })() },[])

  useEffect(()=>{ (async ()=>{
    const snap = await getDocs(query(collection(db,'workouts'), where('ownerId','==', auth.currentUser.uid)))
    let arr = snap.docs.map(d=>({id:d.id, ...d.data()}))
    if (dogId !== 'ALL') arr = arr.filter(x=>x.dogId===dogId)
    arr.sort((a,b)=> toJsDate(b.date) - toJsDate(a.date))
    setItems(arr)
  })() },[dogId])

  return (
    <>
      <h1>היסטוריית אימונים</h1>
      <div className="card">
        <label>סינון לפי כלב</label>
        <select className="select" value={dogId} onChange={e=>setDogId(e.target.value)}>
          <option value="ALL">כל הכלבים</option>
          {dogs.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {items.map(w=>(
        <div key={w.id} className="card">
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{toJsDate(w.date).toLocaleString('he-IL')}</strong>
            <span className="badge">{Math.round((w.durationSec||0)/60)} דק׳</span>
          </div>
          <div style={{fontSize:14, color:'#555', marginTop:6}}>
            מהירות {w.speedKmh ?? '—'} • שיפוע {w.inclinePercent ?? '—'} • דופק {w.heartBpm ?? '—'} • °C {w.tempC ?? '—'} • הרגיש {w.feelScore ?? '—'}
          </div>
          {w.notes && <div style={{marginTop:6}}>{w.notes}</div>}
        </div>
      ))}
      {items.length===0 && <div className="card">אין אימונים להצגה</div>}
    </>
  )
}