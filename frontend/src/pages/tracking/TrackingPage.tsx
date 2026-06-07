import React, { useState } from 'react';
import { trackingApi } from '../../api/tracking.api';
import { TrackingResult } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await trackingApi.search(trackingId.trim());
      setResult(data.data!);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Courier not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Track Shipment</h4>

      <form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: 600 }}>
        <input
          className="form-control"
          placeholder="Enter Tracking ID (e.g. TRK-XXXXX-XXXX)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : 'Search'}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <LoadingSpinner message="Searching and verifying blockchain..." />}

      {result && (
        <div>
          <div className={`alert ${result.integrityStatus.isValid ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mb-4`}>
            <span className="fs-4">{result.integrityStatus.isValid ? '✅' : '⚠️'}</span>
            <div>
              <strong>Blockchain Integrity Check:</strong> {result.integrityStatus.message}
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header bg-white fw-semibold">Courier Information</div>
                <div className="card-body">
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      {[
                        ['Tracking ID', <code className="text-primary">{result.courier.trackingId}</code>],
                        ['Status',      <StatusBadge status={result.courier.status} />],
                        ['Sender',      result.courier.senderName],
                        ['Receiver',    result.courier.receiverName],
                        ['Weight',      `${result.courier.productWeight} kg`],
                        ['Quality',     result.courier.productQuality],
                        ['Shipper',     result.courier.shipper.fullName],
                        ['Created',     new Date(result.courier.createdAt).toLocaleString()],
                      ].map(([label, value]) => (
                        <tr key={String(label)}>
                          <td className="text-muted small fw-semibold" style={{ width: 130 }}>{label}</td>
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
                <div className="card-header bg-white fw-semibold">
                  Transaction History ({result.transactions.length})
                </div>
                <div className="card-body p-0">
                  {result.transactions.length === 0 ? (
                    <div className="text-center py-4 text-muted small">No transactions yet</div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {result.transactions.map((tx, idx) => (
                        <div
                          key={tx.id}
                          className={`list-group-item ${!result.integrityStatus.isValid && result.integrityStatus.tamperedIndex === idx ? 'list-group-item-danger' : ''}`}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="badge bg-secondary me-1">#{tx.sequenceNumber}</span>
                              <StatusBadge status={tx.status} />
                              {!result.integrityStatus.isValid && result.integrityStatus.tamperedIndex === idx && (
                                <span className="badge bg-danger ms-1">⚠ TAMPERED</span>
                              )}
                            </div>
                            <small className="text-muted">{new Date(tx.timestamp).toLocaleDateString()}</small>
                          </div>
                          <div className="small mt-1">
                            {tx.senderLocation} → {tx.receiverLocation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
