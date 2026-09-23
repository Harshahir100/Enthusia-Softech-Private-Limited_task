import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItem = ({ isActive }) =>
  `block px-3 py-2 rounded-lg text-sm ${
    isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[200px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="font-medium text-slate-800 truncate">{admin?.email || 'admin'}</div>
        </div>
        <nav className="card p-2 space-y-1">
          <NavLink to="/admin" end className={navItem}>Dashboard</NavLink>
          <NavLink to="/admin/blogs" end className={navItem}>Blogs</NavLink>
          <NavLink to="/admin/blogs/create" className={navItem}>Create Blog</NavLink>
        </nav>
        <button onClick={handleLogout} className="btn-secondary w-full">Logout</button>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}