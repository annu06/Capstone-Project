import { createHash } from 'crypto';

export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function hashTransaction(params: {
  transactionId: string;
  trackingId: string;
  sequenceNumber: number;
  senderLocation: string;
  receiverLocation: string;
  status: string;
  timestamp: Date;
  previousHash: string;
}): string {
  const content = [
    params.transactionId,
    params.trackingId,
    params.sequenceNumber.toString(),
    params.senderLocation,
    params.receiverLocation,
    params.status,
    params.timestamp.toISOString(),
    params.previousHash,
  ].join('|');
  return sha256(content);
}
