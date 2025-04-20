import axios from 'axios';
import { getAuth } from '@/lib/util';
import { BASE_URL } from '@/config';

const adminApi = {
  // Get admin dashboard statistics
  getAdminStatistics: async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/admin/get-admin-statistics`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/admin/get-users`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      // Ensure we return an array
      const data = response.data;
      return Array.isArray(data) ? data : data?.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.delete(`${BASE_URL}/admin/delete-user/${email}`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || error.message;
    }
  },

  // Activate user
  activateUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.put(`${BASE_URL}/admin/activate-user/${email}`, {}, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error.response?.data || error.message;
    }
  },

  // Suspend user
  suspendUser: async (email) => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.put(`${BASE_URL}/admin/suspend-user/${email}`, {}, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default adminApi; 