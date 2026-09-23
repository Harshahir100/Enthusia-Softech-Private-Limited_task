import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Pagination from '../../components/Pagination.jsx';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (page = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await api.get('/blogs', { params: { page, limit: 10, search: q } });
      setBlogs(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, '');
    // eslint-disable-next-line
  }, []);

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"? This will also delete its comments.`)) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Blogs</h1>
          <p className="text-slate-500 text-sm">Create, edit and delete blogs.</p>
        </div>
        <Link to="/admin/blogs/create" className="btn-primary">+ New Blog</Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(1, search);
        }}
        className="flex gap-2"
      >
        <input
          className="input"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary">Search</button>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="card p-6 text-red-600">{error}</div>
      ) : blogs.length === 0 ? (
        <EmptyState title="No blogs" subtitle="Create your first blog post." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Likes</th>
                  <th className="text-left px-4 py-3">Comments</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                      {b.title}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600">{b.mediaType}</td>
                    <td className="px-4 py-3">{b.likes}</td>
                    <td className="px-4 py-3">{b.commentsCount}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/blog/${b._id}`}
                        className="text-slate-600 hover:text-brand-700"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${b._id}`}
                        className="text-brand-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(b._id, b.title)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={meta.page} pages={meta.pages} onChange={(p) => load(p, search)} />
        </>
      )}
    </div>
  );
}