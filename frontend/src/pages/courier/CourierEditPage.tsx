import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courierApi } from '../../api/courier.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CourierEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['courier', id],
    queryFn: () => courierApi.getById(id!).then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    senderName: '', receiverName: '',
    productDimensions: '', productSize: '',
    productWeight: '', productQuality: '', status: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) {
      setForm({
        senderName: data.senderName,
        receiverName: data.receiverName,
        productDimensions: data.productDimensions,
        productSize: data.productSize,
        productWeight: String(data.productWeight),
        productQuality: data.productQuality,
        status: data.status,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => courierApi.update(id!, { ...form, productWeight: Number(form.productWeight) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['couriers'] }); navigate('/couriers'); },
    onError: (err: any) => setError(err.response?.data?.message || 'Update failed'),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h4 className="fw-bold mb-4">Edit Courier</h4>
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Sender Name</label>
                <input className="form-control" required value={form.senderName} onChange={set('senderName')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Receiver Name</label>
                <input className="form-control" required value={form.receiverName} onChange={set('receiverName')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dimensions</label>
                <input className="form-control" value={form.productDimensions} onChange={set('productDimensions')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Size</label>
                <select className="form-select" value={form.productSize} onChange={set('productSize')}>
                  {['Small', 'Medium', 'Large', 'Extra Large'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Weight (kg)</label>
                <input type="number" step="0.01" className="form-control" value={form.productWeight} onChange={set('productWeight')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Quality</label>
                <select className="form-select" value={form.productQuality} onChange={set('productQuality')}>
                  {['Fragile', 'Standard', 'Hazardous', 'Perishable'].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  {['Pending', 'Dispatched', 'InTransit', 'Delivered'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save Changes'}
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
