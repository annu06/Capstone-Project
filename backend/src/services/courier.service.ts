import { prisma } from '../config/database';
import { generateTrackingId } from '../utils/trackingId';
import { AppError } from '../middleware/error.middleware';

const courierSelect = {
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
};

export async function getShipperCouriers(shipperId: string) {
  return prisma.courier.findMany({
    where: { shipperId, isCancelled: false },
    select: courierSelect,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllCouriers() {
  return prisma.courier.findMany({
    select: courierSelect,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCourierByTrackingId(trackingId: string) {
  const courier = await prisma.courier.findUnique({
    where: { trackingId },
    select: courierSelect,
  });
  if (!courier) throw new AppError(404, 'Courier not found');
  return courier;
}

export async function getCourierById(id: string) {
  const courier = await prisma.courier.findUnique({
    where: { id },
    select: courierSelect,
  });
  if (!courier) throw new AppError(404, 'Courier not found');
  return courier;
}

export async function createCourier(shipperId: string, data: {
  senderName: string;
  receiverName: string;
  productDimensions: string;
  productSize: string;
  productWeight: number;
  productQuality: string;
}) {
  const trackingId = generateTrackingId();
  return prisma.courier.create({
    data: { ...data, trackingId, shipperId, status: 'Pending' },
    select: courierSelect,
  });
}

export async function updateCourier(id: string, shipperId: string, data: {
  senderName?: string;
  receiverName?: string;
  productDimensions?: string;
  productSize?: string;
  productWeight?: number;
  productQuality?: string;
  status?: string;
}) {
  const courier = await prisma.courier.findUnique({ where: { id } });
  if (!courier) throw new AppError(404, 'Courier not found');
  if (courier.shipperId !== shipperId) throw new AppError(403, 'Access denied');
  if (courier.isCancelled) throw new AppError(400, 'Cannot update a cancelled courier');

  return prisma.courier.update({
    where: { id },
    data: { ...data, version: { increment: 1 } },
    select: courierSelect,
  });
}

export async function cancelCourier(id: string, shipperId: string) {
  const courier = await prisma.courier.findUnique({ where: { id } });
  if (!courier) throw new AppError(404, 'Courier not found');
  if (courier.shipperId !== shipperId) throw new AppError(403, 'Access denied');
  if (courier.isCancelled) throw new AppError(400, 'Courier already cancelled');

  return prisma.courier.update({
    where: { id },
    data: { isCancelled: true, status: 'Cancelled', version: { increment: 1 } },
    select: courierSelect,
  });
}
