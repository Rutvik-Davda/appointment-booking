import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Users, Calendar, Hourglass, CheckCircle, DollarSign, X, Upload, Check, GraduationCap } from 'lucide-react'
import Swal from 'sweetalert2'

const COURSES = [
  'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
  'MD (Doctor of Medicine)',
  'MS (Master of Surgery)',
  'BDS (Bachelor of Dental Surgery)',
  'MDS (Master of Dental Surgery)',
  'BHMS (Bachelor of Homeopathic Medicine)',
  'BAMS (Bachelor of Ayurvedic Medicine)',
  'BPT (Bachelor of Physiotherapy)',
  'DM (Doctorate of Medicine)',
  'B.Sc Nursing (Bachelor of Nursing)',
  'DNB (Diplomate of National Board)',
  'DGO (Diploma in Gynecology)',
  'DCH (Diploma in Child Health)',
  'DVD (Diploma in Dermatology)',
]

const SPECS = ['General Physician','Gynecologist','Dermatologist','Pediatrician','Neurologist','Gastroenterologist','Cardiologist','ENT Specialist','Eye Specialist','Orthopedic','Dentist','Pulmonologist','Nephrologist']
const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SLOTS = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM']

export default function Admin() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, appointments, updateAppointment, deleteAppointment, payments, stats } = useData()
  const [tab, setTab] = useState('overview')

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-slate-500">Manage doctors, appointments and performance</p>
      </div>

      {/* Colorful Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Calendar,    label: 'Total Appts',  value: stats.total,     grad: 'from-indigo-500 to-blue-600',    bg: 'from-indigo-50 to-blue-50',    border: 'border-indigo-200' },
          { icon: Hourglass,   label: 'Pending',      value: stats.pending,   grad: 'from-amber-400 to-orange-500',   bg: 'from-amber-50 to-orange-50',   border: 'border-amber-200' },
          { icon: CheckCircle, label: 'Approved',     value: stats.approved,  grad: 'from-blue-400 to-cyan-500',      bg: 'from-blue-50 to-cyan-50',      border: 'border-blue-200' },
          { icon: DollarSign,  label: 'Revenue',      value: `₹${stats.revenue}`, grad: 'from-emerald-400 to-green-500', bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200' },
          { icon: Users,       label: 'Total Doctors',value: stats.doctors,   grad: 'from-violet-500 to-purple-600',  bg: 'from-violet-50 to-purple-50',  border: 'border-violet-200' },
        ].map(({ icon: Icon, label, value, grad, bg, border }, i) => (
          <motion.div key={i} whileHover={{ y:-3, scale:1.02 }} className={`rounded-2xl p-4 border-2 bg-gradient-to-br ${bg} ${border} shadow-sm flex items-center gap-3`}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} text-white grid place-items-center shadow-md flex-shrink-0`}><Icon size={20}/></div>
            <div><div className="text-2xl font-extrabold">{value}</div><div className="text-xs font-semibold text-slate-500">{label}</div></div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        {[['overview','📊 Overview'],['doctors','👨‍⚕️ Doctors'],['add-doctor','➕ Add Doctor'],['appointments','📅 Appointments']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab===t ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{l}</button>
        ))}
      </div>

      {tab === 'overview'     && <Overview appointments={appointments}/>}
      {tab === 'doctors'      && <DoctorsTab doctors={doctors} updateDoctor={updateDoctor} deleteDoctor={deleteDoctor} appointments={appointments} updateAppointment={updateAppointment}/>}
      {tab === 'add-doctor'   && <AddDoctorForm addDoctor={addDoctor} onDone={() => setTab('doctors')}/>}
      {tab === 'appointments' && <AppointmentsTab appointments={appointments} updateAppointment={updateAppointment} deleteAppointment={deleteAppointment}/>}
    </div>
  )
}

function Overview({ appointments }) {
  const recent = [...appointments].sort((a,b) => b.createdAt - a.createdAt).slice(0,10)
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-4"><h3 className="font-bold text-lg text-white">Recent Appointments</h3></div>
      {recent.length === 0 ? <div className="text-center py-12 text-slate-500">No appointments yet</div> : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>{['Patient','Doctor','Gender','Body Part','Specialist','Date & Time','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {recent.map(a => (
                <tr key={a.id} className={`border-t border-slate-100 dark:border-slate-700 ${a.status==='approved'?'bg-blue-50/60 dark:bg-blue-900/10':''}`}>
                  <td className="px-4 py-3 font-semibold">{a.userName||a.userEmail}</td>
                  <td className="px-4 py-3">{a.doctorName}</td>
                  <td className="px-4 py-3">{a.genderType==='male'?'👦 Male':'👧 Female'}</td>
                  <td className="px-4 py-3">{a.bodyPart}</td>
                  <td className="px-4 py-3">{a.specialist}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{a.appointmentDate} {a.timeSlot}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.status==='approved'?'bg-blue-100 text-blue-700':a.status==='completed'?'bg-emerald-100 text-emerald-700':a.status==='rejected'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AddDoctorForm({ addDoctor, onDone }) {
  const { register, handleSubmit, watch, setValue, reset, formState:{ errors } } = useForm({
    defaultValues: { name:'', specialization:'General Physician', course:'', experience:1, fees:500, about:'', education:'', image:'/images/doctors/doctor-1.jpg', days:[], slots:[], available:true }
  })
  const days  = watch('days')  || []
  const slots = watch('slots') || []
  const image = watch('image') || '/images/doctors/doctor-1.jpg'

  const toggle = (key, val) => {
    const cur = watch(key) || []
    setValue(key, cur.includes(val) ? cur.filter(x=>x!==val) : [...cur,val], { shouldDirty:true })
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setValue('image', r.result)
    r.readAsDataURL(f)
  }

  const onSubmit = (data) => {
    addDoctor({ ...data, rating: 4.5 })
    toast.success(`Dr. ${data.name} added successfully! 🎉`)
    reset()
    onDone()
  }

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={20}/>Add New Doctor</h3>
          <p className="text-white/80 text-sm">Fill in doctor details to add to the platform</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 bg-white dark:bg-slate-800">
          {/* Name + Specialization */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200">Doctor Name *</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Dr. Full Name"
                {...register('name', { required: 'Doctor name is required' })}/>
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200">Specialization *</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('specialization', { required: true })}>
                {SPECS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Course Select */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><GraduationCap size={15}/>Doctor Course / Degree *</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('course', { required: 'Please select a course' })}>
              <option value="">— Select Course —</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.course && <p className="text-xs text-rose-500 mt-1">{errors.course.message}</p>}
          </div>

          {/* Experience + Fees */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200">Experience (Years) *</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" type="number" min="0"
                {...register('experience', { required:true, valueAsNumber:true, min:0 })}/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200">Consultation Fees (₹) *</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" type="number" min="0"
                {...register('fees', { required:true, valueAsNumber:true, min:0 })}/>
            </div>
          </div>

          {/* About/Description */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-200">Description / About Doctor *</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]" placeholder="Describe doctor's expertise, achievements, and background..."
              {...register('about', { required: 'Description is required' })}/>
            {errors.about && <p className="text-xs text-rose-500 mt-1">{errors.about.message}</p>}
          </div>

          {/* Available Days */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => (
                <button type="button" key={d} onClick={() => toggle('days', d)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${days.includes(d) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-400'}`}>{d}</button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Time Slots</label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {SLOTS.map(s => (
                <button type="button" key={s} onClick={() => toggle('slots', s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all ${slots.includes(s) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-400'}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Doctor Photo</label>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 flex-shrink-0">
                <img src={image} alt="Doctor" className="w-full h-full object-cover object-center" onError={e=>{e.target.src='/images/doctors/doctor-1.jpg'}}/>
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-indigo-300 text-indigo-600 font-bold text-sm cursor-pointer hover:bg-indigo-50 transition mb-2">
                  <Upload size={14}/>Upload from Folder
                  <input type="file" accept="image/*" onChange={onFile} className="hidden"/>
                </label>
                <p className="text-xs text-slate-400 mb-1">Or enter image path:</p>
                <input className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="/images/doctors/doctor-1.jpg"
                  {...register('image')}/>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2">
            <Plus size={18}/>Add Doctor
          </button>
        </form>
      </div>
    </div>
  )
}

function DoctorsTab({ doctors, updateDoctor, deleteDoctor, appointments, updateAppointment }) {
  const [query, setQuery]   = useState('')
  const [editDoc, setEdit]  = useState(null)
  const [selDoc, setSelDoc] = useState(null)

  const list = doctors.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialization.toLowerCase().includes(query.toLowerCase())
  )

  const onDelete = async (id) => {
    const ok = await Swal.fire({ title:'Delete this doctor?', icon:'warning', showCancelButton:true, confirmButtonColor:'#dc2626', confirmButtonText:'Delete' })
    if (ok.isConfirmed) { deleteDoctor(id); toast.success('Doctor deleted') }
  }

  const docAppts = selDoc ? appointments.filter(a => a.doctorId === selDoc.id) : []

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
          <input className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Search doctors..." value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        <div className="text-sm font-semibold text-slate-500">{list.length} doctors found</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {list.map(d => (
          <motion.div key={d.id} whileHover={{ y:-3 }} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-cyan-50">
              <img src={d.image} alt={d.name} className="w-full h-full object-cover object-center"/>
              <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${d.available!==false?'bg-emerald-100/90 text-emerald-700':'bg-rose-100/90 text-rose-700'}`}>
                <span className={`w-2 h-2 rounded-full ${d.available!==false?'bg-emerald-500':'bg-rose-500'}`}/>
                {d.available!==false?'Available':'Unavailable'}
              </div>
            </div>
            <div className="p-4">
              <div className="font-extrabold">{d.name}</div>
              <div className="text-sm text-indigo-600 font-semibold">{d.specialization}</div>
              {d.course && <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><GraduationCap size={11}/><span className="truncate">{d.course.split('(')[0].trim()}</span></div>}
              <div className="text-xs text-slate-500 mt-1">{d.experience} yrs • ₹{d.fees}/visit</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setSelDoc(selDoc?.id===d.id?null:d)} className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border-2 transition ${selDoc?.id===d.id?'border-indigo-600 bg-indigo-600 text-white':'border-slate-200 hover:border-indigo-400'}`}>
                  <Calendar size={11} className="inline mr-1"/>Appts({appointments.filter(a=>a.doctorId===d.id).length})
                </button>
                <button onClick={() => onDelete(d.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border-2 border-rose-200 transition"><Trash2 size={11}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selDoc && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 flex items-center justify-between">
            <h3 className="font-bold text-white">Appointments — {selDoc.name}</h3>
            <button onClick={() => setSelDoc(null)} className="text-white/80 hover:text-white"><X size={18}/></button>
          </div>
          {docAppts.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-slate-800 text-slate-500">No appointments for this doctor</div>
          ) : (
            <div className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
              {docAppts.map(a => (
                <div key={a.id} className={`p-4 transition ${a.status==='approved'?'bg-blue-50 dark:bg-blue-900/15':''}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold">{a.userName || a.userEmail}</div>
                      <div className="text-xs text-slate-500">{a.genderType==='male'?'👦':'👧'} {a.bodyPart} • {a.specialist} • {a.appointmentDate} {a.timeSlot}</div>
                      {a.problem && <div className="text-xs italic text-slate-500 mt-0.5">"{a.problem}"</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.status==='approved'?'bg-blue-100 text-blue-700 font-extrabold':a.status==='completed'?'bg-emerald-100 text-emerald-700':a.status==='rejected'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>
                        {a.status==='approved'?'✓ Approved':a.status}
                      </span>
                      {a.status!=='approved' && (
                        <button onClick={() => { updateAppointment(a.id,{status:'approved'}); toast.success('Appointment approved! ✅') }} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 transition">
                          <Check size={11}/>Accept
                        </button>
                      )}
                      {a.status!=='completed' && (
                        <button onClick={() => { updateAppointment(a.id,{status:'completed'}); toast.success('Marked completed!') }} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition">Done</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AppointmentsTab({ appointments, updateAppointment, deleteAppointment }) {
  const [q, setQ]           = useState('')
  const [status, setStatus] = useState('all')
  const [gender, setGender] = useState('all')

  const list = appointments.filter(a =>
    (status==='all' || a.status===status) &&
    (gender==='all' || a.genderType===gender) &&
    (!q || (a.userName||'').toLowerCase().includes(q.toLowerCase()) || (a.doctorName||'').toLowerCase().includes(q.toLowerCase()))
  ).sort((a,b) => b.createdAt - a.createdAt)

  const setS = (id, s) => { updateAppointment(id,{status:s}); toast.success({approved:'Approved ✅',completed:'Completed 🎉',rejected:'Rejected'}[s]||'Updated') }
  const del  = async (id) => {
    const ok = await Swal.fire({ title:'Delete?', icon:'warning', showCancelButton:true, confirmButtonColor:'#dc2626' })
    if (ok.isConfirmed) { deleteAppointment(id); toast.success('Deleted') }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Search patient or doctor..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option>pending</option><option>approved</option><option>rejected</option><option>completed</option>
        </select>
        <select className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={gender} onChange={e=>setGender(e.target.value)}>
          <option value="all">All Genders</option>
          <option value="male">👦 Male</option>
          <option value="female">👧 Female</option>
        </select>
      </div>
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
              {['Patient','Doctor','Gender','Body Part','Specialist','Date & Time','Status','Actions'].map(h=>(
                <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
            {list.length===0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-500">No appointments found</td></tr>
            ) : list.map((a,i) => (
              <tr key={a.id} className={`${a.status==='approved'?'bg-blue-50/60 dark:bg-blue-900/10':i%2===0?'':'bg-slate-50/50 dark:bg-slate-800/50'} hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition`}>
                <td className="px-3 py-3 font-semibold whitespace-nowrap">{a.userName||a.userEmail}</td>
                <td className="px-3 py-3 whitespace-nowrap">{a.doctorName}</td>
                <td className="px-3 py-3">{a.genderType==='male'?'👦':'👧'}</td>
                <td className="px-3 py-3 whitespace-nowrap">{a.bodyPart}</td>
                <td className="px-3 py-3 whitespace-nowrap text-xs">{a.specialist}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{a.appointmentDate}<br/>{a.timeSlot}</td>
                <td className="px-3 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${a.status==='approved'?'bg-blue-100 text-blue-700 font-extrabold':a.status==='completed'?'bg-emerald-100 text-emerald-700':a.status==='rejected'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>
                    {a.status==='approved'?'✓ ':''}{a.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {a.status!=='approved'   && <button onClick={()=>setS(a.id,'approved')}   className="px-2 py-1 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 whitespace-nowrap">Approve</button>}
                    {a.status!=='completed'  && <button onClick={()=>setS(a.id,'completed')}  className="px-2 py-1 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600">Done</button>}
                    {a.status!=='rejected'&&a.status!=='completed' && <button onClick={()=>setS(a.id,'rejected')} className="px-2 py-1 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-600">Reject</button>}
                    <button onClick={()=>del(a.id)} className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"><Trash2 size={10}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
