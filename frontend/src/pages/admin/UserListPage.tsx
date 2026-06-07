import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ROLES = ['', 'Admin', 'Shipper', 'Consignee', 'Freight_Forwarder', 'Shipping_Line'];

export default function UserListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, isActive],
    queryFn: () => adminApi.getUsers({ searchTerm: search || undefined, role: role || undefined, isActive: isActive || undefined }).then((r) => r.data.data),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Manage Users</h4>
        <Link to="/admin/users/create" className="btn btn-primary">+ Create User</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">All roles</option>
                {ROLES.filter(Boolean).map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={isActive} onChange={(e) => setIsActive(e.target.value)}>
                <option value="">All status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : !data?.length ? (
            <div className="text-center py-5 text-muted">No users found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((u) => (
                    <tr key={u.id} className={!u.isActive ? 'table-secondary text-muted' : ''}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td><span className="badge bg-secondary">{u.role.replace('_', ' ')}</span></td>
                      <td>
                        <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="small">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/admin/users/${u.id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
                          {u.isActive && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => { if (window.confirm('Deactivate this user?')) deactivateMutation.mutate(u.id); }}
                            >
                              Deactivate
                            </button>
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
