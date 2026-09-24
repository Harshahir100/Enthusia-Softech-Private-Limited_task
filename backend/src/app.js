import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.set('trust proxy', 1);

// =========================
// SECURITY
// =========================
app.use(helmet());

// =========================
// CORS
// =========================
app.use(
  cors({
    origin: env.CLIENT_URL.split(',').map((s) => s.trim()),
    credentials: true,
  })
);

// =========================
// BODY PARSER
// =========================
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// =========================
// LOGGER
// =========================
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// =========================
// RATE LIMIT
// =========================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// =========================
// ROOT ROUTE
// =========================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running 🚀',
  });
});

// =========================
// HEALTH CHECK
// =========================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API healthy',
    time: new Date().toISOString(),
  });
});

// =========================
// API ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// =========================
// 404 HANDLER
// =========================
app.use(notFound);

// =========================
// ERROR HANDLER
// =========================
app.use(errorHandler);

export default app;