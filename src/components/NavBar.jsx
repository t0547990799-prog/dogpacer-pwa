import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function NavBar(){
  const [open, setOpen] = useState(false)

  function toggle(){ setOpen(v => !v) }
  function close(){ setOpen(false) }

  return (
    <div className={`nav ${open ? 'open' : ''}`}>
      <div className="wrap container">
        <div className="row">
          <button className="btn ghost mobile-toggle" aria-label="תפריט" onClick={toggle}>
            ☰
          </button>
          <strong className="brand">dogPACER coach</strong>
        </div>

        <div className="nav-actions" onClick={close}>
          <NavLink to="/" className={({isActive})=> isActive ? 'active' : ''}>בית</NavLink>
          <NavLink to="/dogs" className={({isActive})=> isActive ? 'active' : ''}>כלבים</NavLink>
          <NavLink to="/workout" className={({isActive})=> isActive ? 'active' : ''}>אימון</NavLink>
          <NavLink to="/history" className={({isActive})=> isActive ? 'active' : ''}>היסטוריה</NavLink>
          <NavLink to="/stats" className={({isActive})=> isActive ? 'active' : ''}>סטטיסטיקות</NavLink>
          <NavLink to="/safety" className={({isActive})=> isActive ? 'active' : ''}>בטיחות</NavLink>
          <button className="btn" onClick={()=>signOut(auth)}>התנתקות</button>
        </div>
      </div>
    </div>
  )
}