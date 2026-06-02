import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { Link } from 'react-router-dom'
import { Calendar, CreditCard, Clock, CheckCircle, Hourglass, Trash2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user } = useAuth()
  const { appointments, payments, deleteAppointment, stats } = useData()
  const mine = appointments.filter(a => a.userId === user.uid)
  const myPending   = mine.filter(a => a.status === 'pending').length
  const myApproved  = mine.filter(a => a.status === 'approved').length
  const myPayments  = payments.filter(p => p.userId === user.uid)
  const totalPaid   = myPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0)

  const handleDelete = (id) => {
    if (!window.confirm('Delete this appointment?')) return
    deleteAppointment(id)
    toast.success('Appointment deleted')
  }

  const statusColor = {
    pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    approved:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    rejected:  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  }

  const downloadReceipt = (p) => {
    const txt = `MEDICARE PAYMENT RECEIPT\nDate: ${new Date(p.createdAt).toLocaleString()}\nDoctor: ${p.doctorName}\nAmount: ₹${p.amount}\nCard: **** ${p.last4}\nStatus: PAID ✓`
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([txt])), download: `receipt-${p.id}.txt` })
    a.click()
    toast.success('Receipt downloaded!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Hi, {user.displayName || user.email.split('@')[0]} 👋</h1>
          <p className="text-slate-500 mt-1">Welcome back to MediCare Dashboard</p>
        </div>
        <Link to="/book-appointment" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
          <Calendar size={16}/>Book New Appointment
        </Link>
      </div>

      {/* 4 Stat Cards - Colorful */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Calendar,     label: 'Total Appointments', value: mine.length,  grad: 'from-indigo-500 via-blue-500 to-blue-600',    bg: 'from-indigo-50 to-blue-50',   border: 'border-indigo-200' },
          { icon: Hourglass,    label: 'Pending',            value: myPending,    grad: 'from-amber-500 via-orange-500 to-orange-600',  bg: 'from-amber-50 to-orange-50',  border: 'border-amber-200' },
          { icon: CheckCircle,  label: 'Approved',           value: myApproved,   grad: 'from-blue-500 via-cyan-500 to-cyan-600',       bg: 'from-blue-50 to-cyan-50',     border: 'border-blue-200' },
          { icon: CreditCard,   label: 'Total Paid',         value: `₹${totalPaid}`, grad: 'from-pink-500 via-rose-500 to-red-500',   bg: 'from-pink-50 to-rose-50',     border: 'border-pink-200' },
        ].map(({ icon: Icon, label, value, grad, bg, border }, i) => (
          <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
            className={`rounded-2xl p-5 border-2 bg-gradient-to-br ${bg} ${border} shadow-sm flex items-center gap-4`}>
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${grad} text-white grid place-items-center shadow-lg flex-shrink-0`}>
              <Icon size={24}/>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Appointments */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 grid place-items-center"><Calendar size={16}/></span>
          My Appointments ({mine.length})
        </h2>
        {mine.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-5xl mb-3 opacity-40">📋</div>
            <p className="font-semibold text-slate-600">No appointments yet</p>
            <Link to="/book-appointment" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500">Book Your First Appointment</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[...mine].sort((a,b) => b.createdAt - a.createdAt).map(a => (
              <motion.div key={a.id} whileHover={{ y: -2 }}
                className={`rounded-2xl border-2 p-5 transition-all ${a.status === 'approved' ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img src={a.doctorImage || '/images/doctors/doctor-1.jpg'} alt={a.doctorName}
                      className="w-12 h-12 rounded-xl object-cover object-center flex-shrink-0 border-2 border-white shadow"/>
                    <div>
                      <div className="font-bold text-sm">{a.doctorName}</div>
                      <div className="text-xs text-indigo-600 font-semibold">{a.specialist}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize flex-shrink-0 ${statusColor[a.status] || 'bg-slate-100 text-slate-600'}`}>
                    {a.status === 'approved' ? '✓ ' : ''}{a.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500 mb-3">
                  <span>{a.genderType === 'male' ? '👦' : '👧'} {a.genderType === 'male' ? 'Male' : 'Female'}</span>
                  <span>🦴 {a.bodyPart}</span>
                  <span>📅 {a.appointmentDate}</span>
                  <span>⏰ {a.timeSlot}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">₹{a.fees}</span>
                  <span>{a.paid ? '✅ Paid' : '⏳ Unpaid'}</span>
                </div>
                <div className="flex gap-2">
                  {!a.paid && (
                    <Link to="/payment" state={{ fees: a.fees, doctorName: a.doctorName, apptId: a.id }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition">Pay Now</Link>
                  )}
                  <button onClick={() => handleDelete(a.id)} className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1">
                    <Trash2 size={11}/>Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 grid place-items-center"><CreditCard size={16}/></span>
          Payment History ({myPayments.length})
        </h2>
        {myPayments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-2 opacity-40">💳</div>
            <p className="text-slate-500">No payments yet</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
                  {['#','Date','Doctor','Card','Mobile','Amount','Status','Receipt'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myPayments.map((p, i) => (
                  <tr key={p.id} className={`border-t border-slate-100 dark:border-slate-700 ${i % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/70'} hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition`}>
                    <td className="px-4 py-3 font-bold text-indigo-600">#{i+1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{p.doctorName || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs">•••• {p.last4 || '0000'}</td>
                    <td className="px-4 py-3 text-xs">{p.mobile || '—'}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-600 text-base">₹{p.amount}</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">✓ Paid</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => downloadReceipt(p)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xs font-bold transition">
                        <Download size={11}/>PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-t-2 border-indigo-200">
                  <td colSpan={5} className="px-4 py-3 font-bold text-right text-slate-600 dark:text-slate-300">Total Paid:</td>
                  <td className="px-4 py-3 font-extrabold text-xl text-indigo-600">₹{totalPaid}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
