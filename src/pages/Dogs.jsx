import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

const MODELS = ['LF-3.1', 'MiniPacer']

export default function Dogs(){
  const [items, setItems] = useState([])
  const [f, setF] = useState({ id:null, name:'', breed:'', ageYears:'', weightKg:'', treadmillModel:'LF-3.1', notes:'' })
  const [loading, setLoading] = useState(false)

  async function load(){
    setLoading(true)
    const q = query(collection(db,'dogs'), where('ownerId','==', auth.currentUser.uid))
    const snap = await getDocs(q)
    const list = snap.docs.map(d=>({ id:d.id, ...d.data() }))
    setItems(list)
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  function resetForm(){
    setF({ id:null, name:'', breed:'', ageYears:'', weightKg:'', treadmillModel:'LF-3.1', notes:'' })
  }

  async function save(e){
    e?.preventDefault?.()
    if (!f.name.trim()) { alert('שם הכלב חובה'); return }
    const payload = {
      ownerId: auth.currentUser.uid,
      name: f.name.trim(),
      breed: f.breed?.trim() || null,
      ageYears: f.ageYears ? Number(f.ageYears) : null,
      weightKg: f.weightKg ? Number(f.weightKg) : null,
      treadmillModel: f.treadmillModel || 'LF-3.1',
      notes: f.notes?.trim() || null,
      updatedAt: new Date()
    }

    if (f.id) await updateDoc(doc(db,'dogs', f.id), payload)
    else await addDoc(collection(db,'dogs'), { ...payload, createdAt: new Date() })

    await load()
    resetForm()
  }

  async function edit(item){
    setF({
      id: item.id,
      name: item.name || '',
      breed: item.breed || '',
      ageYears: item.ageYears ?? '',
      weightKg: item.weightKg ?? '',
      treadmillModel: item.treadmillModel || 'LF-3.1',
      notes: item.notes || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeDog(id){
    if (!confirm('למחוק את הכלב?')) return
    await deleteDoc(doc(db,'dogs', id))
    await load()
    if (f.id === id) resetForm()
  }

  return (
    <>
      <h1>ניהול כלבים</h1>

      <form className="card" onSubmit={save} style={{display:'grid', gap:12}}>
        <div className="row">
          <input className="input" placeholder="שם הכלב *" value={f.name} onChange={e=>setF({...f, name:e.target.value})}/>
          <input className="input" placeholder="גזע" value={f.breed} onChange={e=>setF({...f, breed:e.target.value})}/>
        </div>

        <div className="row">
          <input className="input" type="number" placeholder="גיל (שנים)" value={f.ageYears} onChange={e=>setF({...f, ageYears:e.target.value})}/>
          <input className="input" type="number" step="0.1" placeholder="משקל (ק״ג)" value={f.weightKg} onChange={e=>setF({...f, weightKg:e.target.value})}/>
        </div>

        <div className="row">
          <label>דגם הליכון</label>
          <select className="select" value={f.treadmillModel} onChange={e=>setF({...f, treadmillModel:e.target.value})}>
            {MODELS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <textarea className="textarea" rows="3" placeholder="הערות" value={f.notes} onChange={e=>setF({...f, notes:e.target.value})}/>

        <div className="row" style={{gap:8}}>
          <button className="btn" type="submit">{f.id ? 'עדכון כלב' : 'הוספת כלב'}</button>
          {f.id && <button type="button" className="btn" onClick={resetForm}>ביטול עריכה</button>}
        </div>
      </form>

      <div style={{opacity: loading ? 0.6 : 1}}>
        {items.map(it=>(
          <div key={it.id} className="card" style={{display:'grid', gap:8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap'}}>
              <strong>{it.name}</strong>
              <span className="badge">{it.treadmillModel || 'LF-3.1'}</span>
            </div>
            <div style={{fontSize:14, color:'#555'}}>
              {it.breed ? `גזע: ${it.breed} • ` : ''}{it.ageYears ? `גיל: ${it.ageYears} ` : ''}{it.weightKg ? `• משקל: ${it.weightKg} ק״ג` : ''}
            </div>
            {it.notes && <div style={{fontSize:14}}>{it.notes}</div>}

            <div className="row" style={{gap:8}}>
              <button className="btn" onClick={()=>edit(it)}>עריכה</button>
              <button className="btn" onClick={()=>removeDog(it.id)}>מחיקה</button>
            </div>
          </div>
        ))}
        {(!loading && items.length===0) && <div className="card">עוד לא הוספת כלבים</div>}
      </div>
    </>
  )
}