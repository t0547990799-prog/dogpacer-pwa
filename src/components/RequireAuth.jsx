// src/components/RequireAuth.jsx
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { APP_NAME } from '../config'

function normalizeEmail(v=''){
  return v.trim().toLowerCase()
}
function isValidEmail(v=''){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })
  const [mode, setMode] = useState('signin') // signin | signup
  const [err, setErr] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return () => unsub()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setErr('')

    const email = normalizeEmail(form.email)
    const password = form.password

    if (!isValidEmail(email)) {
      setErr('כתובת אימייל לא תקינה. ודא שכתבת באנגלית ובלי רווחים (example@domain.com).')
      return
    }
    if (!password || password.length < 6) {
      setErr('הסיסמה חייבת להיות באורך 6 תווים לפחות.')
      return
    }

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (e) {
      const code = e?.code || ''
      if (code === 'auth/user-not-found') setErr('משתמש לא קיים. אפשר לעבור להרשמה.')
      else if (code === 'auth/wrong-password') setErr('סיסמה שגויה.')
      else if (code === 'auth/email-already-in-use') setErr('האימייל כבר רשום. נסה כניסה.')
      else if (code === 'auth/invalid-email') setErr('כתובת אימייל לא תקינה.')
      else if (code === 'auth/too-many-requests') setErr('יותר מדי ניסיונות. נסה שוב בעוד כמה דקות.')
      else setErr('שגיאה בהתחברות. נסה שוב.')
      console.error(e)
    }
  }

  if (loading) return <div className="card">טוען...</div>

  if (!user) return (
    <div className="card" style={{maxWidth:420, margin:'40px auto', direction:'rtl'}}>
      <h2>כניסה ל-{APP_NAME}</h2>

      <form onSubmit={submit} style={{ display:'grid', gap:12 }}>
        <input
          className="input"
          style={{direction:'ltr', textAlign:'left'}}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email (example@domain.com)"
          value={form.email}
          onChange={e=>setForm(f=>({...f, email:e.target.value}))}
        />

        <input
          className="input"
          style={{direction:'ltr', textAlign:'left'}}
          type="password"
          autoComplete="current-password"
          placeholder="Password (6+ chars)"
          value={form.password}
          onChange={e=>setForm(f=>({...f, password:e.target.value}))}
        />

        {err && <div style={{background:'#3b0f0f', color:'#ffd5d5', border:'1px solid #7a2e2e', padding:'8px 10px', borderRadius:8, fontSize:14}}>
          {err}
        </div>}

        <button className="btn" type="submit">{mode==='signin' ? 'כניסה' : 'הרשמה'}</button>

        <div style={{fontSize:12}}>
          {mode==='signin' ? 'אין לך משתמש?' : 'יש לך משתמש?'}{' '}
          <a href="#" onClick={(e)=>{e.preventDefault(); setMode(mode==='signin'?'signup':'signin'); setErr('')}}>
            {mode==='signin' ? 'למעבר להרשמה' : 'למעבר לכניסה'}
          </a>
        </div>
      </form>
    </div>
  )

  return children
}