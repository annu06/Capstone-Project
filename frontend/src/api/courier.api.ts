import api from './axiosClient';
import { Courier } from '../types';

export const courierApi = {
  list: () =>
    api.get<{ success: boolean; data: Courier[] }>('/couriers'),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Courier }>(`/couriers/${id}`),

  getByTrackingId: (trackingId: string) =>
    api.get<{ success: boolean; data: Courier }>(`/couriers/tracking/${trackingId}`),

  create: (data: Omit<Courier, 'id' | 'trackingId' | 'status' | 'isCancelled' | 'createdAt' | 'updatedAt' | 'shipper'>) =>
    api.post<{ success: boolean; data: Courier }>('/couriers', data),

  update: (id: string, data: Partial<Courier>) =>
    api.put<{ success: boolean; data: Courier }>(`/couriers/${id}`, data),

  cancel: (id: string) =>
    api.delete<{ success: boolean; data: Courier }>(`/couriers/${id}`),
};
