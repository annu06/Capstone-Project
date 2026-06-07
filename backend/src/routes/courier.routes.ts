import { Router } from 'express';
import * as ctrl from '../controllers/courier.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

export const courierRoutes = Router();

courierRoutes.use(authenticate);
courierRoutes.get('/', ctrl.list);
courierRoutes.get('/tracking/:trackingId', ctrl.getByTrackingId);
courierRoutes.get('/:id', ctrl.getById);
courierRoutes.post('/', authorize('Shipper'), ctrl.create);
courierRoutes.put('/:id', authorize('Shipper'), ctrl.update);
courierRoutes.delete('/:id', authorize('Shipper'), ctrl.cancel);
