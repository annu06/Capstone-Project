import { prisma } from '../config/database';
import { verifyIntegrity } from './blockchain.service';
import { AppError } from '../middleware/error.middleware';
import { TrackingResult } from '../types';

export async function searchByTrackingId(trackingId: string): Promise<TrackingResult> {
  const courier = await prisma.courier.findUnique({
    where: { trackingId },
    select: {
      id: true,
      trackingId: true,
      senderName: true,
      receiverName: true,
      productDimensions: true,
      productSize: true,
      productWeight: true,
      productQuality: true,
      status: true,
      isCancelled: true,
      createdAt: true,
      updatedAt: true,
      shipper: { select: { id: true, fullName: true, email: true } },
    },
  });

  if (!courier) throw new AppError(404, 'Courier not found');

  const transactions = await prisma.transaction.findMany({
    where: { trackingId },
    select: {
      id: true,
      courierId: true,
      trackingId: true,
      senderLocation: true,
      receiverLocation: true,
      productDimensions: true,
      productSize: true,
      productQuality: true,
      status: true,
      timestamp: true,
      sequenceNumber: true,
      submittedBy: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { sequenceNumber: 'asc' },
  });

  const integrityStatus = await verifyIntegrity(trackingId);

  return {
    courier: { ...courier, productWeight: Number(courier.productWeight) },
    transactions,
    integrityStatus,
  };
}
