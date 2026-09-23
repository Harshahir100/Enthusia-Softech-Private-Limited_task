import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';

const empty = { title: '', description: '', mediaType: 'image', mediaUrl: '' };

export default function BlogForm({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(edit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        const { title, description, mediaType, mediaUrl } = data.data;
        setForm({ title, description, mediaType, mediaUrl });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [edit, id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (edit) await api.put(`/blogs/${id}`, form);
      else await api.post('/blogs', form);
      navigate('/admin/blogs');
    } catch (err) {
      const msg = getErrorMessage(err);
      const details = err?.response?.data?.details;
      setError(details?.length ? `${msg}: ${details.join(', ')}` : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {edit ? 'Edit Blog' : 'Create Blog'}
      </h1>
      <p className="text-slate-500 text-sm mb-5">
        Provide a title, description and media for your blog post.
      </p>

      {error && (
        <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            name="title"
            className="input"
            value={form.title}
            onChange={onChange}
            required
            minLength={3}
            maxLength={150}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="input min-h-[140px]"
            value={form.description}
            onChange={onChange}
            required
            minLength={10}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Media Type</label>
            <select name="mediaType" className="input" value={form.mediaType} onChange={onChange}>
              <option value="image">Image</option>
              <option value="gif">GIF</option>
              <option value="video">Video</option>
              <option value="url">URL</option>
            </select>
          </div>
          <div>
            <label className="label">Media URL</label>
            <input
              name="mediaUrl"
              className="input"
              value={form.mediaUrl}
              onChange={onChange}
              required
              placeholder="https://..."
            />
          </div>
        </div>

        {form.mediaUrl && (
          <div>
            <label className="label">Preview</label>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              {form.mediaType === 'video' ? (
                <video src={form.mediaUrl} controls className="w-full max-h-72" />
              ) : form.mediaType === 'url' ? (
                <div className="p-6 text-center text-brand-700 break-all">{form.mediaUrl}</div>
              ) : (
                <img
                  src={form.mediaUrl}
                  alt="preview"
                  className="w-full max-h-72 object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : edit ? 'Update Blog' : 'Create Blog'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/blogs')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}