import axios from 'axios';

const BASE_URL = 'https://party-currency-app-production.up.railway.app';

const adminApi = {
  // Get admin dashboard statistics
  getAdminStatistics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-admin-statistics`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-users`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/delete-user/${email}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Activate user
  activateUser: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/activate-user/${email}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Suspend user
  suspendUser: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/suspend-user/${email}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminApi; 