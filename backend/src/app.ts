import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRoutes } from './routes/auth.routes';
import { courierRoutes } from './routes/courier.routes';
import { transactionRoutes } from './routes/transaction.routes';
import { trackingRoutes } from './routes/tracking.routes';
import { adminRoutes } from './routes/admin.routes';
import { notificationRoutes } from './routes/notification.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { correlationIdMiddleware } from './middleware/correlationId.middleware';
import { setupNotificationSocket } from './socket/notification.socket';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  if (!origin) return callback(null, true);
  const frontendUrl = process.env.FRONTEND_URL || '';
  if (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app') ||
    (frontendUrl && origin === frontendUrl)
  ) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

const io = new Server(httpServer, {
  cors: { origin: corsOrigin, credentials: true },
});

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(correlationIdMiddleware);
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);
setupNotificationSocket(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

export { app, io };
