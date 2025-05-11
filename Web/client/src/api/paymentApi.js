
/**
 * @typedef {Object} CreateTransactionResponse
 * @property {string} payment_reference - The generated payment reference
 */

import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

/**
 * @typedef {Object} PayResponse
 * @property {boolean} requestSuccessful - Whether the request was successful
 * @property {string} responseMessage - Response message from the API
 * @property {string} responseCode - Response code from the API
 * @property {Object} responseBody - The response body containing payment details
 * @property {string} responseBody.transactionReference - The transaction reference
 * @property {string} responseBody.paymentReference - The payment reference
 * @property {string} responseBody.merchantName - The merchant name
 * @property {string} responseBody.apiKey - The API key used
 * @property {string} responseBody.redirectUrl - The callback URL
 * @property {string[]} responseBody.enabledPaymentMethod - Array of enabled payment methods
 * @property {string} responseBody.checkoutUrl - The generated payment link
 */




/**
 * Creates a new payment transaction for an event
 * @param {string} eventId - The ID of the event to create payment for
 * @param {number} amount - The total amount to be paid
 * @param {Object} currency - Object containing denomination counts
 * @param {number} currency["200"] - Count of ₦200 notes
 * @param {number} currency["500"] - Count of ₦500 notes
 * @param {number} currency["1000"] - Count of ₦1000 notes
 * @returns {Promise<CreateTransactionResponse>} The payment reference
 * @throws {Error} If the API request fails
 */
export const createTransaction = async (eventId, amount, currency) => {
  const { accessToken } = getAuth();
  
  if (!accessToken) {
    throw new Error("Please log in to create a transaction");
  }

  try {
    const response = await fetch(`${BASE_URL}/payments/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${accessToken}`
      },
      body: JSON.stringify({ event_id: eventId, amount, currency })
    });

    if (!response.ok) {
      throw new Error(`Failed to create transaction: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Generates a payment link using a payment reference
 * @param {string} paymentReference - The payment reference from createTransaction
 * @returns {Promise<PayResponse>} The payment link
 * @throws {Error} If the API request fails
 */
export const generatePaymentLink = async (paymentReference) => {
  const { accessToken } = getAuth();
  
  if (!accessToken) {
    throw new Error("Please log in to generate payment link");
  }

  try {
    const response = await fetch(`${BASE_URL}/payments/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${accessToken}`
      },
      body: JSON.stringify({ payment_reference: paymentReference })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate payment link: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating payment link:', error);
    throw error;
  }
};
