import api from './axiosClient';
import { TrackingResult } from '../types';

export const trackingApi = {
  search: (trackingId: string) =>
    api.get<{ success: boolean; data: TrackingResult }>(`/tracking/search?trackingId=${trackingId}`),
};
