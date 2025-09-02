// src/App.jsx
// למעלה בראש הקובץ
import ProgramPicker from './pages/ProgramPicker'

// ... בתוך createBrowserRouter([...]) ב-childrens של '/'
{ path: 'programs', element: <ProgramPicker /> },

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import NavBar from './components/NavBar'

// דפים
import Home from './pages/Home'
import Dogs from './pages/Dogs'
import Workout from './pages/Workout'
import History from './pages/History'
import Stats from './pages/Stats'
import Safety from './pages/Safety'

// Layout כללי: מגן ב-RequireAuth, מציג NavBarו-Container RTL, ומרנדר את הראוטים דרך <Outlet/>
function AppLayout() {
  return (
    <RequireAuth>
      <NavBar />
      <div className="container" dir="rtl">
        <Outlet />
      </div>
    </RequireAuth>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dogs', element: <Dogs /> },
      { path: 'workout', element: <Workout /> },
      { path: 'history', element: <History /> },
      { path: 'stats', element: <Stats /> },
      { path: 'safety', element: <Safety /> },
    ],
  },
])

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    />
  )
}

