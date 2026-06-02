import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { Stethoscope, Moon, Sun, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const location = useLocation()

  const scrollTo = (id) => {
    setOpen(false)
    if (location.pathname !== '/') {
      nav('/')
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }) }, 350)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    nav('/')
    setOpen(false)
  }

  const cls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl flex-shrink-0">
          <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30"><Stethoscope size={20}/></span>
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent font-extrabold">MediCare</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={cls}>Home</NavLink>
          <button onClick={() => scrollTo('services-section')} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Services</button>
          <button onClick={() => scrollTo('doctors-section')}  className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Doctors</button>
          <button onClick={() => scrollTo('works-section')}    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Works</button>
          {user && <NavLink to="/dashboard"      className={cls}>Dashboard</NavLink>}
          {user && <NavLink to="/book-appointment" className={cls}>Book</NavLink>}
          {user && <NavLink to="/doctors"        className={cls}>All Doctors</NavLink>}
          {user && <NavLink to="/calendar"       className={cls}>Calendar</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={cls}>Admin</NavLink>}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            {dark ? <Sun size={17}/> : <Moon size={17}/>}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 grid place-items-center text-white text-xs font-bold">{(user.displayName||user.email)[0].toUpperCase()}</div>
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 max-w-[80px] truncate">{user.displayName||user.email.split('@')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-indigo-200 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm font-semibold transition">
                <LogOut size={14}/><span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">Register</Link>
            </>
          )}
          <button className="md:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center" onClick={() => setOpen(o=>!o)}>
            {open ? <X size={19}/> : <Menu size={19}/>}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 px-4 pb-4 pt-2 flex flex-col gap-1 bg-white dark:bg-slate-900">
          <NavLink to="/" end className={cls} onClick={()=>setOpen(false)}>🏠 Home</NavLink>
          <button className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={()=>scrollTo('services-section')}>⚕️ Services</button>
          <button className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={()=>scrollTo('doctors-section')}>👨‍⚕️ Doctors</button>
          <button className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={()=>scrollTo('works-section')}>⚙️ How it Works</button>
          {user && <>
            <NavLink to="/dashboard"       className={cls} onClick={()=>setOpen(false)}>📊 Dashboard</NavLink>
            <NavLink to="/book-appointment" className={cls} onClick={()=>setOpen(false)}>📅 Book Appointment</NavLink>
            <NavLink to="/doctors"         className={cls} onClick={()=>setOpen(false)}>👨‍⚕️ All Doctors</NavLink>
            <NavLink to="/calendar"        className={cls} onClick={()=>setOpen(false)}>🗓️ Calendar</NavLink>
            <NavLink to="/profile"         className={cls} onClick={()=>setOpen(false)}>👤 Profile</NavLink>
          </>}
          {user?.role==='admin' && <NavLink to="/admin" className={cls} onClick={()=>setOpen(false)}>⚙️ Admin</NavLink>}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2"/>
          {user
            ? <button onClick={handleLogout} className="w-full px-3 py-2 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition text-left flex items-center gap-2"><LogOut size={14}/> Logout</button>
            : <Link to="/login" onClick={()=>setOpen(false)} className="w-full text-center px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500">Login / Register</Link>
          }
        </div>
      )}
    </header>
  )
}
