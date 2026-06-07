import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as auditService from '../services/auditTrail.service';
import * as blockchainService from '../services/blockchain.service';
import * as courierService from '../services/courier.service';
import { JwtPayload } from '../types';

function user(req: Request): JwtPayload { return (req as any).user; }

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getUsers(req.query as any);
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = await userService.getUserById(req.params.id);
    res.json({ success: true, data: u });
  } catch (err) { next(err); }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const created = await userService.createUser(req.body);
    await auditService.recordAction({
      actionType: 'UserCreate',
      userId: u.userId,
      details: `User created: ${created.email}`,
    });
    res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const updated = await userService.updateUser(req.params.id, req.body);
    await auditService.recordAction({
      actionType: 'UserUpdate',
      userId: u.userId,
      details: `User updated: ${updated.email}`,
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    await userService.deactivateUser(req.params.id);
    await auditService.recordAction({
      actionType: 'UserDeactivate',
      userId: u.userId,
      details: `User deactivated: ${req.params.id}`,
    });
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) { next(err); }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await auditService.getAuditLog({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
    } as any);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function courierSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { trackingId } = req.query as { trackingId: string };
    if (!trackingId) {
      res.status(400).json({ success: false, message: 'trackingId is required' });
      return;
    }
    const courier = await courierService.getCourierByTrackingId(trackingId);
    res.json({ success: true, data: courier });
  } catch (err) { next(err); }
}

export async function getTamperedCouriers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trackingIds = await blockchainService.getTamperedCouriers();
    res.json({ success: true, data: trackingIds });
  } catch (err) { next(err); }
}
