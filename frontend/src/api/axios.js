import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://enthusia-softech-private-limited-ta-kappa.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blog_admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API ERROR:', err);
    console.error('API URL:', err.config?.baseURL);
    console.error('REQUEST URL:', err.config?.url);
    console.error('RESPONSE:', err.response?.data);

    if (err.response?.status === 401) {
      localStorage.removeItem('blog_admin_token');
      localStorage.removeItem('blog_admin_profile');

      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.details?.[0] ||
  err?.message ||
  'Something went wrong';

export default api;