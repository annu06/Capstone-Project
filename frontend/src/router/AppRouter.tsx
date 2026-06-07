import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CourierListPage from '../pages/courier/CourierListPage';
import CourierCreatePage from '../pages/courier/CourierCreatePage';
import CourierEditPage from '../pages/courier/CourierEditPage';
import CourierDetailsPage from '../pages/courier/CourierDetailsPage';
import TransactionListPage from '../pages/transaction/TransactionListPage';
import TransactionAddPage from '../pages/transaction/TransactionAddPage';
import TrackingPage from '../pages/tracking/TrackingPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserListPage from '../pages/admin/UserListPage';
import UserCreatePage from '../pages/admin/UserCreatePage';
import UserEditPage from '../pages/admin/UserEditPage';
import AuditLogPage from '../pages/admin/AuditLogPage';
import CourierSearchPage from '../pages/admin/CourierSearchPage';
import TamperedCouriersPage from '../pages/admin/TamperedCouriersPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ShipperRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'Shipper' && user?.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="couriers" element={<CourierListPage />} />
          <Route path="couriers/create" element={<ShipperRoute><CourierCreatePage /></ShipperRoute>} />
          <Route path="couriers/:id/edit" element={<ShipperRoute><CourierEditPage /></ShipperRoute>} />
          <Route path="couriers/:id" element={<CourierDetailsPage />} />
          <Route path="transactions/:trackingId" element={<TransactionListPage />} />
          <Route path="transactions/:trackingId/add" element={<TransactionAddPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
          <Route path="admin/users/create" element={<AdminRoute><UserCreatePage /></AdminRoute>} />
          <Route path="admin/users/:id/edit" element={<AdminRoute><UserEditPage /></AdminRoute>} />
          <Route path="admin/audit-log" element={<AdminRoute><AuditLogPage /></AdminRoute>} />
          <Route path="admin/courier-search" element={<AdminRoute><CourierSearchPage /></AdminRoute>} />
          <Route path="admin/tampered-couriers" element={<AdminRoute><TamperedCouriersPage /></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
