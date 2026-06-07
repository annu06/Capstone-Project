import { Request, Response, NextFunction } from 'express';
import * as trackingService from '../services/tracking.service';

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { trackingId } = req.query as { trackingId: string };
    if (!trackingId) {
      res.status(400).json({ success: false, message: 'trackingId is required' });
      return;
    }
    const result = await trackingService.searchByTrackingId(trackingId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
