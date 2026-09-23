export default function EmptyState({ title = 'Nothing here', subtitle }) {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-2">🗒️</div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}