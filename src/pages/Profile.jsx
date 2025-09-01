import { useState } from 'react'
import { auth } from '../firebase'
import { updateProfile } from 'firebase/auth'

export default function Profile(){
  const user = auth.currentUser
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function save(e){
    e.preventDefault()
    if (!user) return
    try {
      setSaving(true)
      await updateProfile(user, { displayName: displayName || null })
      await user.reload() // מרענן את הנתונים המקומיים
      setMsg('הפרופיל עודכן בהצלחה')
    } catch (err) {
      console.error(err)
      setMsg('אירעה שגיאה בעדכון הפרופיל')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="container">
        <div className="card">עליך להתחבר כדי לראות את הפרופיל</div>
      </div>
    )
  }

  return (
    <>
      <h1>פרופיל משתמש</h1>
      <div className="card">
        <div style={{marginBottom:8, fontSize:14, color:'#555'}}>אימייל: <strong>{user.email}</strong></div>
        <form onSubmit={save} style={{display:'grid', gap:12}}>
          <input
            className="input"
            placeholder="שם תצוגה"
            value={displayName}
            onChange={e=>setDisplayName(e.target.value)}
          />
          <button className="btn" disabled={saving}>{saving ? 'שומר...' : 'שמור'}</button>
          {msg && <div className="badge" style={{marginTop:6}}>{msg}</div>}
        </form>
      </div>
    </>
  )
}