import axios from "axios";
import { getAuth } from "@/lib/util";
import { BASE_URL } from "@/config";

const adminApi = {
  // Get admin dashboard statistics
  /**
   * Fetches admin dashboard statistics
   * @returns {Promise<{
   *   total_active_users: number,
   *   new_active_users_this_week: number,
   *   new_active_users_previous_week: number,
   *   percentage_increase: number,
   *   total_completed_transactions: number,
   *   total_pending_transactions: number,
   *   transactions_this_week: number,
   *   percentage_increase_transactions: number,
   *   total_events: number,
   *   events_this_week: number,
   *   percentage_increase_events: number
   * }>} Admin statistics data
   * @throws {Error} If the request fails
   */
  getAdminStatistics: async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(
        `${BASE_URL}/admin/get-admin-statistics`,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/admin/get-users`, {
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      // Ensure we return an array
      const data = response.data;
      return Array.isArray(data) ? data : data?.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.delete(
        `${BASE_URL}/admin/delete-user/${email}`,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error.response?.data || error.message;
    }
  },

  // Activate user
  activateUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.put(
        `${BASE_URL}/admin/activate-user/${email}`,
        {},
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error activating user:", error);
      throw error.response?.data || error.message;
    }
  },

  // Suspend user
  suspendUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.put(
        `${BASE_URL}/admin/suspend-user/${email}`,
        {},
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error suspending user:", error);
      throw error.response?.data || error.message;
    }
  },
  /**
   * Fetches events with pagination, search and sorting
   * @param {number} [page=1] - Page number
   * @param {number} [pageSize=10] - Number of items per page
   * @param {string} [search=""] - Search query
   * @param {string} [sortBy="-created_at"] - Sort field and direction
   * @returns {Promise<{
   *   events: Array<{
   *     event_id: string,
   *     event_name: string,
   *     event_description: string,
   *     event_author: string,
   *     street_address: string,
   *     city: string,
   *     LGA: string,
   *     state: string,
   *     postal_code: number,
   *     start_date: string,
   *     end_date: string,
   *     delivery_address: string,
   *     created_at: string,
   *     updated_at: string,
   *     reconciliation: boolean,
   *     transaction_id: string|null,
   *     payment_status: string,
   *     delivery_status: string,
   *     currency_id: string|null
   *   }>,
   *   pagination: {
   *     current_page: number,
   *     page_size: number,
   *     total_pages: number,
   *     total_count: number,
   *     has_next: boolean,
   *     has_previous: boolean,
   *     next_page: number|null,
   *     previous_page: number|null
   *   },
   *   filters: {
   *     search: string,
   *     sort_by: string
   *   }
   * }>}
   */
  getEvents: async (
    page = 1,
    pageSize = 10,
    search = "",
    sortBy = "-created_at"
  ) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/admin/get-events`, {
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          page,
          page_size: pageSize,
          search,
          sort_by: sortBy,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update delivery status for an event
  changeDeliveryStatus: async (eventId, deliveryStatus) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.post(
        `${BASE_URL}/admin/change-event-status`,
        { event_id: eventId, new_status: deliveryStatus },
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches a user by their email address
   * @param {string} email - The email address of the user to fetch
   * @returns {Promise<{
   *   message: string,
   *   user: {
   *     email: string,
   *     first_name: string,
   *     last_name: string,
   *     phone_number: string,
   *     type: string
   *   }
   * }>} The user data and success message
   * @throws {Error} If the request fails
   */
  getUserByEmail: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/admin/get-user`, {
        params: { email },
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error.response?.data || error.message;
    }
  },
  /**
   * Fetches all transactions from the admin API
   * @returns {Promise<{
   *   message: string,
   *   transactions: Array<{
   *     amount: string,
   *     customer_name: string,
   *     status: string,
   *     event_id: string,
   *     customer_email: string,
   *     payment_reference: string,
   *     payment_description: string,
   *     currency_code: string,
   *     contract_code: string,
   *     breakdown: string
   *   }>
   * }>} The transactions data and success message
   * @throws {Error} If the request fails
   */
  getAllTransactions: async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(
        `${BASE_URL}/admin/get-all-transactions`,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default adminApi;
