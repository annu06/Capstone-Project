import api from './axiosClient';
import { Notification } from '../types';

export const notificationApi = {
  list: () =>
    api.get<{ success: boolean; data: Notification[] }>('/notifications'),

  unreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count'),

  markRead: (id: string) =>
    api.put(`/notifications/${id}/read`),

  markAllRead: () =>
    api.put('/notifications/mark-all-read'),
};
