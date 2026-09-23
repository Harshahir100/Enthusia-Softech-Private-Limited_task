import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const media = () => {
    if (blog.mediaType === 'video') {
      return (
        <video
          src={blog.mediaUrl}
          className="w-full h-48 object-cover"
          muted
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => e.currentTarget.pause()}
        />
      );
    }
    if (blog.mediaType === 'url') {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-4xl">
          🔗
        </div>
      );
    }
    return (
      <img
        src={blog.mediaUrl}
        alt={blog.title}
        className="w-full h-48 object-cover"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image')}
      />
    );
  };

  return (
    <Link to={`/blog/${blog._id}`} className="card overflow-hidden hover:shadow-md transition">
      {media()}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-700 uppercase font-semibold">
            {blog.mediaType}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-slate-800 line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{blog.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
          <span>❤️ {blog.likes || 0}</span>
          <span>💬 {blog.commentsCount || 0}</span>
          <span>👁️ {blog.views || 0}</span>
        </div>
      </div>
    </Link>
  );
}