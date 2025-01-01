import { BASE_URL } from "@/config";

/**
 * Login a customer by sending email and password to the backend.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Response>} The API response.
 */
export async function loginCustomerApi(email, password) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Fetch the customer profile using a valid access token.
 * @param {string} token - The access token from login.
 * @returns {Promise<Response>} The API response.
 */
export async function getCustomerProfile(token) {
  return fetch(`${BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Helper function to store authentication data securely.
 * @param {string} token - The access token.
 * @param {string} userType - The type of user (e.g., "customer").
 * @param {boolean} remember - Whether to store data in localStorage or sessionStorage.
 */
export function storeAuth(token, userType, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
  storage.setItem("userType", userType);
}

/**
 * Helper function to retrieve the stored token from localStorage/sessionStorage.
 * @returns {string|null} The access token, or null if not found.
 */
export function getAuthToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Helper function to clear authentication data from storage.
 */
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userType");
}
