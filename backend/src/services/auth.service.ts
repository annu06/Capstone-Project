import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { JwtPayload } from '../types';
import { AppError } from '../middleware/error.middleware';

const MAX_FAILED = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5');
const LOCKOUT_MINUTES = parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15');

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new AppError(401, 'Invalid credentials');
  }

  if (user.lockoutEndTime && user.lockoutEndTime > new Date()) {
    const remaining = Math.ceil((user.lockoutEndTime.getTime() - Date.now()) / 60000);
    throw new AppError(423, `Account locked. Try again in ${remaining} minute(s).`);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    const lockout = attempts >= MAX_FAILED
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
      : user.lockoutEndTime;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: attempts, lockoutEndTime: lockout },
    });
    throw new AppError(401, 'Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockoutEndTime: null },
  });

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as any,
    fullName: user.fullName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30m') as any,
  });

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any }
  );

  return { token, refreshToken, user: payload };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret') as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) throw new AppError(401, 'Invalid refresh token');

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as any,
      fullName: user.fullName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '30m') as any,
    });
    return { token, user: payload };
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }
}
