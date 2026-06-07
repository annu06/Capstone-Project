import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courierApi } from '../../api/courier.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function CourierDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['courier', id],
    queryFn: () => courierApi.getById(id!).then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div className="alert alert-danger">Courier not found.</div>;

  const c = data;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <h4 className="fw-bold mb-0">Courier Details</h4>
        <code className="text-primary fs-6">{c.trackingId}</code>
        <StatusBadge status={c.status} />
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-white fw-semibold">Shipment Info</div>
            <div className="card-body">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  {[
                    ['Tracking ID', <code>{c.trackingId}</code>],
                    ['Sender', c.senderName],
                    ['Receiver', c.receiverName],
                    ['Status', <StatusBadge status={c.status} />],
                    ['Cancelled', c.isCancelled ? '✅ Yes' : '❌ No'],
                    ['Shipper', c.shipper.fullName],
                  ].map(([label, value]) => (
                    <tr key={String(label)}>
                      <td className="text-muted small fw-semibold" style={{ width: 140 }}>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-white fw-semibold">Product Details</div>
            <div className="card-body">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  {[
                    ['Dimensions', c.productDimensions],
                    ['Size',       c.productSize],
                    ['Weight',     `${c.productWeight} kg`],
                    ['Quality',    c.productQuality],
                    ['Created',    new Date(c.createdAt).toLocaleString()],
                    ['Updated',    new Date(c.updatedAt).toLocaleString()],
                  ].map(([label, value]) => (
                    <tr key={String(label)}>
                      <td className="text-muted small fw-semibold" style={{ width: 140 }}>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <Link to={`/transactions/${c.trackingId}`} className="btn btn-primary">
          View Transactions
        </Link>
        <Link to={`/transactions/${c.trackingId}/add`} className="btn btn-outline-primary">
          + Add Transaction
        </Link>
        <Link to="/couriers" className="btn btn-outline-secondary">Back</Link>
      </div>
    </div>
  );
}
