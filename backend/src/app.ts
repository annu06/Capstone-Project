import 'dotenv/config';
import express from 'express';
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

// CORS: Allow all origins for now (can restrict later)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Correlation-Id, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
});
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
