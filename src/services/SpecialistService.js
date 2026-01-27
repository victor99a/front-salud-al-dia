import axios from 'axios';

const API_USERS_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_REGISTRO_URL = import.meta.env.VITE_API_REGISTRO_URL || 'http://localhost:3001';
const API_DOWNLOAD_URL = import.meta.env.VITE_API_DESCARGA || 'http://localhost:3002';

const getConfig = () => ({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export const getPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_USERS_URL}/users/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error(`Error getPatientById (${id}):`, error.message);
    return null;
  }
};

export const getPatients = async () => {
  try {
    const response = await axios.get(`${API_USERS_URL}/patients`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error getPatients:", error.message);
    return [];
  }
};

export const getMedicalRecord = async (userId) => {
  try {
    const response = await axios.get(`${API_USERS_URL}/medical/records/${userId}`, getConfig());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
        return null;
    }
    console.error("Error getMedicalRecord:", error.message);
    return null;
  }
};

export const getPatientDashboardData = async (userId) => {
  try {
    const response = await axios.get(`${API_REGISTRO_URL}/api/registros/dashboard/${userId}`, getConfig());
    return response.data;
  } catch (error) {
    return { glucose: null, pressure: null };
  }
};

export const getPatientHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_REGISTRO_URL}/api/registros/historial/${userId}`, getConfig());
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getDownloadUrl = (userId) => {
    return `${API_DOWNLOAD_URL}/api/descargas/historial/pdf/${userId}`;
};