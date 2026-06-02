import { Link } from 'react-router-dom'
import { Stethoscope, Github, Twitter, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white"><Stethoscope size={18}/></span>
            <span className="grad-text">MediBook</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">Modern appointment booking platform — find specialists by body part, book slots, manage your health journey.</p>
          <div className="flex gap-3 mt-4 text-slate-400">
            <Github size={20} className="cursor-pointer hover:text-indigo-600 transition"/>
            <Twitter size={20} className="cursor-pointer hover:text-indigo-600 transition"/>
            <Mail size={20} className="cursor-pointer hover:text-indigo-600 transition"/>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2 text-slate-500">
            {[{to:'/',l:'Home'},{to:'/book-appointment',l:'Book Appointment'},{to:'/dashboard',l:'Dashboard'},{to:'/calendar',l:'Calendar'}].map(({to,l})=>(
              <li key={to}><Link to={to} className="hover:text-indigo-600 transition">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Appointment Features</h4>
          <ul className="text-sm space-y-2 text-slate-500">
            {['Instant slot booking','Body-part specialist matching','Appointment calendar','Payment management','Dark mode dashboard','Firebase authentication'].map(f=>(
              <li key={f} className="flex items-center gap-1.5"><CheckCircle size={13} className="text-emerald-500 flex-shrink-0"/>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="text-sm space-y-3 text-slate-500">
            <li className="flex items-center gap-2"><Phone size={14} className="text-indigo-500"/>+91 98765 00000</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-indigo-500"/>support@medibook.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/>Ahmedabad, Gujarat, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MediBook Healthcare. All rights reserved. | Built with React + Firebase
      </div>
    </footer>
  )
}
