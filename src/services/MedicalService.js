import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const createMedicalRecord = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/medical/records`, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error en createMedicalRecord:", error);
    throw new Error(error.response?.data?.error || 'Error al crear ficha');
  }
};

export const getMedicalRecord = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/medical/records/${userId}`, getConfig());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
        console.warn("Ficha médica no encontrada (404) para usuario:", userId);
        return null;
    }
    console.error("Error de red en getMedicalRecord:", error.message);
    return null;
  }
};

export const updateMedicalRecord = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/medical/records/${userId}`, updatedData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error en updateMedicalRecord:", error);
    throw new Error(error.response?.data?.error || 'Error al actualizar datos');
  }
};