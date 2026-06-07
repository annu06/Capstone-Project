import api from './axiosClient';
import { AuthTokens, User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; data: AuthTokens }>('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/refresh', { refreshToken }),

  me: () =>
    api.get<{ success: boolean; data: User }>('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
};
