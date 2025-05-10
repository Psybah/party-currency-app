import { API_BASE_URL } from '@/config';
import { getAuth } from '@/lib/util';

/**
 * Saves currency data including images and text information
 * @param {Object} currencyData - The currency data to save
 * @param {Object} currencyData.texts - Text data for the currency
 * @param {string} currencyData.texts.currencyName - The name of the currency
 * @param {string} currencyData.texts.celebration - The front celebration text
 * @param {string} currencyData.backTexts.celebration - The back celebration text (optional)
 * @param {string} currencyData.portraitImage - Base64 string of the front image
 * @param {string} currencyData.backPortraitImage - Base64 string of the back image (optional)
 * @param {string} currencyData.eventId - The ID of the associated event (optional)
 * @returns {Promise<Object>} - Response from the API
 * @throws {Error} If authentication is missing or request fails
 */
export async function saveCurrency(currencyData) {
  const { accessToken } = getAuth();
  if (!accessToken) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  
  // Add text data using the exact field names from the API documentation
  formData.append('currency_name', currencyData.texts.currencyName);
  formData.append('front_celebration_text', currencyData.texts.celebration);
  formData.append('back_celebration_text', currencyData.backTexts?.celebration || '');
  
  // Add images if they exist
  if (currencyData.portraitImage) {
    // Convert base64 to blob
    const frontImageBlob = await fetch(currencyData.portraitImage).then(r => r.blob());
    formData.append('front_image', frontImageBlob);
  }
  
  if (currencyData.backPortraitImage) {
    const backImageBlob = await fetch(currencyData.backPortraitImage).then(r => r.blob());
    formData.append('back_image', backImageBlob);
  }

  // Add event ID if it exists
  if (currencyData.eventId) {
    formData.append('event_id', currencyData.eventId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/currencies/save-currency`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to save currency');
    }

    return response.json();
  } catch (error) {
    console.error('Error saving currency:', error);
    throw error;
  }
}

/**
 * Fetches all currencies
 * @returns {Promise<Object>} - List of currencies
 * @throws {Error} If authentication is missing or request fails
 */
export async function getAllCurrencies() {
  const { accessToken } = getAuth();
  if (!accessToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/currencies/get-all-currencies`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch currencies');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
} 