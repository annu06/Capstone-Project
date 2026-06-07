import { prisma } from '../config/database';
import { hashTransaction } from '../utils/crypto';
import { IntegrityStatus } from '../types';

export async function appendLedgerEntry(params: {
  transactionId: string;
  courierId: string;
  trackingId: string;
  sequenceNumber: number;
  senderLocation: string;
  receiverLocation: string;
  status: string;
  timestamp: Date;
}): Promise<void> {
  const prev = await prisma.blockchainLedgerEntry.findFirst({
    where: { trackingId: params.trackingId },
    orderBy: { sequenceNumber: 'desc' },
  });

  const previousHash = prev ? prev.hash : 'GENESIS';
  const hash = hashTransaction({
    transactionId: params.transactionId,
    trackingId: params.trackingId,
    sequenceNumber: params.sequenceNumber,
    senderLocation: params.senderLocation,
    receiverLocation: params.receiverLocation,
    status: params.status,
    timestamp: params.timestamp,
    previousHash,
  });

  await prisma.blockchainLedgerEntry.create({
    data: {
      transactionId: params.transactionId,
      courierId: params.courierId,
      trackingId: params.trackingId,
      hash,
      previousHash,
      sequenceNumber: params.sequenceNumber,
    },
  });
}

export async function verifyIntegrity(trackingId: string): Promise<IntegrityStatus> {
  const entries = await prisma.blockchainLedgerEntry.findMany({
    where: { trackingId },
    include: { transaction: true },
    orderBy: { sequenceNumber: 'asc' },
  });

  if (entries.length === 0) {
    return { isValid: true, message: 'No transactions to verify' };
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const tx = entry.transaction;
    const expectedPrevHash = i === 0 ? 'GENESIS' : entries[i - 1].hash;

    const recomputed = hashTransaction({
      transactionId: tx.id,
      trackingId: tx.trackingId,
      sequenceNumber: tx.sequenceNumber,
      senderLocation: tx.senderLocation,
      receiverLocation: tx.receiverLocation,
      status: tx.status,
      timestamp: tx.timestamp,
      previousHash: expectedPrevHash,
    });

    if (recomputed !== entry.hash || entry.previousHash !== expectedPrevHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        message: `Data tampering detected at transaction #${i + 1}`,
      };
    }
  }

  return { isValid: true, message: 'All transactions verified — chain intact' };
}

export async function getTamperedCouriers(): Promise<string[]> {
  const trackingIds = await prisma.blockchainLedgerEntry.findMany({
    distinct: ['trackingId'],
    select: { trackingId: true },
  });

  const tampered: string[] = [];
  for (const { trackingId } of trackingIds) {
    const result = await verifyIntegrity(trackingId);
    if (!result.isValid) tampered.push(trackingId);
  }
  return tampered;
}
