import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import Loader from '../components/Loader.jsx';

const getClientId = () => {
  let id = localStorage.getItem('blog_client_id');
  if (!id) {
    id = `c_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem('blog_client_id', id);
  }
  return id;
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [form, setForm] = useState({ author: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [shared, setShared] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [b, c] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get(`/blogs/${id}/comments`),
        ]);
        setBlog(b.data.data);
        setComments(c.data.data);
        setLiked(b.data.data.likedBy?.includes(getClientId()) || false);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleLike = async () => {
    try {
      setLikeBusy(true);
      const { data } = await api.post(`/blogs/${id}/like`, { clientId: getClientId() });
      setLiked(data.data.liked);
      setBlog((prev) => ({ ...prev, likes: data.data.likes }));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLikeBusy(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog.title, text: blog.description, url });
        setShared('Shared!');
      } else {
        await navigator.clipboard.writeText(url);
        setShared('Link copied!');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShared('Link copied!');
      } catch {
        setShared('Could not share');
      }
    }
    setTimeout(() => setShared(''), 2000);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/blogs/${id}/comments`, form);
      setComments([data.data, ...comments]);
      setForm({ author: '', text: '' });
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading blog..." />;
  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card p-6 text-red-600">{error}</div>
        <button className="btn-secondary mt-4" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-brand-600 hover:underline">← Back to blogs</Link>

      <article className="card mt-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-700 uppercase font-semibold">
              {blog.mediaType}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(blog.createdAt).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{blog.title}</h1>

          <div className="mt-4 rounded-lg overflow-hidden bg-slate-100">
            {blog.mediaType === 'video' ? (
              <video src={blog.mediaUrl} controls className="w-full max-h-[520px]" />
            ) : blog.mediaType === 'url' ? (
              <a
                href={blog.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="block p-8 text-center text-brand-700 hover:underline break-all"
              >
                🔗 {blog.mediaUrl}
              </a>
            ) : (
              <img
                src={blog.mediaUrl}
                alt={blog.title}
                className="w-full max-h-[520px] object-contain bg-black/5"
                onError={(e) =>
                  (e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Media')
                }
              />
            )}
          </div>

          <p className="mt-6 text-slate-700 whitespace-pre-line leading-relaxed">
            {blog.description}
          </p>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <button
              onClick={toggleLike}
              disabled={likeBusy}
              className={liked ? 'btn-primary' : 'btn-secondary'}
            >
              {liked ? '❤️ Liked' : '🤍 Like'} · {blog.likes}
            </button>
            <button onClick={share} className="btn-secondary">
              🔗 Share
            </button>
            {shared && <span className="text-sm text-green-600">{shared}</span>}
            <span className="text-sm text-slate-500 ml-auto">
              👁️ {blog.views} views · 💬 {comments.length} comments
            </span>
          </div>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>

        <form onSubmit={submitComment} className="card p-4 mb-4 space-y-3">
          <div>
            <label className="label">Your name</label>
            <input
              className="input"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Jane Doe"
              required
              minLength={2}
              maxLength={60}
            />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              className="input min-h-[80px]"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Share your thoughts..."
              required
              maxLength={500}
            />
          </div>
          <button className="btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c._id} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800">{c.author}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700 text-sm whitespace-pre-line">{c.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}