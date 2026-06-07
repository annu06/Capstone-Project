import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../../api/transaction.api';
import { trackingApi } from '../../api/tracking.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function TransactionListPage() {
  const { trackingId } = useParams<{ trackingId: string }>();

  const { data: trackingData, isLoading } = useQuery({
    queryKey: ['tracking', trackingId],
    queryFn: () => trackingApi.search(trackingId!).then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!trackingData) return <div className="alert alert-danger">Courier not found.</div>;

  const { courier, transactions, integrityStatus } = trackingData;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="fw-bold mb-1">Transactions</h4>
          <code className="text-primary">{trackingId}</code>
        </div>
        <Link to={`/transactions/${trackingId}/add`} className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      <div className={`alert ${integrityStatus.isValid ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2`}>
        <span className="fs-5">{integrityStatus.isValid ? '✅' : '⚠️'}</span>
        <div>
          <strong>Blockchain Integrity:</strong> {integrityStatus.message}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">No transactions yet.</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className={`card ${!integrityStatus.isValid && integrityStatus.tamperedIndex === idx ? 'tampered-row border-danger' : ''}`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="badge bg-secondary me-2">#{tx.sequenceNumber}</span>
                    <StatusBadge status={tx.status} />
                    {!integrityStatus.isValid && integrityStatus.tamperedIndex === idx && (
                      <span className="badge bg-danger ms-2">⚠ TAMPERED</span>
                    )}
                  </div>
                  <small className="text-muted">{new Date(tx.timestamp).toLocaleString()}</small>
                </div>
                <div className="row g-2 small">
                  <div className="col-md-6">
                    <div className="text-muted">From</div>
                    <div className="fw-semibold">{tx.senderLocation}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-muted">To</div>
                    <div className="fw-semibold">{tx.receiverLocation}</div>
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted">Dimensions:</span> {tx.productDimensions}
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted">Size:</span> {tx.productSize}
                  </div>
                  <div className="col-md-4">
                    <span className="text-muted">Quality:</span> {tx.productQuality}
                  </div>
                  <div className="col-12">
                    <span className="text-muted">Submitted by:</span> {tx.submittedBy.fullName} ({tx.submittedBy.email})
                  </div>
                </div>
                <div className="hash-chain-entry mt-2">
                  block #{tx.sequenceNumber} — {new Date(tx.timestamp).toISOString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <Link to={`/couriers/${courier.id}`} className="btn btn-outline-secondary">← Back to Courier</Link>
      </div>
    </div>
  );
}
