import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { courierApi } from '../../api/courier.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const { data: users, isLoading: uLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data.data),
  });
  const { data: couriers, isLoading: cLoading } = useQuery({
    queryKey: ['couriers'],
    queryFn: () => courierApi.list().then((r) => r.data.data),
  });
  const { data: tampered, isLoading: tLoading } = useQuery({
    queryKey: ['tampered-couriers'],
    queryFn: () => adminApi.getTamperedCouriers().then((r) => r.data.data),
  });

  if (uLoading || cLoading || tLoading) return <LoadingSpinner />;

  const activeUsers = (users || []).filter((u: any) => u.isActive).length;
  const totalCouriers = (couriers || []).length;
  const tamperedCount = (tampered || []).length;

  const panels = [
    { label: 'Total Users',      value: users?.length || 0,  color: 'primary', icon: '👥', to: '/admin/users' },
    { label: 'Active Users',     value: activeUsers,          color: 'success', icon: '✅', to: '/admin/users' },
    { label: 'Total Couriers',   value: totalCouriers,        color: 'info',    icon: '📦', to: '/couriers' },
    { label: 'Tampered Chains',  value: tamperedCount,        color: 'danger',  icon: '⚠️', to: '/admin/tampered-couriers' },
  ];

  const adminLinks = [
    { to: '/admin/users',             label: 'Manage Users',       icon: '👥', desc: 'Create, update, deactivate users' },
    { to: '/admin/audit-log',         label: 'Audit Log',          icon: '📋', desc: 'View all system actions' },
    { to: '/admin/courier-search',    label: 'Search Couriers',    icon: '🔎', desc: 'Find any courier by tracking ID' },
    { to: '/admin/tampered-couriers', label: 'Tampered Couriers',  icon: '⚠️', desc: 'Detect data integrity violations' },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-4">Admin Dashboard</h4>

      <div className="row g-3 mb-5">
        {panels.map((p) => (
          <div key={p.label} className="col-sm-6 col-xl-3">
            <Link to={p.to} className="text-decoration-none">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className={`fs-2 text-${p.color}`}>{p.icon}</div>
                  <div>
                    <div className="fs-4 fw-bold">{p.value}</div>
                    <div className="text-muted small">{p.label}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {adminLinks.map((l) => (
          <div key={l.to} className="col-sm-6">
            <Link to={l.to} className="text-decoration-none">
              <div className="card h-100">
                <div className="card-body">
                  <div className="fs-3 mb-2">{l.icon}</div>
                  <h6 className="fw-bold">{l.label}</h6>
                  <p className="text-muted small mb-0">{l.desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
