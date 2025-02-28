import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const profileService = {
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.put(`${API_BASE_URL}/users/upload-picture`, formData, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProfilePicture() {
    const response = await axios.get(`${API_BASE_URL}/users/get-picture`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};
