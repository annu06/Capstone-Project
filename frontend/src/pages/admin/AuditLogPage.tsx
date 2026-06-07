import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const ACTION_TYPES = ['', 'Create', 'Update', 'Delete', 'AddTransaction', 'UserCreate', 'UserUpdate', 'UserDeactivate'];

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [trackingId, setTrackingId] = useState('');
  const [actionType, setActionType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-log', page, trackingId, actionType, fromDate, toDate],
    queryFn: () => adminApi.getAuditLog({
      page,
      trackingId: trackingId || undefined,
      actionType: actionType || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }).then((r) => r.data.data),
  });

  return (
    <div>
      <h4 className="fw-bold mb-4">Audit Log</h4>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Tracking ID" value={trackingId} onChange={(e) => { setTrackingId(e.target.value); setPage(1); }} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={actionType} onChange={(e) => { setActionType(e.target.value); setPage(1); }}>
                <option value="">All actions</option>
                {ACTION_TYPES.filter(Boolean).map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <span className="small text-muted">
            {data ? `${data.total} entries` : ''}
          </span>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : !data?.items.length ? (
            <div className="text-center py-5 text-muted">No audit entries found.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Tracking ID</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((e) => (
                      <tr key={e.id}>
                        <td className="small text-muted text-nowrap">{new Date(e.timestamp).toLocaleString()}</td>
                        <td><span className="badge bg-secondary">{e.actionType}</span></td>
                        <td className="small">{e.user.fullName}</td>
                        <td><code className="text-primary small">{e.trackingId || '—'}</code></td>
                        <td className="small">{e.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center py-3">
                <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
