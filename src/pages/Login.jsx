import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import { Eye, EyeOff, LogIn, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const DOCTOR_IMGS = [
  { src: '/images/doctors/doctor-1.jpg', name: 'Dr. Richard James', spec: 'General Physician' },
  { src: '/images/doctors/doctor-10.jpg', name: 'Dr. Emily Larson', spec: 'Gynecologist' },
  { src: '/images/doctors/doctor-9.jpg', name: 'Dr. Ava Mitchell', spec: 'Dermatologist' },
]

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login, resetPassword } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [show, setShow] = useState(false)

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Welcome back! 👋')
      nav(loc.state?.from?.pathname || '/dashboard')
    } catch (e) {
      toast.error(e.message || 'Login failed. Please try again.')
    }
  }

  const onForgot = async () => {
    const email = prompt('Enter your email:')
    if (!email) return
    try { await resetPassword(email); toast.success('Reset email sent!') }
    catch (e) { toast.error(e.message || 'Failed') }
  }

  return (
    <div className="min-h-[90vh] grid md:grid-cols-2">
      {/* Left Visual */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-40 translate-y-40" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur"><Stethoscope size={26} className="text-white" /></div>
            <span className="text-white font-bold text-2xl">MediCare</span>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">Welcome<br />Back!</h2>
          <p className="text-white/80 text-lg mb-8">Sign in to manage your appointments and healthcare journey.</p>
          <ul className="space-y-3 mb-10">
            {['Book appointments instantly', 'Track your health history', 'Body-part specialist matching', 'Secure Firebase authentication'].map(f => (
              <li key={f} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-400 grid place-items-center flex-shrink-0 text-white text-xs font-bold">✓</div>{f}
              </li>
            ))}
          </ul>
          {/* 3 Doctor images - full, proper */}
          <div className="grid grid-cols-3 gap-3">
            {DOCTOR_IMGS.map((d, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/10 border border-white/20">
                <img
                  src={d.src}
                  alt={d.name}
                  className="w-full h-25 object-cover object-center"
                />                <div className="p-2 text-center">
                  <div className="text-white text-xs font-bold truncate">{d.name.split(' ').slice(0, 2).join(' ')}</div>
                  <div className="text-white/60 text-xs truncate">{d.spec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white grid place-items-center shadow-xl shadow-indigo-500/30">
              <LogIn size={28} />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold">Sign In</h1>
            <p className="text-slate-500 mt-1">Login to continue to MediCare</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Email Address</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" placeholder="you@example.com" autoComplete="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Password</label>
                <div className="relative">
                  <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12" type={show ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password"
                    {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                  <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked /> Remember me
                </label>
                <button type="button" onClick={onForgot} className="text-indigo-600 hover:underline font-semibold">Forgot password?</button>
              </div>
              <button disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-xs text-center text-slate-600 dark:text-slate-400">
              💡 <strong>Demo:</strong> Register any account to login. Use <strong>admin@medibook.com</strong> for admin access.
            </div>
          </div>
          <p className="text-center text-sm mt-6">No account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create one free</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
