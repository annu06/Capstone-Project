import { Request, Response, NextFunction } from 'express';
import * as courierService from '../services/courier.service';
import * as auditService from '../services/auditTrail.service';
import { JwtPayload } from '../types';

function user(req: Request): JwtPayload { return (req as any).user; }

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const couriers = u.role === 'Admin'
      ? await courierService.getAllCouriers()
      : await courierService.getShipperCouriers(u.userId);
    res.json({ success: true, data: couriers });
  } catch (err) { next(err); }
}

export async function getByTrackingId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courier = await courierService.getCourierByTrackingId(req.params.trackingId);
    res.json({ success: true, data: courier });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courier = await courierService.getCourierById(req.params.id);
    res.json({ success: true, data: courier });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const courier = await courierService.createCourier(u.userId, req.body);
    await auditService.recordAction({
      actionType: 'Create',
      userId: u.userId,
      trackingId: courier.trackingId,
      courierId: courier.id,
      details: `Courier created: ${courier.trackingId}`,
    });
    const io = req.app.get('io');
    io?.to(`user:${u.userId}`).emit('notification', {
      message: `Courier ${courier.trackingId} created successfully`,
      type: 'CourierCreated',
    });
    res.status(201).json({ success: true, data: courier });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const courier = await courierService.updateCourier(req.params.id, u.userId, req.body);
    await auditService.recordAction({
      actionType: 'Update',
      userId: u.userId,
      trackingId: courier.trackingId,
      courierId: courier.id,
      details: `Courier updated: ${courier.trackingId}`,
    });
    res.json({ success: true, data: courier });
  } catch (err) { next(err); }
}

export async function cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const courier = await courierService.cancelCourier(req.params.id, u.userId);
    await auditService.recordAction({
      actionType: 'Delete',
      userId: u.userId,
      trackingId: courier.trackingId,
      courierId: courier.id,
      details: `Courier cancelled: ${courier.trackingId}`,
    });
    res.json({ success: true, data: courier });
  } catch (err) { next(err); }
}
