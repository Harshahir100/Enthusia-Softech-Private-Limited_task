import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import BlogDetail from './pages/BlogDetail.jsx';

import Login from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import BlogList from './pages/admin/BlogList.jsx';
import BlogForm from './pages/admin/BlogForm.jsx';

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/create" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm edit />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-slate-800">404</h1>
                <p className="text-slate-500 mt-2">Page not found.</p>
              </div>
            }
          />
        </Routes>
      </div>
      <footer className="text-center text-xs text-slate-400 py-6">
        © {new Date().getFullYear()} DynamicBlog · MERN Stack
      </footer>
    </div>
  );
}