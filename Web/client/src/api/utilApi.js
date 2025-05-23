import { BASE_URL } from '@/config';
import { getAuth } from '@/lib/util';

/**
 * Fetches a currency image from the backend
 * @param {string} driveUrl - The Google Drive URL of the image
 * @returns {Promise<string>} The URL of the image served by our backend
 */

export const getDriveImage = async (driveUrl) => {
  try {
    const encodedUrl = encodeURIComponent(driveUrl);
    const response = await fetch(`${BASE_URL}/currencies/download-image?url=${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${getAuth().accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching currency image:', error);
    throw error;
  }
};
