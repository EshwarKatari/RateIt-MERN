import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCompanies } from '../utils/api';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';

const INDUSTRIES = ['', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Real Estate', 'Other'];
const SORTS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'name', label: 'Name A–Z' },
  { value: '-name', label: 'Name Z–A' },
];

export default function CompaniesPage() {
  const [params, setParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [search, setSearch] = useState(params.get('search') || '');
  const [industry, setIndustry] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCompanies({ search, industry, sort, page, limit: 12 });
      setCompanies(res.data);
      setPagination(res.pagination);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [search, industry, sort, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <>
      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} onSuccess={() => { setPage(1); load(); }} />}

      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>
                All Companies
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: '14px', marginTop: '4px' }}>
                {pagination.total} companies listed
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              + Add Company
            </button>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>🔍</span>
              <input
                className="form-input"
                placeholder="Search companies..."
                style={{ paddingLeft: '40px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="section" style={{ paddingTop: '32px' }}>
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          <select className="filter-select" value={industry} onChange={e => { setIndustry(e.target.value); setPage(1); }}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i || 'All Industries'}</option>)}
          </select>
          <span className="filter-label" style={{ marginLeft: '8px' }}>Sort:</span>
          <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {(search || industry) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setIndustry(''); setPage(1); }} style={{ marginLeft: 'auto' }}>
              ✕ Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No companies found</div>
            <div className="empty-sub">Try adjusting your search or filters</div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add This Company</button>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map(c => <CompanyCard key={c._id} company={c} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--text-3)' }}>…</span>}
                  <button className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                </React.Fragment>
              ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
