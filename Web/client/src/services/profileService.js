import axios from 'axios';
import { BASE_URL } from '../config';

export const profileService = {
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.put(`${BASE_URL}/users/upload-picture`, formData, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProfilePicture() {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};
