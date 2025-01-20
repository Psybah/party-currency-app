import React, { useState } from 'react';

export const LazyImage = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate WebP version URL if the source is a local image
  const getWebPUrl = (url) => {
    if (url.startsWith('/')) {
      return url.replace(/\.(jpg|jpeg|png)$/, '.webp');
    }
    return url;
  };

  // Generate a tiny placeholder version for blur effect
  const getPlaceholderUrl = (url) => {
    if (url.startsWith('/')) {
      return url.replace(/\.(jpg|jpeg|png)$/, '-placeholder.jpg');
    }
    return url;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Blur placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <picture>
        {/* WebP version */}
        <source
          srcSet={getWebPUrl(src)}
          type="image/webp"
        />
        
        {/* Original format as fallback */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error(`Error loading image: ${src}`);
            e.target.src = '/placeholder.svg';
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          srcSet={`
            ${src}?w=400 400w,
            ${src}?w=800 800w,
            ${src}?w=1200 1200w
          `}
        />
      </picture>
    </div>
  );
};