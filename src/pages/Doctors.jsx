import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { motion } from 'framer-motion'
import { Calendar, Clock, Search, GraduationCap, Star } from 'lucide-react'

export default function Doctors() {
  const { doctors } = useData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))]
  const list = doctors.filter(d =>
    (filter === 'All' || d.specialization === filter) &&
    (!query || d.name.toLowerCase().includes(query.toLowerCase()) || d.specialization.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Our Medical Team</span>
        <h1 className="text-4xl font-extrabold">All Doctors</h1>
        <p className="text-slate-500 mt-2">Meet our {doctors.length} certified specialist doctors</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-slate-400"/>
          <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Search doctor or specialty..." value={query} onChange={e => setQuery(e.target.value)}/>
        </div>
        <div className="flex flex-wrap gap-2">
          {specializations.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${filter === s ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Doctors', value: doctors.length, color: 'from-indigo-500 to-blue-500' },
          { label: 'Available Now', value: doctors.filter(d=>d.available!==false).length, color: 'from-emerald-500 to-teal-500' },
          { label: 'Specializations', value: specializations.length - 1, color: 'from-violet-500 to-purple-500' },
          { label: 'Showing', value: list.length, color: 'from-cyan-500 to-blue-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white grid place-items-center font-extrabold text-lg flex-shrink-0`}>{value}</div>
            <div className="text-xs text-slate-500 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Doctors Grid - 3 per row */}
      {list.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold">No doctors found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all">
              {/* Full doctor image */}
              <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover object-center"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                />
                <div style={{display:'none'}} className="w-full h-full items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-cyan-50">👨‍⚕️</div>
                <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${d.available !== false ? 'bg-emerald-100/90 text-emerald-700' : 'bg-rose-100/90 text-rose-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${d.available !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}/>
                  {d.available !== false ? 'Available' : 'Unavailable'}
                </div>
                {d.rating && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100/90 text-amber-700 text-xs font-bold backdrop-blur-sm">
                    <Star size={11} fill="currentColor"/>{d.rating}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{d.name}</h3>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">{d.specialization}</p>

                {/* Education/Course */}
                {d.education && (
                  <div className="flex items-start gap-2 mb-2 text-xs text-slate-500">
                    <GraduationCap size={13} className="flex-shrink-0 mt-0.5 text-indigo-400"/>
                    <span className="line-clamp-2">{d.education}</span>
                  </div>
                )}

                {/* About */}
                {d.about && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{d.about}</p>
                )}

                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="flex items-center gap-1 text-slate-500"><Clock size={13}/>{d.experience} yrs exp</span>
                  <span className="font-extrabold text-xl text-slate-800 dark:text-slate-100">₹{d.fees}</span>
                </div>

                <Link to="/book-appointment"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all text-sm">
                  <Calendar size={15}/>Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
