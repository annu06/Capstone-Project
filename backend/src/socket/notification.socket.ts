import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { logger } from '../utils/logger';

export function setupNotificationSocket(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as JwtPayload;
    logger.info(`Socket connected: ${user.userId} (${user.role})`);

    socket.join(`user:${user.userId}`);

    socket.on('joinTracking', (trackingId: string) => {
      socket.join(`tracking:${trackingId}`);
      logger.debug(`${user.userId} joined tracking room: ${trackingId}`);
    });

    socket.on('leaveTracking', (trackingId: string) => {
      socket.leave(`tracking:${trackingId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${user.userId}`);
    });
  });
}
