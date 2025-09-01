import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { APP_NAME } from '../config'

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })
  const [mode, setMode] = useState('signin')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return () => unsub()
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (mode === 'signin') {
      await signInWithEmailAndPassword(auth, form.email, form.password)
    } else {
      await createUserWithEmailAndPassword(auth, form.email, form.password)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">טוען...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>כניסה ל-{APP_NAME}</h2>
          <form onSubmit={submit} style={{ display:'grid', gap:12 }}>
            <input
              className="input"
              placeholder="אימייל"
              value={form.email}
              onChange={e=>setForm(f=>({...f, email:e.target.value}))}
            />
            <input
              className="input"
              type="password"
              placeholder="סיסמה"
              value={form.password}
              onChange={e=>setForm(f=>({...f, password:e.target.value}))}
            />
            <button className="btn">{mode==='signin' ? 'כניסה' : 'הרשמה'}</button>
            <div style={{fontSize:12}}>
              {mode==='signin' ? 'אין לך משתמש?' : 'יש לך משתמש?'}{' '}
              <a
                href="#"
                onClick={(e)=>{e.preventDefault(); setMode(mode==='signin' ? 'signup' : 'signin')}}
              >
                {mode==='signin' ? 'למעבר להרשמה' : 'למעבר לכניסה'}
              </a>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return children
}