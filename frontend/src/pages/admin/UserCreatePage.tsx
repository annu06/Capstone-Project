import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { UserRole } from '../../types';

const ROLES: UserRole[] = ['Admin', 'Shipper', 'Consignee', 'Freight_Forwarder', 'Shipping_Line'];

export default function UserCreatePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: '' as UserRole | '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => adminApi.createUser(form as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); navigate('/admin/users'); },
    onError: (err: any) => setError(err.response?.data?.message || 'Creation failed'),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <h4 className="fw-bold mb-4">Create User</h4>
      <div className="card" style={{ maxWidth: 500 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input className="form-control" required value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input type="email" className="form-control" required value={form.email} onChange={set('email')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password *</label>
              <input type="password" className="form-control" required minLength={8} value={form.password} onChange={set('password')} />
            </div>
            <div className="mb-4">
              <label className="form-label">Role *</label>
              <select className="form-select" required value={form.role} onChange={set('role')}>
                <option value="">Select role</option>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating…' : 'Create User'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
