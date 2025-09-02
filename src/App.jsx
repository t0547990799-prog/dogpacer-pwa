import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Dogs from './pages/Dogs'
import Workout from './pages/Workout'
import History from './pages/History'
import Stats from './pages/Stats'
import Safety from './pages/Safety'

export default function App(){
  return (
    <>
      <NavBar />
      <div className="container">
        <RequireAuth>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dogs" element={<Dogs/>} />
            <Route path="/workout" element={<Workout/>} />
            <Route path="/history" element={<History/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/safety" element={<Safety/>} />
          </Routes>
        </RequireAuth>
      </div>
    </>
  )
}