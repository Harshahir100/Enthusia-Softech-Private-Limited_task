import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-700">
          📝 DynamicBlog
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-700'
            }
          >
            Home
          </NavLink>
          <NavLink to="/admin" className="text-slate-600 hover:text-brand-700">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}