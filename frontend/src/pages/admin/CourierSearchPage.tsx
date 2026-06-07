import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { Courier } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';

export default function CourierSearchPage() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Courier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await adminApi.courierSearch(trackingId.trim());
      setResult((data as any).data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Courier not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Admin Courier Search</h4>

      <form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: 600 }}>
        <input
          className="form-control"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : 'Search'}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card" style={{ maxWidth: 700 }}>
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <code className="text-primary">{result.trackingId}</code>
            <StatusBadge status={result.status} />
          </div>
          <div className="card-body">
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                {[
                  ['Sender',     result.senderName],
                  ['Receiver',   result.receiverName],
                  ['Weight',     `${result.productWeight} kg`],
                  ['Quality',    result.productQuality],
                  ['Cancelled',  result.isCancelled ? 'Yes' : 'No'],
                  ['Shipper',    result.shipper.fullName],
                  ['Created',    new Date(result.createdAt).toLocaleString()],
                ].map(([label, value]) => (
                  <tr key={String(label)}>
                    <td className="text-muted small fw-semibold" style={{ width: 120 }}>{label}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <Link to={`/transactions/${result.trackingId}`} className="btn btn-outline-primary btn-sm">
                View Transactions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
