import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Calendar, Clock, Stethoscope, CheckCircle } from 'lucide-react'

const MALE_PARTS = [
  'Head','Hair','Forehead','Eye','Ear','Nose','Lips','Mouth','Neck','Chin',
  'Shoulder','Chest','Arm','Back','Spine','Elbow','Wrist','Hand','Fingers',
  'Abdomen','Stomach','Umbilicus','Waist','Hip','Thigh','Groin',
  'Leg','Knee','Calf','Ankle','Foot','Toes',
  'Brain','Heart','Lungs','Liver','Kidney','Stomach','Pancreas',
  'Bladder','Spleen','Esophagus','Small Intestine','Bones','Muscles','Skin','Teeth'
]

const FEMALE_PARTS = [
  'Head','Forehead','Eye','Ear','Nose','Lips','Cheek','Chin','Neck',
  'Shoulder','Chest','Breast','Arm','Back','Spine','Elbow','Wrist','Hand','Fingers',
  'Abdomen','Stomach','Umbilicus','Waist','Groin','Vulva',
  'Thigh','Knee','Leg','Calf','Ankle','Foot','Toes',
  'Brain','Heart','Lungs','Liver','Kidney','Uterus','Ovaries','Pancreas',
  'Bladder','Spleen','Esophagus','Small Intestine','Bones','Muscles','Skin','Teeth'
]

const SPECIALIST_MAP = {
  Head:'Neurologist', Brain:'Neurologist', Forehead:'Neurologist',
  Eye:'Eye Specialist', Ear:'ENT Specialist', Nose:'ENT Specialist',
  Mouth:'ENT Specialist', Throat:'ENT Specialist', Neck:'General Physician',
  Skin:'Dermatologist', Hair:'Dermatologist', Cheek:'Dermatologist', Lips:'Dermatologist',
  Heart:'Cardiologist', Chest:'Cardiologist',
  Lungs:'Pulmonologist', Esophagus:'Gastroenterologist',
  Stomach:'Gastroenterologist', Abdomen:'Gastroenterologist',
  Liver:'Gastroenterologist', Pancreas:'Gastroenterologist',
  'Small Intestine':'Gastroenterologist', Spleen:'Gastroenterologist',
  Kidney:'Nephrologist', Bladder:'Nephrologist',
  Uterus:'Gynecologist', Ovaries:'Gynecologist', Breast:'Gynecologist',
  Vulva:'Gynecologist', Groin:'Gynecologist',
  Shoulder:'Orthopedic', Arm:'Orthopedic', Elbow:'Orthopedic', Wrist:'Orthopedic',
  Hand:'Orthopedic', Fingers:'Orthopedic', Back:'Orthopedic', Spine:'Orthopedic',
  Hip:'Orthopedic', Thigh:'Orthopedic', Knee:'Orthopedic', Leg:'Orthopedic',
  Calf:'Orthopedic', Ankle:'Orthopedic', Foot:'Orthopedic', Toes:'Orthopedic',
  Bones:'Orthopedic', Muscles:'Orthopedic', Umbilicus:'General Physician',
  Waist:'General Physician', Teeth:'Dentist', Chin:'General Physician',
}
const getSpecialist = (p) => SPECIALIST_MAP[p] || 'General Physician'

const STEPS = ['Gender','Body Part','Doctor','Date & Time','Confirm']

export default function BookAppointment() {
  const { user } = useAuth()
  const { doctors, appointments, addAppointment } = useData()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState('')
  const [bodyPart, setBodyPart] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const specialist = bodyPart ? getSpecialist(bodyPart) : ''
  const parts = gender === 'male' ? MALE_PARTS : gender === 'female' ? FEMALE_PARTS : []
  const matchedDoctors = useMemo(() =>
    specialist ? doctors.filter(d => d.specialization === specialist) : doctors
  , [doctors, specialist])
  const doctor = doctors.find(d => d.id === doctorId)
  const today = new Date().toISOString().split('T')[0]
  const bookedSlots = appointments.filter(a => a.doctorId === doctorId && a.appointmentDate === date).map(a => a.timeSlot)
  const availableSlots = (doctor?.slots || []).filter(s => !bookedSlots.includes(s))

  const next = () => {
    if (step === 0 && !gender) return toast.warn('Please select gender type')
    if (step === 1 && !bodyPart) return toast.warn('Please select a body part')
    if (step === 2 && !doctorId) return toast.warn('Please select a doctor')
    if (step === 3 && (!date || !slot)) return toast.warn('Please pick date & time slot')
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => { setStep(s => Math.max(0, s - 1)) }

  const onConfirm = handleSubmit((data) => {
    if (!doctor) return
    const appt = {
      userId: user.uid, userEmail: user.email, userName: user.displayName || user.email,
      genderType: gender, bodyPart, specialist,
      doctorId, doctorName: doctor.name, doctorImage: doctor.image,
      fees: doctor.fees,
      appointmentDate: date, timeSlot: slot,
      problem: data.problem, description: data.description,
    }
    addAppointment(appt)
    toast.success('🎉 Appointment booked successfully!')
    nav('/payment', { state: { fees: doctor.fees, doctorName: doctor.name } })
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Book Appointment</h1>
        <p className="text-slate-500 mt-1">Find the right specialist for any body part</p>
      </div>

      {/* Step Wizard */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full grid place-items-center text-sm font-bold transition-all ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30' :
                'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {i < step ? <CheckCircle size={16}/> : i + 1}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${i === step ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mb-4 mx-1 transition-all ${i < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">

          {/* Step 0: Gender */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-center">Select Patient Type</h2>
              <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                  onClick={() => { setGender('male'); setBodyPart(''); }}
                  className={`p-8 rounded-2xl border-2 transition-all text-center ${gender === 'male' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                  <div className="text-6xl mb-3">👦</div>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white grid place-items-center mb-4`}>
                    <span style={{fontSize:32}}>♂</span>
                  </div>
                  <div className="text-xl font-bold">Human Boy</div>
                  <div className="text-sm text-slate-500 mt-1">Male body parts</div>
                  <div className="text-xs text-blue-600 mt-2 font-semibold">{MALE_PARTS.length} body parts available</div>
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                  onClick={() => { setGender('female'); setBodyPart(''); }}
                  className={`p-8 rounded-2xl border-2 transition-all text-center ${gender === 'female' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-pink-400'}`}>
                  <div className="text-6xl mb-3">👧</div>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white grid place-items-center mb-4`}>
                    <span style={{fontSize:32}}>♀</span>
                  </div>
                  <div className="text-xl font-bold">Human Girl</div>
                  <div className="text-sm text-slate-500 mt-1">Female body parts</div>
                  <div className="text-xs text-pink-600 mt-2 font-semibold">{FEMALE_PARTS.length} body parts available</div>
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 1: Body Part */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-2">
                Select Body Part
                <span className={`ml-2 chip ${gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {gender === 'male' ? '👦 Male' : '👧 Female'}
                </span>
              </h2>
              <p className="text-sm text-slate-500 mb-4">Click on the affected body part to find the right specialist</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {parts.map(p => (
                  <motion.button key={p} whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                    onClick={() => setBodyPart(p)}
                    className={`px-3 py-2.5 rounded-xl border-2 font-semibold text-xs transition-all ${
                      bodyPart === p
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    }`}>{p}</motion.button>
                ))}
              </div>
              {bodyPart && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center flex-shrink-0"><Stethoscope size={18}/></div>
                  <div>
                    <div className="text-xs text-slate-500">Selected Body Part</div>
                    <div className="font-bold">{bodyPart}</div>
                    <div className="text-sm text-indigo-600">Recommended: <strong>{getSpecialist(bodyPart)}</strong></div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 2: Doctor */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Choose Your Doctor</h2>
              {specialist && <p className="text-sm text-indigo-600 mb-4 font-semibold">Showing {specialist} specialists for <strong>{bodyPart}</strong></p>}
              {matchedDoctors.length === 0 && (
                <p className="text-sm text-slate-500 mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  No {specialist} found. Showing all available doctors.
                </p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(matchedDoctors.length ? matchedDoctors : doctors).filter(d => d.available !== false).map(d => (
                  <motion.button key={d.id} whileHover={{ y: -3 }} onClick={() => setDoctorId(d.id)}
                    className={`text-left rounded-2xl border-2 overflow-hidden transition-all ${
                      doctorId === d.id ? 'border-indigo-600 shadow-lg shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}>
                    <img src={d.image} alt={d.name} className="h-36 w-full object-cover object-top"/>
                    <div className="p-4 bg-white dark:bg-slate-800">
                      <div className="font-bold">{d.name}</div>
                      <div className="text-sm text-indigo-600 font-semibold">{d.specialization}</div>
                      <div className="text-xs text-slate-500 mt-1">{d.experience} yrs exp</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">₹{d.fees}</span>
                        {doctorId === d.id && <CheckCircle size={18} className="text-indigo-600"/>}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="label"><Calendar size={15} className="inline mr-1"/>Appointment Date</label>
                <input type="date" min={today} value={date} onChange={e => { setDate(e.target.value); setSlot('') }} className="input text-lg"/>
                {doctor && date && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Dr. {doctor.name}</div>
                    <div className="text-slate-500">Available on: {doctor.days?.join(', ')}</div>
                  </div>
                )}
              </div>
              <div>
                <label className="label"><Clock size={15} className="inline mr-1"/>Select Time Slot</label>
                {!date ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm text-slate-500">Please pick a date first</div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold">All slots booked for this date. Try another date.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map(s => (
                      <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                        onClick={() => setSlot(s)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          slot === s ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}>{s}</motion.button>
                    ))}
                  </div>
                )}
                {bookedSlots.length > 0 && (
                  <div className="mt-3 text-xs text-slate-400">{bookedSlots.length} slot(s) already booked</div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <form onSubmit={onConfirm} className="space-y-5">
              {/* Summary */}
              <div className="rounded-2xl p-5 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700">
                <h4 className="font-bold mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-indigo-600"/>Appointment Summary</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { l: 'Patient Type', v: gender === 'male' ? '👦 Human Boy' : '👧 Human Girl' },
                    { l: 'Body Part', v: bodyPart },
                    { l: 'Specialist', v: specialist },
                    { l: 'Doctor', v: doctor?.name },
                    { l: 'Date', v: date },
                    { l: 'Time Slot', v: slot },
                    { l: 'Consultation Fee', v: `₹${doctor?.fees}` },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex gap-2">
                      <span className="text-slate-500 flex-shrink-0">{l}:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{v}</span>
                    </div>
                  ))}
                </div>
              </div>





              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">Problem Type </label>
                <input  className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-400" placeholder="e.g. Persistent pain, Rash, Headache..." {...register('problem', { required: 'Please describe your problem' })}/>
                {errors.problem && <p className="text-xs text-rose-500 mt-1">{errors.problem.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Description </label>
                <textarea  className="w-full min-h-[100px] rounded-xl border border-purple-400/30 bg-slate-900/60 text-white px-4 py-3 outline-none transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 placeholder:text-slate-400" placeholder="Describe your symptoms in detail..." {...register('description', { required: 'Please add description' })}/>
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
              </div>

              <button type="submit" className="w-full py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02]"
  style={{
    background:
      "linear-gradient(90deg,#2563eb,#06b6d4,#8b5cf6)",
    boxShadow:
      "0 10px 25px rgba(59,130,246,.35)"
  }}>
                <Calendar size={18}/> Confirm & Proceed to Payment ₹{doctor?.fees}
              </button>


            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={back} disabled={step === 0}  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-30"
    style={{
      background: "linear-gradient(135deg,#ef4444,#dc2626)",
      boxShadow: "0 8px 20px rgba(239,68,68,.35)"
    }}><ArrowLeft size={16}/> Back</button>
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
      style={{
        background: "linear-gradient(135deg,#2563eb,#06b6d4)",
        boxShadow: "0 8px 20px rgba(37,99,235,.35)"
      }}>Next <ArrowRight size={16}/></button>
        )}
      </div>
    </div>
  )
}
