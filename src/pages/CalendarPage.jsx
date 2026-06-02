import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const COLORS = { pending:'#f59e0b', approved:'#3b82f6', rejected:'#ef4444', completed:'#10b981' }

export default function CalendarPage() {
  const { appointments } = useData()
  const { user } = useAuth()
  const list = user?.role==='admin' ? appointments : appointments.filter(a=>a.userId===user?.uid)

  const events = list.map(a => ({
    id: a.id,
    title: `${a.doctorName} • ${a.bodyPart||''}`,
    start: a.appointmentDate,
    backgroundColor: COLORS[a.status]||'#6366f1',
    borderColor: COLORS[a.status]||'#6366f1',
    extendedProps: a,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Appointment Calendar</h1>
        <p className="text-slate-500">{user?.role==='admin' ? 'All appointments' : 'Your appointments'}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[['pending','#f59e0b','Pending'],['approved','#3b82f6','Approved'],['completed','#10b981','Completed'],['rejected','#ef4444','Rejected']].map(([s,c,l])=>(
          <div key={s} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:c}}/>{l}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
          height="auto"
          events={events}
          eventClick={(info) => {
            const p = info.event.extendedProps
            alert(`Patient: ${p.userName||p.userEmail||'—'}\nDoctor: ${p.doctorName}\nBody Part: ${p.bodyPart}\nSpecialist: ${p.specialist}\nDate: ${p.appointmentDate} ${p.timeSlot}\nStatus: ${p.status}`)
          }}
        />
      </div>
    </div>
  )
}
