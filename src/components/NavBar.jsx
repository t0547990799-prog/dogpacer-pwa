import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function NavBar(){
  return (
    <div className="nav">
      <div className="wrap container">
        <strong>dogPACER coach</strong>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
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