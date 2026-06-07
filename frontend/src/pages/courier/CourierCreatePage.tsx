import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courierApi } from '../../api/courier.api';

const initialForm = {
  senderName: '', receiverName: '',
  productDimensions: '', productSize: '',
  productWeight: '', productQuality: '',
};

export default function CourierCreatePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => courierApi.create({ ...form, productWeight: Number(form.productWeight) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['couriers'] }); navigate('/couriers'); },
    onError: (err: any) => setError(err.response?.data?.message || 'Creation failed'),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <h4 className="fw-bold mb-4">Create New Courier</h4>
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Sender Name *</label>
                <input className="form-control" required value={form.senderName} onChange={set('senderName')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Receiver Name *</label>
                <input className="form-control" required value={form.receiverName} onChange={set('receiverName')} />
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
                <label className="form-label">Weight (kg) *</label>
                <input type="number" step="0.01" min="0" className="form-control" required value={form.productWeight} onChange={set('productWeight')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Product Quality *</label>
                <select className="form-select" required value={form.productQuality} onChange={set('productQuality')}>
                  <option value="">Select quality</option>
                  {['Fragile', 'Standard', 'Hazardous', 'Perishable'].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating…' : 'Create Courier'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/couriers')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
