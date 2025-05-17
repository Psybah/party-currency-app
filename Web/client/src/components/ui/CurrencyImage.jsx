import { useState, useEffect } from 'react';
import { getDriveImage } from '@/api/utilApi';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyCanvas } from '../currency/CurrencyCanvas';

// Utility function to download and process currency image
export async function downloadCurrencyImage(driveUrl, denomination, side) {
  if (!driveUrl) {
    return `/lovable-uploads/${denomination}-${side}.jpg`;
  }

  try {
    const objectUrl = await getDriveImage(driveUrl);
    return objectUrl;
  } catch (err) {
    console.error('Error loading currency image:', err);
    return ``;
  }
}

export function CurrencyImage({ driveUrl, alt, className, denomination, side }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl = null;

    const loadImage = async () => {
      setIsLoading(true);
      setError(false);

      try {
        objectUrl = await downloadCurrencyImage(driveUrl, denomination, side);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error('Error loading currency image:', err);
        setError(true);
        setImageUrl(`/lovable-uploads/${denomination}-${side}.jpg`);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [driveUrl, denomination, side]);

  if (isLoading) {
    return <Skeleton className={className || "w-full h-64"} />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => {
        if (!error) {
          setError(true);
          setImageUrl(`/lovable-uploads/${denomination}-${side}.jpg`);
        }
      }}
    />
  );
}