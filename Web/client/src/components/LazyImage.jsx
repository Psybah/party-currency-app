import React from 'react';

export const LazyImage = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        console.error(`Error loading image: ${src}`);
        e.target.src = '/placeholder.svg'; // Fallback image
      }}
    />
  );
};