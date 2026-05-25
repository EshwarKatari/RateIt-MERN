import React, { useState } from 'react';
import { RatingDisplay } from './StarRating';
import { likeReview } from '../utils/api';
import toast from 'react-hot-toast';

const SUB_LABELS = {
  workLifeBalance: '⚖️ Work-Life',
  culture: '🌱 Culture',
  growth: '📈 Growth',
  compensation: '💰 Pay'
};

export default function ReviewCard({ review, onDelete }) {
  const [likes, setLikes] = useState(review.likes || 0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liked || liking) return;
    setLiking(true);
    try {
      const res = await likeReview(review._id);
      setLikes(res.data.likes);
      setLiked(true);
    } catch {
      toast.error('Failed to like review');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const subRatings = ['workLifeBalance', 'culture', 'growth', 'compensation']
    .filter(k => review[k] > 0);

  const initials = review.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="review-card animate-in">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">{initials}</div>
          <div>
            <div className="reviewer-name">{review.fullName}</div>
            <div className="reviewer-type">{review.employmentType}</div>
          </div>
        </div>
        <div className="review-rating-meta">
          <RatingDisplay rating={review.rating} />
          {review.isRecommended && (
            <span className="recommend-badge">✓ Recommends</span>
          )}
        </div>
      </div>

      <div className="review-subject">{review.subject}</div>
      <div className="review-text">{review.reviewText}</div>

      {subRatings.length > 0 && (
        <div className="review-sub-ratings">
          {subRatings.map(k => (
            <div key={k} className="sub-rating">
              <div className="sub-rating-label">{SUB_LABELS[k]}</div>
              <div className="sub-rating-val">{review[k]}<span style={{ fontSize: '10px', color: 'var(--text-3)' }}>/5</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="review-footer">
        <span className="review-date">{date}</span>
        <div className="review-actions">
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={liking}>
            {liked ? '❤️' : '🤍'} {likes}
          </button>
          <button className="like-btn" onClick={handleShare}>
            🔗 Share
          </button>
          {onDelete && (
            <button className="btn btn-ghost btn-sm" onClick={() => onDelete(review._id)} style={{ color: 'var(--danger)', padding: '6px 10px' }}>
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
