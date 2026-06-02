import { createContext, useContext, useEffect, useState } from 'react'
import { seedDoctors } from '../data/seed.js'

const DataContext = createContext()
export const useData = () => useContext(DataContext)

const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb } }

export function DataProvider({ children }) {
  const [doctors,      setDoctors]  = useState(() => load('mb_doctors', null) || seedDoctors)
  const [appointments, setAppts]    = useState(() => load('mb_appointments', []))
  const [payments,     setPayments] = useState(() => load('mb_payments', []))

  // Persist to localStorage whenever state changes
  useEffect(() => { save('mb_doctors',      doctors)      }, [doctors])
  useEffect(() => { save('mb_appointments', appointments) }, [appointments])
  useEffect(() => { save('mb_payments',     payments)     }, [payments])

  const addDoctor    = (d)     => setDoctors(s => [...s, { id:'d-'+Date.now(), available:true, rating:4.5, ...d }])
  const updateDoctor = (id,p)  => setDoctors(s => s.map(d => d.id===id ? {...d,...p} : d))
  const deleteDoctor = (id)    => setDoctors(s => s.filter(d => d.id!==id))

  const addAppointment    = (a) => {
    const n = { id:'a-'+Date.now(), status:'pending', paid:false, createdAt:Date.now(), ...a }
    setAppts(s => [...s, n])
    return n
  }
  const updateAppointment = (id,p) => setAppts(s => s.map(a => a.id===id ? {...a,...p} : a))
  const deleteAppointment = (id)   => setAppts(s => s.filter(a => a.id!==id))

  const addPayment = (p) => setPayments(s => [...s, { id:'p-'+Date.now(), createdAt:Date.now(), ...p }])

  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a=>a.status==='pending').length,
    approved:  appointments.filter(a=>a.status==='approved').length,
    rejected:  appointments.filter(a=>a.status==='rejected').length,
    completed: appointments.filter(a=>a.status==='completed').length,
    revenue:   payments.reduce((s,p)=>s+(Number(p.amount)||0),0),
    doctors:   doctors.length,
  }

  return (
    <DataContext.Provider value={{
      doctors, addDoctor, updateDoctor, deleteDoctor,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      payments, addPayment, stats,
    }}>
      {children}
    </DataContext.Provider>
  )
}
