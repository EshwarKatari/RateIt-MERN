import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../utils/api';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';

export default function HomePage() {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({ total: 0, reviews: 0 });
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCompanies({ limit: 6 });
      setCompanies(res.data);
      setStats({ total: res.pagination.total, reviews: res.data.reduce((a, c) => a + (c.numReviews || 0), 0) });
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/companies?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} onSuccess={load} />}

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>✦</span> Trusted by thousands of job seekers
          </div>
          <h1 className="hero-title">
            Find companies<br />
            <span className="accent">worth working for</span>
          </h1>
          <p className="hero-sub">
            Real reviews from real employees. Discover salary insights, culture, and what it's truly like to work there.
          </p>

          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <span style={{ color: 'var(--text-3)', fontSize: '18px' }}>🔍</span>
              <input
                className="search-input"
                placeholder="Search companies, cities, industries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{stats.total}+</div>
              <div className="hero-stat-label">Companies Listed</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{stats.reviews}+</div>
              <div className="hero-stat-label">Honest Reviews</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">4.2★</div>
              <div className="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: '800', marginBottom: '4px' }}>
              Featured Companies
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>Recently added companies awaiting your review</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setShowAdd(true)}>
              + Add Company
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/companies')}>
              View All →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <div className="empty-title">No companies yet</div>
            <div className="empty-sub">Be the first to add a company profile</div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add First Company</button>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map(c => <CompanyCard key={c._id} company={c} />)}
          </div>
        )}

        {/* CTA section */}
        <div style={{
          marginTop: '80px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✍️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
              Know a company? Share your experience.
            </h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Help thousands of job seekers make informed decisions. Your honest review matters.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/companies')}>
              Browse & Review Companies
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
