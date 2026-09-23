import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios.js';
import BlogCard from '../components/BlogCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = async (page = 1, q = search) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/blogs', { params: { page, limit: 9, search: q } });
      setBlogs(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, '');
    // eslint-disable-next-line
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    fetchBlogs(1, search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Latest Blogs</h1>
        <p className="text-slate-500 mt-1">Discover stories, media and ideas.</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 mb-6">
        <input
          className="input"
          placeholder="Search blogs by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="card p-6 text-red-600">{error}</div>
      ) : blogs.length === 0 ? (
        <EmptyState title="No blogs yet" subtitle="Check back soon!" />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
          <Pagination
            page={meta.page}
            pages={meta.pages}
            onChange={(p) => fetchBlogs(p, search)}
          />
        </>
      )}
    </div>
  );
}