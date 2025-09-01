import { Routes, Route } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth.jsx'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Dogs from './pages/Dogs.jsx'
import Workout from './pages/Workout.jsx'
import History from './pages/History.jsx'
import Stats from './pages/Stats.jsx'
import Safety from './pages/Safety.jsx'
import Profile from './pages/Profile.jsx'

export default function App(){
  return (
    <RequireAuth>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dogs" element={<Dogs/>} />
          <Route path="/workout" element={<Workout/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/stats" element={<Stats/>} />
          <Route path="/safety" element={<Safety/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </RequireAuth>
  )
}