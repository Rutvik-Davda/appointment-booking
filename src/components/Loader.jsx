export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"/>
        <p className="text-slate-500 font-semibold">Loading MediCare...</p>
      </div>
    </div>
  )
}
