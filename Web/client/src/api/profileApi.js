import { BASE_URL } from '@/config';
import { getAuth } from '@/lib/util';

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

    const {accessToken} = getAuth()
    const response = await fetch(`${BASE_URL}/users/upload-picture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${accessToken}`,
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
 * Gets the user profile picture
 * @returns {Promise<{profile_picture: string}>} The user profile picture URL
 * @throws {Error} If the request fails
 */
export const getProfilePicture = async () => {
  try {
    const {accessToken} = getAuth()
    const response = await fetch(`${BASE_URL}/users/get-picture`, {
      headers: {
        'Authorization': `Token ${accessToken}`,
      },
    }); 

    if (!response.ok) {
      throw new Error('Failed to fetch profile picture');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    throw error;
  }
};


export const updateProfile = async (data) => {
  try {
    const {accessToken} = getAuth()
    const response = await fetch(`${BASE_URL}/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${accessToken}`,  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
/**
 * Gets the user profile information
 * @returns {Promise<{message: string, profile_picture: string, firstname: string, lastname: string, email: string, phone: string}>} The user profile data
 * @throws {Error} If the request fails
 */
export const getProfile = async () => {
  try {
    const {accessToken} = getAuth()
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Token ${accessToken}`,
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