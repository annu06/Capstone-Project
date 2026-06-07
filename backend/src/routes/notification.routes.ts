import { Router } from 'express';
import * as ctrl from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);
notificationRoutes.get('/', ctrl.list);
notificationRoutes.get('/unread-count', ctrl.unreadCount);
notificationRoutes.put('/:id/read', ctrl.markRead);
notificationRoutes.put('/mark-all-read', ctrl.markAllRead);
