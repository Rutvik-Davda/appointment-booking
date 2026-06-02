import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { toast } from 'react-toastify'
import { Save, User, Calendar, CheckCircle, CreditCard } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { appointments, payments } = useData()
  const mine = appointments.filter(a => a.userId === user?.uid)
  const myPay = payments.filter(p => p.userId === user?.uid)
  const [name, setName] = useState(user?.displayName || '')
  const [phone, setPhone] = useState('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">My Profile</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 grid place-items-center text-white text-3xl font-extrabold flex-shrink-0">
            {(user?.displayName||user?.email||'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-bold">{user?.displayName||'Patient'}</div>
            <div className="text-slate-500 text-sm">{user?.email}</div>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{user?.role||'Patient'}</span>
          </div>
        </div>
        <form onSubmit={e=>{e.preventDefault();toast.success('Profile updated!')}}>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold mb-1.5">Full Name</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={name} onChange={e=>setName(e.target.value)}/></div>
            <div><label className="block text-sm font-semibold mb-1.5">Email</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 opacity-60 cursor-not-allowed" value={user?.email||''} disabled/></div>
            <div><label className="block text-sm font-semibold mb-1.5">Phone</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 00000"/></div>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg transition-all"><Save size={16}/>Save Changes</button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          {icon:Calendar, label:'Total',    value:mine.length,                                          grad:'from-indigo-500 to-blue-600',  bg:'from-indigo-50 to-blue-50',   border:'border-indigo-200'},
          {icon:CheckCircle,label:'Approved',value:mine.filter(a=>a.status==='approved').length,        grad:'from-blue-500 to-cyan-600',    bg:'from-blue-50 to-cyan-50',     border:'border-blue-200'},
          {icon:CreditCard,label:'Paid',    value:`₹${myPay.reduce((s,p)=>s+(Number(p.amount)||0),0)}`,grad:'from-pink-500 to-rose-600',   bg:'from-pink-50 to-rose-50',     border:'border-pink-200'},
        ].map(({icon:Icon,label,value,grad,bg,border})=>(
          <div key={label} className={`rounded-2xl p-4 border-2 bg-gradient-to-br ${bg} ${border} text-center shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} text-white grid place-items-center mx-auto mb-2`}><Icon size={18}/></div>
            <div className="text-2xl font-extrabold">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
