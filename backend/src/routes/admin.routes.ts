import { Router } from 'express';
import * as ctrl from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

export const adminRoutes = Router();

adminRoutes.use(authenticate, authorize('Admin'));
adminRoutes.get('/users', ctrl.getUsers);
adminRoutes.get('/users/:id', ctrl.getUserById);
adminRoutes.post('/users', ctrl.createUser);
adminRoutes.put('/users/:id', ctrl.updateUser);
adminRoutes.delete('/users/:id', ctrl.deactivateUser);
adminRoutes.get('/audit-log', ctrl.getAuditLog);
adminRoutes.get('/courier-search', ctrl.courierSearch);
adminRoutes.get('/tampered-couriers', ctrl.getTamperedCouriers);
