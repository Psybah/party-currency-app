import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

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

  const formData = new FormData();

  // Add text data using the exact field names from the API documentation
  formData.append("currency_name", currencyData.texts.currencyName);
  formData.append("front_celebration_text", currencyData.texts.celebration);
  formData.append(
    "back_celebration_text",
    currencyData.backTexts?.celebration || ""
  );
  formData.append("event_id", currencyData.eventId);
  formData.append("denomination", currencyData.denomination || "200");

  // Add images if they exist
  if (currencyData.portraitImage) {
    // Convert base64 to blob
    const frontImageBlob = await fetch(currencyData.portraitImage).then((r) =>
      r.blob()
    );
    formData.append("front_image", frontImageBlob);
  }

  if (currencyData.backPortraitImage) {
    const backImageBlob = await fetch(currencyData.backPortraitImage).then(
      (r) => r.blob()
    );
    formData.append("back_image", backImageBlob);
  }

  try {
    const response = await fetch(`${BASE_URL}/currencies/save-currency`, {
      method: "POST",
      headers: {
        Authorization: `Token ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to save currency");
    }

    return response.json();
  } catch (error) {
    console.error("Error saving currency:", error);
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
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${BASE_URL}/currencies/get-all-currencies`, {
      headers: {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch currencies");
    }

    const data = await response.json();
    return data.currencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
}

/**
 * Gets a currency by its ID
 * @param {string} currencyId - ID of the currency to fetch
 * @returns {Promise<{
 *   currency_id: string,
 *   currency_author: string,
 *   denomination: number,
 *   event_id: string,
 *   created_at: string,
 *   updated_at: string,
 *   currency_name: string,
 *   front_celebration_text: string,
 *   front_image: string,
 *   back_image: string,
 *   back_celebration_text: string
 * }>} Currency data
 * @throws {Error} If authentication is missing or request fails
 */

export async function getCurrencyById(currencyId) {
  const { accessToken } = getAuth();

  try {
    const response = await fetch(
      `${BASE_URL}/currencies/get-currency/${currencyId}`,
      {
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch currency");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching currency:", error);
    throw error;
  }
}

/**
 * Updates an existing currency
 * @param {string} currencyId - ID of the currency to update
 * @param {Object} formData - Form data containing updated currency fields
 * @param {string} [formData.currency_name] - Updated name of the currency
 * @param {string} [formData.front_celebration_text] - Updated celebration text for front side
 * @param {string} [formData.back_celebration_text] - Updated celebration text for back side
 * @param {File} [formData.front_image] - Updated image file for front side
 * @param {File} [formData.back_image] - Updated image file for back side
 * @param {string} [formData.event_id] - Updated associated event ID
 * @returns {Promise<{
 *   currency_id: string,
 *   currency_name: string,
 *   front_celebration_text: string,
 *   back_celebration_text: string,
 *   front_image: string,
 *   back_image: string,
 *   event_id: string,
 *   updated_at: string
 * }>} Updated currency data
 * @throws {Error} If authentication is missing or request fails
 */
export async function updateCurrency(currencyId, formData) {
  const { accessToken } = getAuth();
  if (!accessToken) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/currencies/update-currency/${currencyId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update currency");
    }

    const updatedCurrency = await response.json();
    return updatedCurrency;
  } catch (error) {
    console.error("Error updating currency:", error);
    throw error;
  }
}

/**
 * Deletes a currency
 * @param {string} currencyId - ID of the currency to delete
 * @returns {Promise<Object>} - Deletion response
 * @throws {Error} If request fails
 */
export async function deleteCurrency(currencyId) {
  const { accessToken } = getAuth();

  try {
    const response = await fetch(
      `${BASE_URL}/currencies/delete-currency/${currencyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.json();
  } catch (error) {
    console.error("Error deleting currency:", error);
    throw error;
  }
}
