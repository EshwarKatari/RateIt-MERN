import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany, getReviews, deleteReview } from '../utils/api';
import { RatingDisplay } from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import AddReviewModal from '../components/AddReviewModal';
import toast from 'react-hot-toast';

const SORTS = [
  { value: '-createdAt', label: '🕐 Most Recent' },
  { value: '-rating', label: '⭐ Highest Rated' },
  { value: 'rating', label: '👎 Lowest Rated' },
  { value: '-likes', label: '❤️ Most Liked' },
];

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function RatingSummary({ stats, reviews }) {
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));
  const max = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="rating-summary">
      <div className="rating-big-block">
        <div className="rating-big-num">{stats?.avgRating ? stats.avgRating.toFixed(1) : '—'}</div>
        <RatingDisplay rating={stats?.avgRating || 0} />
        <div className="rating-big-label">{stats?.numReviews || 0} reviews</div>
      </div>
      <div className="rating-bars">
        {counts.map(({ star, count }) => (
          <div key={star} className="rating-bar-row">
            <span className="rating-bar-label">{star}</span>
            <span style={{ color: 'var(--gold)', fontSize: '12px' }}>★</span>
            <div className="rating-bar-track">
              <div className="rating-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="rating-bar-count">{count}</span>
          </div>
        ))}
      </div>
      {stats?.numReviews > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Stats</div>
          {[
            { label: '👍 Recommend', val: `${Math.round(reviews.filter(r => r.isRecommended).length / reviews.length * 100)}%` },
            { label: '⭐ Best Rating', val: Math.max(...reviews.map(r => r.rating)) + '/5' },
            { label: '❤️ Most Liked', val: Math.max(...reviews.map(r => r.likes || 0)) + ' likes' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-3)', borderRadius: '8px', padding: '8px 12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text)' }}>{s.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const loadCompany = useCallback(async () => {
    try {
      const res = await getCompany(id);
      setCompany(res.data);
    } catch {
      toast.error('Company not found');
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await getReviews({ company: id, sort, page, limit: 5 });
      setReviews(res.data);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, sort, page]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadCompany();
      setLoading(false);
    };
    init();
  }, [loadCompany]);

  useEffect(() => { if (company) loadReviews(); }, [loadReviews, company]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted');
      loadReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!company) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <div className="empty-title">Company not found</div>
      <Link to="/companies" className="btn btn-primary" style={{ marginTop: '16px' }}>← Back to Companies</Link>
    </div>
  );

  return (
    <>
      {showAdd && <AddReviewModal company={company} onClose={() => setShowAdd(false)} onSuccess={() => { loadCompany(); loadReviews(); }} />}

      {/* Company Hero */}
      <div className="company-hero">
        <div className="company-hero-bg" />
        <div className="company-hero-inner">
          <div className="company-hero-logo">
            {company.logo ? <img src={`http://localhost:5000${company.logo}`} alt={company.name} /> : getInitials(company.name)}
          </div>
          <div className="company-hero-info">
            <div style={{ marginBottom: '8px' }}>
              <Link to="/companies" style={{ color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none' }}>← Companies</Link>
            </div>
            <h1 className="company-hero-name">{company.name}</h1>
            <div className="company-hero-meta">
              <span className="meta-item">📍 {company.city}, {company.location}</span>
              {company.foundedOn && <span className="meta-item">📅 Est. {company.foundedOn}</span>}
              {company.size && <span className="meta-item">👥 {company.size} employees</span>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="meta-item" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>
                  🔗 Website
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {company.industry && <span className="badge badge-accent">{company.industry}</span>}
            </div>
            {company.description && (
              <p style={{ color: 'var(--text-2)', fontSize: '14px', maxWidth: '560px', lineHeight: 1.7 }}>{company.description}</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
              <RatingDisplay rating={stats?.avgRating || 0} count={stats?.numReviews || 0} large />
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                ✦ Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="reviews-section">
        {stats?.numReviews > 0 && <RatingSummary stats={stats} reviews={reviews} />}

        <div className="section-header">
          <h2 className="section-title">
            {stats?.numReviews || 0} Review{stats?.numReviews !== 1 ? 's' : ''}
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              + Add Review
            </button>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-title">No reviews yet</div>
            <div className="empty-sub">Be the first to share your experience at {company.name}</div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>✦ Write First Review</button>
          </div>
        ) : (
          <>
            {reviews.map(r => <ReviewCard key={r._id} review={r} onDelete={handleDelete} />)}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
