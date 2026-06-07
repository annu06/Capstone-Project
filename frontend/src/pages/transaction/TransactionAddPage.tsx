import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../../api/transaction.api';

const STATUSES = ['Dispatched', 'InTransit', 'Out for Delivery', 'Delivered', 'Exception'];

export default function TransactionAddPage() {
  const { trackingId } = useParams<{ trackingId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    senderLocation: '', receiverLocation: '',
    productDimensions: '', productSize: '',
    productQuality: '', status: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => transactionApi.add(trackingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tracking', trackingId] });
      navigate(`/transactions/${trackingId}`);
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to add transaction'),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <h4 className="fw-bold mb-1">Add Transaction</h4>
      <p className="text-muted mb-4">Tracking ID: <code className="text-primary">{trackingId}</code></p>

      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Sender Location *</label>
                <input className="form-control" placeholder="City, Country" required value={form.senderLocation} onChange={set('senderLocation')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Receiver Location *</label>
                <input className="form-control" placeholder="City, Country" required value={form.receiverLocation} onChange={set('receiverLocation')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Product Dimensions *</label>
                <input className="form-control" placeholder="e.g. 30x20x15 cm" required value={form.productDimensions} onChange={set('productDimensions')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Product Size *</label>
                <select className="form-select" required value={form.productSize} onChange={set('productSize')}>
                  <option value="">Select size</option>
                  {['Small', 'Medium', 'Large', 'Extra Large'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Product Quality *</label>
                <select className="form-select" required value={form.productQuality} onChange={set('productQuality')}>
                  <option value="">Select quality</option>
                  {['Fragile', 'Standard', 'Hazardous', 'Perishable'].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Shipment Status *</label>
                <select className="form-select" required value={form.status} onChange={set('status')}>
                  <option value="">Select status</option>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting…' : 'Add Transaction'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/transactions/${trackingId}`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
