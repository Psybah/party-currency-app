import { BASE_URL } from '@/config';

/**
 * Uploads a profile picture to the server
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} The server response
 * @throws {Error} If the request fails
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(`${BASE_URL}/users/upload-picture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Gets the user profile information
 * @returns {Promise<Object>} The user profile data
 * @throws {Error} If the request fails
 */
export const getProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
}; 