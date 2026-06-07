import { Router } from 'express';
import * as ctrl from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';

export const transactionRoutes = Router();

transactionRoutes.use(authenticate);
transactionRoutes.get('/:trackingId', ctrl.listByTracking);
transactionRoutes.post('/:trackingId', ctrl.add);
