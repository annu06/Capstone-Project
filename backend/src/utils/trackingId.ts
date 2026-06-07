import { randomBytes } from 'crypto';

export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `TRK-${timestamp}-${random}`;
}
