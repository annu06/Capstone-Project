import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) { navigate('/dashboard', { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="fs-1 mb-2">⛓</div>
            <h4 className="fw-bold text-primary">BlockChain ShipTrack</h4>
            <p className="text-muted small">Secure shipment management system</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-light rounded small text-muted">
            <strong>Demo accounts:</strong>
            <div>admin@shiptrack.com / Admin@123</div>
            <div>shipper@shiptrack.com / Shipper@123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
