import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

/**
 * Fetches the active reserved virtual account for the merchant.
 *
 * @async
 * @function getVirtualAccount
 * @returns {Promise<{account_reference: string}>} A promise that resolves to the virtual account details.
 * @throws {Error} Throws an error if the request fails or the response is not ok.
 */
export async function getVirtualAccount() {
  const url = `${BASE_URL}/merchant/get-active-reserved-account`;
  const { accessToken } = getAuth();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch virtual account");
    }

    return data;
  } catch (error) {
    console.error("Error fetching virtual account:", error);
    throw error;
  }
}

/**
 * Deletes a reserved virtual account for the merchant.
 *
 * @async
 * @function deleteVirtualAccount
 * @param {string} accountReference - The reference of the account to be deleted.
 * @returns {Promise<{account_reference: string}>} A promise that resolves to the response of the delete operation.
 * @throws {Error} Throws an error if the request fails or the response is not ok.
 */
export async function deleteVirtualAccount(accountReference) {
  const url = `${BASE_URL}/merchant/delete-reserved-account?account_reference=${accountReference}`;
  const { accessToken } = getAuth();

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete virtual account");
    }

    return data;
  } catch (error) {
    console.error("Error deleting virtual account:", error);
    throw error;
  }
}

export const fetchTransactions = async (reference) => {
  try {
    const { accessToken } = getAuth();
    if (!accessToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${BASE_URL}/merchant/transactions?account_reference=${reference}`,
      {
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("No virtual accounts found. Create one to get started.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
