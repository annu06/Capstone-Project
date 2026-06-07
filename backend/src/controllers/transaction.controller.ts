import { Request, Response, NextFunction } from 'express';
import * as txService from '../services/transaction.service';
import * as auditService from '../services/auditTrail.service';
import * as notifService from '../services/notification.service';
import { JwtPayload } from '../types';

function user(req: Request): JwtPayload { return (req as any).user; }

export async function listByTracking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const txs = await txService.getTransactions(req.params.trackingId);
    res.json({ success: true, data: txs });
  } catch (err) { next(err); }
}

export async function add(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { trackingId } = req.params;
    const tx = await txService.addTransaction(trackingId, u.userId, req.body);

    await auditService.recordAction({
      actionType: 'AddTransaction',
      userId: u.userId,
      trackingId,
      courierId: tx.courierId,
      details: `Transaction #${tx.sequenceNumber} added to ${trackingId}: status=${tx.status}`,
    });

    const io = req.app.get('io');
    io?.to(`tracking:${trackingId}`).emit('transactionAdded', { trackingId, transaction: tx });

    await notifService.createNotification({
      userId: u.userId,
      trackingId,
      message: `Transaction #${tx.sequenceNumber} added to ${trackingId}`,
      notificationType: 'TransactionAdded',
    });

    res.status(201).json({ success: true, data: tx });
  } catch (err) { next(err); }
}
