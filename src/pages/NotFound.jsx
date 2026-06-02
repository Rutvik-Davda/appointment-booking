import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center text-center px-4">
      <div>
        <div className="text-8xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">404</div>
        <div className="text-2xl font-bold mt-4 text-slate-800 dark:text-slate-100">Page not found</div>
        <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg transition-all">Go Home</Link>
      </div>
    </div>
  )
}
