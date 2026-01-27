import axios from 'axios';

const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || 'http://localhost:4000/api/admin';

const getConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_ADMIN_URL}/stats`, getConfig());
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_ADMIN_URL}/users`, getConfig());
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createSpecialist = async (userData) => {
  try {
    await axios.post(`${API_ADMIN_URL}/create-specialist`, userData, getConfig());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const resetUserPassword = async (email) => {
  try {
    await axios.post(`${API_ADMIN_URL}/send-reset-email`, { email }, getConfig());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const updatePasswordFinal = async (email, newPassword) => {
  try {
    await axios.post(`${API_ADMIN_URL}/update-password`, { email, newPassword }, getConfig());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_ADMIN_URL}/users/${userId}`, getConfig());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const requestAccountDeletion = async (userId) => {
  try {
    await axios.patch(`${API_ADMIN_URL}/users/request-deletion/${userId}`, {}, getConfig());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const verifyAdminStatus = async (email) => {
  try {
    const response = await axios.post(`${API_ADMIN_URL}/verify-admin`, { email: email.toLowerCase() }, getConfig());
    return response.data.isAdmin;
  } catch (error) {
    return false;
  }
};