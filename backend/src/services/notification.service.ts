import { prisma } from '../config/database';

export async function createNotification(params: {
  userId: string;
  trackingId?: string;
  message: string;
  notificationType: string;
}): Promise<void> {
  await prisma.notification.create({ data: params });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function markAsRead(id: string, userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, isRead: false } });
}
