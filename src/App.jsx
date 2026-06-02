import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Landing        from './pages/Landing.jsx'
import Login          from './pages/Login.jsx'
import Register       from './pages/Register.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import Admin          from './pages/Admin.jsx'
import BookAppointment from './pages/BookAppointment.jsx'
import CalendarPage   from './pages/CalendarPage.jsx'
import Payment        from './pages/Payment.jsx'
import Profile        from './pages/Profile.jsx'
import NotFound       from './pages/NotFound.jsx'
import Doctors        from './pages/Doctors.jsx'
import Loader         from './components/Loader.jsx'

function UserRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  return user ? children : <Navigate to="/login" replace />
}
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/"                   element={<Landing />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/doctors"            element={<Doctors />} />
        <Route path="/dashboard"          element={<UserRoute><Dashboard /></UserRoute>} />
        <Route path="/admin"              element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/book-appointment"   element={<UserRoute><BookAppointment /></UserRoute>} />
        <Route path="/calendar"           element={<UserRoute><CalendarPage /></UserRoute>} />
        <Route path="/payment"            element={<UserRoute><Payment /></UserRoute>} />
        <Route path="/profile"            element={<UserRoute><Profile /></UserRoute>} />
        <Route path="*"                   element={<NotFound />} />
      </Route>
    </Routes>
  )
}
