export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-12 text-slate-500">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-brand-600 mr-3" />
      {label}
    </div>
  );
}