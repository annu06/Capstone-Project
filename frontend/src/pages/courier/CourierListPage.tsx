import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { courierApi } from '../../api/courier.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function CourierListPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['couriers'],
    queryFn: () => courierApi.list().then((r) => r.data.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => courierApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['couriers'] }),
  });

  const couriers = data || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Couriers</h4>
        {user?.role === 'Shipper' && (
          <Link to="/couriers/create" className="btn btn-primary">+ Create Courier</Link>
        )}
      </div>

      <div className="card">
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : couriers.length === 0 ? (
            <div className="text-center py-5 text-muted">No couriers yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Weight (kg)</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {couriers.map((c) => (
                    <tr key={c.id} className={c.isCancelled ? 'table-secondary text-muted' : ''}>
                      <td><code className="text-primary">{c.trackingId}</code></td>
                      <td>{c.senderName}</td>
                      <td>{c.receiverName}</td>
                      <td>{c.productWeight}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="small">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/couriers/${c.id}`} className="btn btn-sm btn-outline-primary">Details</Link>
                          <Link to={`/transactions/${c.trackingId}`} className="btn btn-sm btn-outline-secondary">Transactions</Link>
                          {user?.role === 'Shipper' && !c.isCancelled && (
                            <>
                              <Link to={`/couriers/${c.id}/edit`} className="btn btn-sm btn-outline-warning">Edit</Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  if (window.confirm('Cancel this courier?')) cancelMutation.mutate(c.id);
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
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
