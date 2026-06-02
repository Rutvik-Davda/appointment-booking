export default function EmptyState({ title='No data found', desc='Nothing to show here yet.', icon='📋' }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-3 opacity-50">{icon}</div>
      <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{desc}</p>
    </div>
  )
}
