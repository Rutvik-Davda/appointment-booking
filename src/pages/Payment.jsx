import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { toast } from 'react-toastify'
import { CheckCircle2, Lock, Shield, Download, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Payment() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const loc = useLocation()
  const nav = useNavigate()
  const { user } = useAuth()
  const { addPayment, updateAppointment } = useData()
  const [done, setDone] = useState(false)
  const [receiptData, setReceiptData] = useState(null)

  const fees = loc.state?.fees || 500
  const doctorName = loc.state?.doctorName || 'Doctor'
  const apptId = loc.state?.apptId

  const cardNum = (watch('card') || '').replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()

 const downloadReceipt = (data) => {
  if (!data) {
    toast.error('Receipt data not found')
    return
  }

  const doc = new jsPDF()

  const receiptNo = `RCP-${Date.now()}`
  const paymentDate = new Date().toLocaleString()

  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, 210, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('MEDICARE', 105, 15, { align: 'center' })

  doc.setFontSize(11)
  doc.text('Medical Appointment Payment Receipt', 105, 24, {
    align: 'center',
  })

  doc.setTextColor(0, 0, 0)

  doc.setFontSize(12)
  doc.text(`Receipt No: ${receiptNo}`, 15, 50)
  doc.text(`Date: ${paymentDate}`, 15, 58)

  autoTable(doc, {
    startY: 70,
    head: [['Field', 'Value']],
    body: [
      ['Patient', user?.displayName || user?.email || 'N/A'],
      ['Doctor', doctorName],
      ['Appointment ID', apptId || 'N/A'],
      ['Amount Paid', `₹${fees}`],
      ['Payment Status', 'SUCCESS'],
      ['Card Holder', data.name],
      [
        'Card Number',
        `**** **** **** ${(watch('card') || '').slice(-4)}`,
      ],
      ['Mobile', data.mobile],
      ['Country', data.country],
      ['State', data.state],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
    },
  })

  const y = doc.lastAutoTable.finalY + 20

  doc.setFillColor(16, 185, 129)
  doc.roundedRect(15, y, 70, 10, 3, 3, 'F')

  doc.setTextColor(255, 255, 255)
  doc.text('PAYMENT SUCCESSFUL', 50, y + 7, {
    align: 'center',
  })

  doc.setTextColor(80, 80, 80)

  doc.setFontSize(11)
  doc.text(
    'Thank you for choosing Medicare.',
    105,
    y + 30,
    { align: 'center' }
  )

  doc.setFontSize(9)
  doc.text(
    'This is a computer-generated receipt.',
    105,
    y + 38,
    { align: 'center' }
  )

  doc.save(`Medical-Receipt-${receiptNo}.pdf`)

  toast.success('Receipt PDF downloaded successfully!')
}

  const onSubmit = (data) => new Promise(res => {
    setTimeout(() => {
      const payment = {
        userId: user.uid, amount: fees,
        last4: (data.card || '').replace(/\D/g,'').slice(-4),
        doctorName, appointmentId: apptId,
        cardHolder: data.name, mobile: data.mobile,
        country: data.country, state: data.state,
      }
      addPayment(payment)
      if (apptId) updateAppointment(apptId, { paid: true, status: 'approved' })
      toast.success('🎉 Payment successful! Appointment confirmed!')
      setReceiptData({ ...data, payment })
      setDone(true)
      res()
    }, 1400)
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold">Secure Payment</h1>
        <p className="text-slate-500 mt-1 flex items-center justify-center gap-1.5 text-sm"><Lock size={14}/>256-bit SSL Encrypted</p>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="success" initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }} className="text-center py-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', damping:10, delay:.1 }}
              className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white grid place-items-center mb-6 shadow-2xl shadow-emerald-500/40">
              <CheckCircle2 size={60}/>
            </motion.div>
            <h2 className="text-3xl font-extrabold text-emerald-600 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-1">Your appointment is confirmed ✓</p>
            <p className="text-2xl font-extrabold text-indigo-600 mb-6">₹{fees} Paid</p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-bold">{doctorName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold text-emerald-600">₹{fees}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold text-emerald-600">✓ Confirmed</span></div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => downloadReceipt(receiptData)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg transition-all">
                <Download size={18}/>Download Receipt (PDF)
              </button>
              <button onClick={() => nav('/dashboard')}
                className="w-full py-3 rounded-xl font-bold border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all">
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            {/* Card Visual */}
            <div className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #0891b2)' }}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-16 translate-x-16"/>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-10 -translate-x-10"/>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-8 rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 mb-5"/>
                <div className="text-lg font-mono tracking-widest mb-4 opacity-90">{cardNum || '•••• •••• •••• ••••'}</div>
                <div className="flex justify-between items-end">
                  <div><div className="text-white/60 text-xs">Card Holder</div><div className="font-bold">{watch('name') || 'YOUR NAME'}</div></div>
                  <div className="text-right"><div className="text-white/60 text-xs">Amount</div><div className="text-2xl font-extrabold">₹{fees}</div></div>
                </div>
              </div>
            </div>

            {/* Doctor info */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 mb-5">
              <div><div className="text-xs text-slate-500">Consulting</div><div className="font-bold">{doctorName}</div></div>
              <div className="text-2xl font-extrabold text-indigo-600">₹{fees}</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Card Holder Name *</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Full name on card"
                  {...register('name', { required: 'Required' })}/>
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Card Number * (16 digits)</label>
                <div className="relative">
                  <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12" placeholder="1234 5678 9012 3456" maxLength={19}
                    {...register('card', { required: 'Required', pattern: { value:/^[\d\s]{13,19}$/, message:'Enter valid 16-digit card number' } })}/>
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                </div>
                {errors.card && <p className="text-xs text-rose-500 mt-1">{errors.card.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Mobile Number *</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+91 98765 43210" type="tel"
                  {...register('mobile', { required: 'Mobile number is required', minLength: { value: 7, message: 'Enter valid mobile number' } })}/>
                {errors.mobile && <p className="text-xs text-rose-500 mt-1">{errors.mobile.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Country *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register('country', { required: 'Required' })}>
                    <option value="">Select Country</option>
                    <option>India</option><option>USA</option><option>UK</option><option>UAE</option><option>Canada</option><option>Australia</option><option>Singapore</option><option>Germany</option><option>France</option>
                  </select>
                  {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">State *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register('state', { required: 'Required' })}>
                    <option value="">Select State</option>
                    <option>Gujarat</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Rajasthan</option><option>UP</option><option>MP</option><option>Punjab</option><option>Haryana</option><option>Kerala</option><option>West Bengal</option>
                  </select>
                  {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-xs text-slate-500">
                <Shield size={14} className="text-emerald-500 flex-shrink-0 mt-0.5"/>
                Your payment is protected with 256-bit SSL. We never store card details.
              </div>

              <button disabled={isSubmitting} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base">
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Processing...</>
                ) : (
                  <><Lock size={16}/>Pay ₹{fees} Now</>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
