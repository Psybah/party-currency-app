/**
 * @typedef {Object} CreateTransactionResponse
 * @property {string} payment_reference - The generated payment reference
 */

import { BASE_URL } from "@/config";

/**
 * @typedef {Object} PayResponse
 * @property {string} payment_link - The generated payment link
 */

/**
 * Creates a new payment transaction for an event
 * @param {string} eventId - The ID of the event to create payment for
 * @returns {Promise<CreateTransactionResponse>} The payment reference
 * @throws {Error} If the API request fails
 */
export const createTransaction = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
      },
      body: JSON.stringify({ event_id: eventId })
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
  try {
      const response = await fetch(`${BASE_URL}/payments/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
      },
      body: JSON.stringify({ payment_refrence: paymentReference })
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
