import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { courierApi } from '../../api/courier.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['couriers'],
    queryFn: () => courierApi.list().then((r) => r.data.data),
  });

  const couriers = data || [];
  const active = couriers.filter((c) => !c.isCancelled);
  const cancelled = couriers.filter((c) => c.isCancelled);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Welcome, {user?.fullName}</h4>
          <p className="text-muted mb-0 small">Role: {user?.role.replace('_', ' ')}</p>
        </div>
        {user?.role === 'Shipper' && (
          <Link to="/couriers/create" className="btn btn-primary">
            + New Courier
          </Link>
        )}
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Couriers', value: couriers.length, color: 'primary', icon: '📦' },
          { label: 'Active',         value: active.length,   color: 'success', icon: '✅' },
          { label: 'Cancelled',      value: cancelled.length,color: 'danger',  icon: '❌' },
        ].map((s) => (
          <div key={s.label} className="col-sm-4">
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`fs-2 text-${s.color}`}>{s.icon}</div>
                <div>
                  <div className="fs-4 fw-bold">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">Recent Couriers</h6>
          <Link to="/couriers" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : couriers.length === 0 ? (
            <div className="text-center py-5 text-muted">No couriers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {couriers.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td><code className="text-primary">{c.trackingId}</code></td>
                      <td>{c.senderName}</td>
                      <td>{c.receiverName}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="small text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/couriers/${c.id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
