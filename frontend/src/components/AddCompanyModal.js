import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { createCompany } from '../utils/api';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Real Estate', 'Other'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export default function AddCompanyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', location: '', city: '', foundedOn: '', description: '', website: '', industry: '', size: '1-10' });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.city || !form.foundedOn) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append('logo', logo);
      await createCompany(fd);
      toast.success('Company added successfully! 🎉');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Add Company</div>
            <div style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>Create a new company profile</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Logo upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              className="company-logo"
              style={{ width: '64px', height: '64px', borderRadius: '14px', cursor: 'pointer', position: 'relative' }}
              onClick={() => fileRef.current.click()}
            >
              {logoPreview ? <img src={logoPreview} alt="logo" /> : <span style={{ fontSize: '24px' }}>🏢</span>}
            </div>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current.click()}>Upload Logo</button>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>JPG, PNG, SVG up to 5MB</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Company Name *</label>
              <input className="form-input" placeholder="e.g. Acme Corporation" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input className="form-input" placeholder="e.g. Mumbai" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" placeholder="e.g. India" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Founded Year *</label>
              <input className="form-input" type="number" placeholder="e.g. 2010" value={form.foundedOn} onChange={e => set('foundedOn', e.target.value)} min={1800} max={new Date().getFullYear()} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select className="form-select" value={form.size} onChange={e => set('size', e.target.value)}>
                {SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={form.industry} onChange={e => set('industry', e.target.value)}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-input" placeholder="https://example.com" value={form.website} onChange={e => set('website', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Brief description of the company..." value={form.description} onChange={e => set('description', e.target.value)} style={{ minHeight: '80px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : '✦ Create Company'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
