import api from './axiosClient';
import { UserRecord, AuditEntry, PaginatedResult, UserRole } from '../types';

export const adminApi = {
  getUsers: (params?: { searchTerm?: string; role?: string; isActive?: string }) =>
    api.get<{ success: boolean; data: UserRecord[] }>('/admin/users', { params }),

  getUserById: (id: string) =>
    api.get<{ success: boolean; data: UserRecord }>(`/admin/users/${id}`),

  createUser: (data: { email: string; password: string; fullName: string; role: UserRole }) =>
    api.post<{ success: boolean; data: UserRecord }>('/admin/users', data),

  updateUser: (id: string, data: Partial<{ fullName: string; role: UserRole; isActive: boolean; password: string }>) =>
    api.put<{ success: boolean; data: UserRecord }>(`/admin/users/${id}`, data),

  deactivateUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  getAuditLog: (params?: { trackingId?: string; actionType?: string; fromDate?: string; toDate?: string; page?: number }) =>
    api.get<{ success: boolean; data: PaginatedResult<AuditEntry> }>('/admin/audit-log', { params }),

  courierSearch: (trackingId: string) =>
    api.get(`/admin/courier-search?trackingId=${trackingId}`),

  getTamperedCouriers: () =>
    api.get<{ success: boolean; data: string[] }>('/admin/tampered-couriers'),
};
