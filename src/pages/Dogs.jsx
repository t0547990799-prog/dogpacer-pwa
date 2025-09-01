import { useEffect, useState } from 'react'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase'

export default function Dogs(){
  const [dogs, setDogs] = useState([])
  const [form, setForm] = useState({ name:'', breed:'', weightKg:'', ageMonths:'', model:'LF-3.1' })

  async function load(){
    const q = query(collection(db,'dogs'), where('ownerId','==', auth.currentUser.uid))
    const snap = await getDocs(q)
    setDogs(snap.docs.map(d=>({id:d.id, ...d.data()})))
  }
  useEffect(()=>{ load() },[])

  async function addDog(e){
    e.preventDefault()
    if (!form.name) return
    const weight = Number(form.weightKg||0)
    if (weight > 81) { alert('משקל מקסימלי 81 ק״ג'); return }
    await addDoc(collection(db,'dogs'), {
      ownerId: auth.currentUser.uid,
      name: form.name,
      breed: form.breed||'',
      weightKg: weight,
      ageMonths: Number(form.ageMonths||0),
      treadmillModel: form.model,
      createdAt: new Date()
    })
    setForm({ name:'', breed:'', weightKg:'', ageMonths:'', model:'LF-3.1' })
    await load()
  }

  return (
    <>
      <h1>הכלבים שלי</h1>
      <div className="card">
        <form onSubmit={addDog} style={{display:'grid', gap:12}}>
          <input className="input" placeholder="שם הכלב" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <div className="row">
            <input className="input" placeholder="גזע" value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})}/>
            <input className="input" placeholder="משקל ק״ג" type="number" step="0.1" value={form.weightKg} onChange={e=>setForm({...form, weightKg:e.target.value})}/>
          </div>
          <div className="row">
            <input className="input" placeholder="גיל בחודשים" type="number" value={form.ageMonths} onChange={e=>setForm({...form, ageMonths:e.target.value})}/>
            <select className="select" value={form.model} onChange={e=>setForm({...form, model:e.target.value})}>
              <option>LF-3.1</option>
              <option>MiniPacer</option>
            </select>
          </div>
          <button className="btn">הוסף כלב</button>
        </form>
      </div>

      <div className="card">
        <h2>רשימה</h2>
        {dogs.length===0 && <div>אין כלבים עדיין</div>}
        {dogs.map(d=>(
          <div key={d.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #eee'}}>
            <div>
              <strong>{d.name}</strong>
              <div style={{fontSize:12, color:'#666'}}>
                {d.breed || '—'} • {d.weightKg||0} ק״ג • {d.treadmillModel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}