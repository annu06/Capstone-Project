import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TamperedCouriersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tampered-couriers'],
    queryFn: () => adminApi.getTamperedCouriers().then((r) => r.data.data),
  });

  return (
    <div>
      <h4 className="fw-bold mb-2">Tampered Couriers</h4>
      <p className="text-muted mb-4">
        These couriers have blockchain integrity violations — their transaction hash chains do not match.
      </p>

      {isLoading ? (
        <LoadingSpinner message="Verifying all blockchain chains..." />
      ) : !data?.length ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="fs-1 mb-2">✅</div>
            <h6 className="fw-bold text-success">All chains intact</h6>
            <p className="text-muted small mb-0">No tampered couriers detected.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <span className="fs-4">⚠️</span>
            <strong>{data.length} courier(s) with integrity violations detected!</strong>
          </div>

          <div className="list-group">
            {data.map((trackingId) => (
              <div key={trackingId} className="list-group-item list-group-item-danger d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-danger me-2">TAMPERED</span>
                  <code className="text-dark">{trackingId}</code>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/transactions/${trackingId}`} className="btn btn-sm btn-outline-danger">
                    View Chain
                  </Link>
                  <Link to={`/tracking?trackingId=${trackingId}`} className="btn btn-sm btn-outline-secondary">
                    Full Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
