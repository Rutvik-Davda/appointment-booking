import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const { register: signup } = useAuth()
  const nav = useNavigate()
  const [show, setShow] = useState(false)
  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      await signup(data)
      toast.success('Account created successfully! Please sign in. 🎉')
      nav('/login')
    } catch (e) {
      toast.error(e.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-600 text-white grid place-items-center shadow-lg">
            <UserPlus size={28} />
          </div>
<div className="text-center mb-6">
  <h2
    className="text-3xl font-extrabold"
    style={{
      background: "linear-gradient(to right,#38bdf8,#22c55e,#a855f7)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Create Your Account
  </h2>

 <p
  className="text-base mt-2 font-black"
  style={{
    background: "linear-gradient(to right,#ffffff,#38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Join our Healthcare Portal
</p>
</div>       <b>   <p className="text-slate-500 mt-1"> Join MediBook — book your first appointment today</p></b>
        </div>






        <div className="glass rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label  className="text-sm font-bold text-cyan-300 mb-2 block">Full Name</label>
              <input className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400" placeholder="Dr. or Patient Name"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label  className="text-sm font-bold text-cyan-300 mb-2 block">Email Address</label>
              <input className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400" type="email" placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label  className="text-sm font-bold text-cyan-300 mb-2 block">Phone Number</label>
              <input className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400" type="tel" placeholder="+91 98765 43210"
                {...register('phone', { required: 'Phone is required', minLength: { value: 7, message: 'Too short' } })} />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label  className="text-sm font-bold text-cyan-300 mb-2 block">Password</label>
              <div className="relative">
                <input className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400" type={show ? 'text' : 'password'} placeholder="Min 6 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 pr-12 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400">{errors.password.message}</p>}
            </div>
            <div>
              <label  className="text-sm font-bold text-cyan-300 mb-2 block">Confirm Password</label>
              <input className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400"type="password" placeholder="Re-enter password"
                {...register('confirm', { required: 'Please confirm', validate: v => v === password || 'Passwords do not match' })} />
              {errors.confirm && <p className="text-xs text-rose-500 mt-1">{errors.confirm.message}</p>}
            </div>
            <button disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02]"
style={{
  background:
    "linear-gradient(90deg,#2563eb,#06b6d4,#8b5cf6)",
  boxShadow: "0 10px 25px rgba(59,130,246,.35)",
}}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>




        <p className="text-center text-sm mt-6">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
