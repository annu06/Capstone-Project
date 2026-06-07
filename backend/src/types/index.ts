export type UserRole = 'Admin' | 'Shipper' | 'Consignee' | 'Freight_Forwarder' | 'Shipping_Line';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
  correlationId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TrackingResult {
  courier: CourierDetail;
  transactions: TransactionDetail[];
  integrityStatus: IntegrityStatus;
}

export interface IntegrityStatus {
  isValid: boolean;
  tamperedIndex?: number;
  message: string;
}

export interface CourierDetail {
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
  createdAt: Date;
  updatedAt: Date;
  shipper: { id: string; fullName: string; email: string };
}

export interface TransactionDetail {
  id: string;
  courierId: string;
  trackingId: string;
  senderLocation: string;
  receiverLocation: string;
  productDimensions: string;
  productSize: string;
  productQuality: string;
  status: string;
  timestamp: Date;
  sequenceNumber: number;
  submittedBy: { id: string; fullName: string; email: string };
}

export interface AuditFilter {
  trackingId?: string;
  actionType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
}
