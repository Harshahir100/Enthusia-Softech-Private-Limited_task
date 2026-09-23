import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';

const Stat = ({ label, value, icon }) => (
  <div className="card p-5">
    <div className="text-2xl">{icon}</div>
    <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="card p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your blog content.</p>
        </div>
        <Link to="/admin/blogs/create" className="btn-primary">+ New Blog</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Total Blogs" value={stats.totalBlogs} icon="📝" />
        <Stat label="Total Comments" value={stats.totalComments} icon="💬" />
        <Stat label="Total Likes" value={stats.totalLikes} icon="❤️" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold mb-3">By Media Type</h2>
          {stats.byMediaType.length === 0 ? (
            <p className="text-sm text-slate-500">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.byMediaType.map((row) => (
                <li key={row._id} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-700">{row._id}</span>
                  <span className="font-semibold">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-3">Recent Blogs</h2>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-slate-500">No blogs yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.recent.map((b) => (
                <li key={b._id} className="text-sm flex justify-between gap-2">
                  <span className="truncate text-slate-700">{b.title}</span>
                  <span className="text-slate-400 shrink-0">❤️ {b.likes}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}