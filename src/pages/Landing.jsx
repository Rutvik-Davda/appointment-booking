import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext.jsx'
import { Calendar, ShieldCheck, Clock, Star, HeartPulse, Activity, Stethoscope, Users, ArrowRight, CheckCircle, MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const SPECIALTIES = [
  { name: 'General Physician', img: '/images/doctors/doctor-1.jpg' },
  { name: 'Gynecologist',      img: '/images/doctors/doctor-10.jpg' },
  { name: 'Dermatologist',     img: '/images/doctors/doctor-9.jpg' },
  { name: 'Pediatrician',      img: '/images/doctors/doctor-2.jpg' },
  { name: 'Neurologist',       img: '/images/doctors/doctor-4.jpg' },
  { name: 'Gastroenterologist',img: '/images/doctors/doctor-7.jpg' },
]

export default function Landing() {
  const { doctors } = useData()
  const [cf, setCf] = useState({ name: '', email: '', msg: '' })

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
              ⭐ Trusted by 50,000+ patients
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Book a Doctor<br/>
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Appointment
              </span><br/>in 60 seconds
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-lg">
              Find top specialists by body part, book your slot instantly, and manage everything from a beautiful dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book-appointment" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
                <Calendar size={18} /> Book Appointment
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-indigo-300 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 transition-all">
                Create Account <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex gap-8">
              {[{ n: '50K+', l: 'Patients' }, { n: '200+', l: 'Doctors' }, { n: '4.9★', l: 'Rating' }].map(({ n, l }) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">{n}</div>
                  <div className="text-xs text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .2 }} className="relative hidden md:block">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-700">
              <img src="/images/doctors/doctor-8.jpg" alt="Doctor" className="rounded-2xl w-full h-80 object-cover object-top" />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white"><ShieldCheck size={18} /></div>
                <div className="text-sm"><div className="font-bold">100% Verified</div><div className="text-slate-500">Certified doctors</div></div>
              </div>
              <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="text-xs font-bold text-indigo-600">🗓️ 200+ Slots Available Today</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Find by Speciality</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Browse Medical Specialties</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Simply browse through our list of trusted doctors.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIALTIES.map(s => (
              <Link key={s.name} to="/book-appointment">
                <motion.div whileHover={{ y: -6 }} className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:shadow-md transition cursor-pointer">
                  <img src={s.img} alt={s.name} className="w-16 h-16 rounded-full object-cover object-top border-2 border-indigo-100" />
                  <span className="text-xs font-bold text-center leading-tight">{s.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services-section" className="bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Our Services</h2>
            <p className="text-slate-500 mt-2">Comprehensive healthcare features for modern patients</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HeartPulse, t: '24/7 Care',       d: 'Round-the-clock medical support', color: 'from-rose-500 to-pink-500' },
              { icon: Calendar,   t: 'Easy Booking',    d: 'Book appointments in seconds',     color: 'from-indigo-500 to-blue-500' },
              { icon: Activity,   t: 'Health Tracking', d: 'Monitor your appointment history', color: 'from-violet-500 to-purple-500' },
              { icon: Stethoscope,t: 'Expert Doctors',  d: 'Top-rated certified specialists',  color: 'from-cyan-500 to-teal-500' },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white grid place-items-center mb-4`}><s.icon size={22}/></div>
                <h3 className="font-bold text-lg mb-1">{s.t}</h3>
                <p className="text-sm text-slate-500">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <img className="rounded-3xl shadow-xl h-80 w-full object-cover object-top" src="/images/doctors/doctor-5.jpg" alt="About" />
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">About MediCare</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your Trusted Healthcare Partner</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">MediCare connects patients with the right specialist for every body part. Our innovative booking flow makes finding the right doctor effortless.</p>
            <ul className="mt-6 space-y-3">
              {['Body-part based specialist matching', 'Real-time slot availability', 'Firebase secure authentication', 'Payment management system', 'Dark mode dashboard', 'Appointment calendar view'].map(x => (
                <li key={x} className="flex items-center gap-2 text-sm"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors-section" className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Top Rated</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Meet Our Doctors</h2>
            <p className="text-slate-500 mt-2">Certified experts at your service</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 6).map(d => (
              <motion.div key={d.id} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-cyan-50">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover object-top" />
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${d.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${d.available ? 'bg-emerald-500' : 'bg-rose-500'}`}/>
                    {d.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{d.name}</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{d.specialization}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={13}/> {d.experience} yrs exp</span>
                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100">₹{d.fees}</span>
                  </div>
                  <Link to="/book-appointment" className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm">
                    <Calendar size={14}/> Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="works-section" className="bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Simple Steps</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">How It Works</h2>
            <p className="text-slate-500 mt-2">Book your appointment in 4 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n:1, icon:'🔍', t:'Find Doctor',          d:'Search by specialty or body part' },
              { n:2, icon:'👤', t:'Select Gender & Part', d:'Choose your gender and affected area' },
              { n:3, icon:'📅', t:'Pick a Slot',          d:'Choose date and available time' },
              { n:4, icon:'✅', t:'Book & Pay',           d:'Confirm and pay securely' },
            ].map(s => (
              <div key={s.n} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-black text-lg grid place-items-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">{s.n}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-1">{s.t}</h3>
                <p className="text-sm text-slate-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Patient Reviews</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">What Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n:'Sarah J.',  r:5, t:'Incredibly easy to book. Found a great dermatologist in minutes!' },
              { n:'Ahmed K.',  r:5, t:'The body-part selection feature is genius. Got matched with the perfect specialist.' },
              { n:'Maria L.',  r:5, t:'Clean, fast, professional. Best healthcare app I have used. Love the calendar view!' },
            ].map((t,i)=>(
              <motion.div key={i} whileHover={{ y:-4 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex text-amber-500 mb-3">{Array(t.r).fill(0).map((_,k)=><Star key={k} size={16} fill="currentColor"/>)}</div>
                <p className="italic text-slate-600 dark:text-slate-300">"{t.t}"</p>
                <p className="mt-4 font-semibold text-sm">— {t.n}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              {[
                { I:Phone,  t:'+91 98765 00000',        s:'Mon–Sat, 9AM–6PM', color:'bg-indigo-100 text-indigo-600' },
                { I:Mail,   t:'support@medicare.com',   s:'Reply within 24 hours', color:'bg-emerald-100 text-emerald-600' },
                { I:MapPin, t:'Ahmedabad, Gujarat, India', s:'India – 380015', color:'bg-amber-100 text-amber-600' },
              ].map(({I,t,s,color},i)=>(
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className={`w-12 h-12 rounded-xl grid place-items-center flex-shrink-0 ${color}`}><I size={20}/></div>
                  <div><div className="font-semibold">{t}</div><div className="text-sm text-slate-500">{s}</div></div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-lg mb-5">Send a Message</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); setCf({ name:'', email:'', msg:'' }) }}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Name</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={cf.name} onChange={e=>setCf(p=>({...p,name:e.target.value}))} placeholder="Your name" required/></div>
                  <div><label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Email</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" value={cf.email} onChange={e=>setCf(p=>({...p,email:e.target.value}))} placeholder="you@example.com" required/></div>
                  <div><label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-200">Message</label><textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" value={cf.msg} onChange={e=>setCf(p=>({...p,msg:e.target.value}))} placeholder="How can we help?" required/></div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg transition-all"><MessageCircle size={16}/>Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"/><div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"/></div>
          <h2 className="text-3xl md:text-4xl font-extrabold relative z-10">Ready to Book Your Appointment?</h2>
          <p className="mt-3 text-white/80 text-lg relative z-10">Join thousands of patients who trust MediCare.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/register" className="px-8 py-3 rounded-xl font-bold bg-white text-indigo-600 hover:-translate-y-1 hover:shadow-lg transition-all flex items-center gap-2">Register Free <ArrowRight size={16}/></Link>
            <Link to="/book-appointment" className="px-8 py-3 rounded-xl font-bold border-2 border-white/40 text-white hover:bg-white/10 transition-all flex items-center gap-2"><Calendar size={16}/>Book Appointment</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
