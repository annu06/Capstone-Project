import { prisma } from '../config/database';
import { AuditFilter } from '../types';

const PAGE_SIZE = 50;

export async function recordAction(params: {
  actionType: string;
  userId: string;
  trackingId?: string;
  courierId?: string;
  details: string;
}): Promise<void> {
  await prisma.auditTrailEntry.create({ data: params });
}

export async function getAuditLog(filter: AuditFilter) {
  const page = filter.page || 1;
  const where: any = {};

  if (filter.trackingId) where.trackingId = { contains: filter.trackingId, mode: 'insensitive' };
  if (filter.actionType) where.actionType = filter.actionType;
  if (filter.fromDate || filter.toDate) {
    where.timestamp = {};
    if (filter.fromDate) where.timestamp.gte = new Date(filter.fromDate);
    if (filter.toDate) where.timestamp.lte = new Date(filter.toDate);
  }

  const [items, total] = await Promise.all([
    prisma.auditTrailEntry.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditTrailEntry.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
