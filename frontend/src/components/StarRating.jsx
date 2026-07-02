import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange = null, interactive = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        // Determine if filled
        const isFilled = interactive
          ? (hoverRating || rating) >= star
          : rating >= star;

        return (
          <Star
            key={star}
            size={size}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: 'transform 0.15s ease, fill 0.15s ease',
              transform: interactive && (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
            }}
            className={isFilled ? 'star-filled' : 'star-empty'}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
