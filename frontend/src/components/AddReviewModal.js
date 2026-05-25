import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createReview } from '../utils/api';
import { StarRating } from './StarRating';

const SUB_RATINGS = [
  { key: 'workLifeBalance', label: 'Work-Life Balance' },
  { key: 'culture', label: 'Culture' },
  { key: 'growth', label: 'Career Growth' },
  { key: 'compensation', label: 'Compensation' },
];

export default function AddReviewModal({ company, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '', subject: '', reviewText: '', rating: 0,
    workLifeBalance: 0, culture: 0, growth: 0, compensation: 0,
    employmentType: 'Full-time', isRecommended: true
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.subject || !form.reviewText || !form.rating) {
      toast.error('Please fill in all required fields and provide a rating');
      return;
    }
    setLoading(true);
    try {
      await createReview({ ...form, company: company._id });
      toast.success('Review submitted! Thank you 🙌');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Write a Review</div>
            <div style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>for {company.name}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Overall Rating *</label>
            <StarRating value={form.rating} onChange={v => set('rating', v)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Your Full Name *</label>
              <input className="form-input" placeholder="John Doe" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select className="form-select" value={form.employmentType} onChange={e => set('employmentType', e.target.value)}>
                {['Full-time', 'Part-time', 'Contract', 'Intern'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Would You Recommend?</label>
              <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                {[true, false].map(v => (
                  <button
                    key={String(v)}
                    className={`btn btn-sm ${form.isRecommended === v ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => set('isRecommended', v)}
                    style={{ flex: 1 }}
                  >
                    {v ? '👍 Yes' : '👎 No'}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Review Subject *</label>
              <input className="form-input" placeholder="e.g. Great place to grow your career" value={form.subject} onChange={e => set('subject', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Your Review *</label>
              <textarea className="form-textarea" placeholder="Share your experience working at this company..." value={form.reviewText} onChange={e => set('reviewText', e.target.value)} />
            </div>
          </div>

          {/* Sub-ratings */}
          <div>
            <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Detailed Ratings (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SUB_RATINGS.map(r => (
                <div key={r.key} style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.label}</div>
                  <StarRating value={form[r.key]} onChange={v => set(r.key, v)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : '✦ Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
