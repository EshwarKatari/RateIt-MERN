import React, { useState } from 'react';

export function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0);

  return (
    <div className={`star-rating ${size === 'sm' ? 'star-rating-sm' : ''}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`star ${i <= (hover || value) ? 'filled' : ''}`}
          onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function RatingDisplay({ rating, count, large }) {
  const filled = Math.floor(rating);
  const partial = rating - filled;
  return (
    <div className="rating-display" style={{ flexWrap: 'wrap', gap: '6px' }}>
      {large && <span className="rating-big">{rating ? rating.toFixed(1) : '—'}</span>}
      <div className="star-rating star-rating-sm" style={{ alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className="star"
            style={{
              color: i <= filled ? '#f59e0b' : i === filled + 1 && partial > 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)',
              opacity: i === filled + 1 && partial > 0 ? partial : 1,
              fontSize: large ? '20px' : '14px'
            }}
          >★</span>
        ))}
      </div>
      {count !== undefined && (
        <span className="rating-count">({count} review{count !== 1 ? 's' : ''})</span>
      )}
    </div>
  );
}
