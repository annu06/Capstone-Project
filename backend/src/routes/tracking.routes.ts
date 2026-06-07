import { Router } from 'express';
import * as ctrl from '../controllers/tracking.controller';

export const trackingRoutes = Router();

trackingRoutes.get('/search', ctrl.search);
