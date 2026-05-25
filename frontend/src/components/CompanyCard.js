import React from 'react';
import { Link } from 'react-router-dom';
import { RatingDisplay } from './StarRating';

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function CompanyCard({ company }) {
  const { _id, name, city, location, description, logo, industry, size, foundedOn, avgRating, numReviews } = company;

  return (
    <Link to={`/companies/${_id}`} className="company-card animate-in">
      <div className="company-card-header">
        <div className="company-logo">
          {logo ? <img src={`http://localhost:5000${logo}`} alt={name} /> : getInitials(name)}
        </div>
        <div className="company-meta">
          <div className="company-name">{name}</div>
          <div className="company-location">
            <span>📍</span> {city}, {location}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
            {industry && <span className="badge badge-accent">{industry}</span>}
            {size && <span className="badge badge-muted">👥 {size}</span>}
            {foundedOn && <span className="badge badge-muted">Est. {foundedOn}</span>}
          </div>
        </div>
      </div>

      {description && <p className="company-desc">{description}</p>}

      <div className="company-footer">
        <RatingDisplay rating={avgRating || 0} count={numReviews || 0} />
        <span style={{ color: 'var(--accent-2)', fontSize: '13px', fontWeight: '500' }}>
          View →
        </span>
      </div>
    </Link>
  );
}
