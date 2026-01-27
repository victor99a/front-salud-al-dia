import axios from 'axios';

const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || "http://localhost:4000/api/admin";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthConfig = (tokenOverride) => {
  const token = tokenOverride || localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

export const isAdmin = async () => {
  try {
    const userEmail = localStorage.getItem("user_email");
    const token = localStorage.getItem("token");

    if (!userEmail || !token) return false;

    const response = await axios.post(
      `${API_ADMIN_URL}/verify-admin`, 
      { email: userEmail.toLowerCase() },
      getAuthConfig(token)
    );

    return response.data.isAdmin;
  } catch (error) {
    return false;
  }
};

export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${userId}`, 
      getAuthConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Error Auth User ${userId}:`, error.message);
    return null;
  }
};

export const requestPublicPasswordReset = async (email) => {
  try {
    await axios.post(
      `${API_ADMIN_URL}/send-reset-email`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};