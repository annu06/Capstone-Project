import api from './axiosClient';
import { Transaction } from '../types';

export const transactionApi = {
  list: (trackingId: string) =>
    api.get<{ success: boolean; data: Transaction[] }>(`/transactions/${trackingId}`),

  add: (trackingId: string, data: {
    senderLocation: string;
    receiverLocation: string;
    productDimensions: string;
    productSize: string;
    productQuality: string;
    status: string;
  }) =>
    api.post<{ success: boolean; data: Transaction }>(`/transactions/${trackingId}`, data),
};
