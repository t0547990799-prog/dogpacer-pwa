// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import NavBar from './components/NavBar'

// עמודים (אם אצלך השמות שונים – התאם)
import Home from './pages/Home'
import Dogs from './pages/Dogs'
import Workout from './pages/Workout'
import History from './pages/History'
import Stats from './pages/Stats'
import Safety from './pages/Safety'

// Layout כללי לאפליקציה: מגן ב-RequireAuth, מציג NavBar ועטיפה RTL
function AppLayout({ children }) {
  return (
    <RequireAuth>
      <NavBar />
      <div className="container" dir="rtl">
        {children}
      </div>
    </RequireAuth>
  )
}

// מגדירים ראוטים בסגנון Data Router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: '/dogs',
    element: (
      <AppLayout>
        <Dogs />
      </AppLayout>
    ),
  },
  {
    path: '/workout',
    element: (
      <AppLayout>
        <Workout />
      </AppLayout>
    ),
  },
  {
    path: '/history',
    element: (
      <AppLayout>
        <History />
      </AppLayout>
    ),
  },
  {
    path: '/stats',
    element: (
      <AppLayout>
        <Stats />
      </AppLayout>
    ),
  },
  {
    path: '/safety',
    element: (
      <AppLayout>
        <Safety />
      </AppLayout>
    ),
  },
  // אפשר להוסיף כאן 404 בעתיד
])

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  )
}