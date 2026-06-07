import { Request, Response, NextFunction } from 'express';
import * as notifService from '../services/notification.service';
import { JwtPayload } from '../types';

function user(req: Request): JwtPayload { return (req as any).user; }

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifs = await notifService.getUserNotifications(user(req).userId);
    res.json({ success: true, data: notifs });
  } catch (err) { next(err); }
}

export async function unreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await notifService.getUnreadCount(user(req).userId);
    res.json({ success: true, data: { count } });
  } catch (err) { next(err); }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await notifService.markAsRead(req.params.id, user(req).userId);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await notifService.markAllAsRead(user(req).userId);
    res.json({ success: true });
  } catch (err) { next(err); }
}
