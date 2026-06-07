import { prisma } from '../config/database';
import { appendLedgerEntry } from './blockchain.service';
import { AppError } from '../middleware/error.middleware';

const txSelect = {
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
};

export async function getTransactions(trackingId: string) {
  return prisma.transaction.findMany({
    where: { trackingId },
    select: txSelect,
    orderBy: { sequenceNumber: 'asc' },
  });
}

export async function addTransaction(trackingId: string, submittedById: string, data: {
  senderLocation: string;
  receiverLocation: string;
  productDimensions: string;
  productSize: string;
  productQuality: string;
  status: string;
}) {
  const courier = await prisma.courier.findUnique({ where: { trackingId } });
  if (!courier) throw new AppError(404, 'Courier not found');
  if (courier.isCancelled) throw new AppError(400, 'Cannot add transaction to cancelled courier');

  const lastTx = await prisma.transaction.findFirst({
    where: { trackingId },
    orderBy: { sequenceNumber: 'desc' },
  });
  const sequenceNumber = (lastTx?.sequenceNumber ?? 0) + 1;

  const transaction = await prisma.transaction.create({
    data: {
      courierId: courier.id,
      trackingId,
      submittedById,
      sequenceNumber,
      ...data,
    },
    select: txSelect,
  });

  await appendLedgerEntry({
    transactionId: transaction.id,
    courierId: courier.id,
    trackingId,
    sequenceNumber,
    senderLocation: data.senderLocation,
    receiverLocation: data.receiverLocation,
    status: data.status,
    timestamp: transaction.timestamp,
  });

  await prisma.courier.update({
    where: { id: courier.id },
    data: { status: data.status, version: { increment: 1 } },
  });

  return transaction;
}
