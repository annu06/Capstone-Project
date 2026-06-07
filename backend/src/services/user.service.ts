import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { UserRole } from '../types';
import { AppError } from '../middleware/error.middleware';

export async function getUsers(params: { searchTerm?: string; role?: string; isActive?: string }) {
  const where: any = {};
  if (params.role) where.role = params.role;
  if (params.isActive !== undefined) where.isActive = params.isActive === 'true';
  if (params.searchTerm) {
    where.OR = [
      { fullName: { contains: params.searchTerm, mode: 'insensitive' } },
      { email: { contains: params.searchTerm, mode: 'insensitive' } },
    ];
  }
  return prisma.user.findMany({
    where,
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError(409, 'Email already in use');

  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: { email: data.email, passwordHash, fullName: data.fullName, role: data.role },
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
  });
}

export async function updateUser(id: string, data: {
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
}) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  const updateData: any = {};
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.role) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, fullName: true, role: true, isActive: true },
  });
}

export async function deactivateUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');
  return prisma.user.update({ where: { id }, data: { isActive: false } });
}
