import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { UserRole } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ROLES: UserRole[] = ['Admin', 'Shipper', 'Consignee', 'Freight_Forwarder', 'Shipping_Line'];

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserById(id!).then((r) => r.data.data),
  });

  const [form, setForm] = useState({ fullName: '', role: '' as UserRole | '', isActive: true, password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) setForm({ fullName: data.fullName, role: data.role, isActive: data.isActive, password: '' });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => adminApi.updateUser(id!, {
      fullName: form.fullName,
      role: form.role as UserRole,
      isActive: form.isActive,
      ...(form.password ? { password: form.password } : {}),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); navigate('/admin/users'); },
    onError: (err: any) => setError(err.response?.data?.message || 'Update failed'),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h4 className="fw-bold mb-4">Edit User</h4>
      <div className="card" style={{ maxWidth: 500 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input className="form-control" required value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Role *</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input type="password" className="form-control" value={form.password} onChange={set('password')} minLength={8} />
            </div>
            <div className="mb-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              <label className="form-check-label" htmlFor="isActive">Active</label>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
