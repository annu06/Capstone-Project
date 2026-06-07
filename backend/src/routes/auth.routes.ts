import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/login', ctrl.login);
authRoutes.post('/refresh', ctrl.refresh);
authRoutes.post('/logout', authenticate, ctrl.logout);
authRoutes.get('/me', authenticate, ctrl.me);
