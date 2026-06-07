export type UserRole = 'Admin' | 'Shipper' | 'Consignee' | 'Freight_Forwarder' | 'Shipping_Line';

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Courier {
  id: string;
  trackingId: string;
  senderName: string;
  receiverName: string;
  productDimensions: string;
  productSize: string;
  productWeight: number;
  productQuality: string;
  status: string;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
  shipper: { id: string; fullName: string; email: string };
}

export interface Transaction {
  id: string;
  courierId: string;
  trackingId: string;
  senderLocation: string;
  receiverLocation: string;
  productDimensions: string;
  productSize: string;
  productQuality: string;
  status: string;
  timestamp: string;
  sequenceNumber: number;
  submittedBy: { id: string; fullName: string; email: string };
}

export interface IntegrityStatus {
  isValid: boolean;
  tamperedIndex?: number;
  message: string;
}

export interface TrackingResult {
  courier: Courier;
  transactions: Transaction[];
  integrityStatus: IntegrityStatus;
}

export interface AuditEntry {
  id: string;
  actionType: string;
  userId: string;
  trackingId?: string;
  courierId?: string;
  timestamp: string;
  details: string;
  user: { id: string; fullName: string; email: string };
}

export interface Notification {
  id: string;
  userId: string;
  trackingId?: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  user: User;
}
