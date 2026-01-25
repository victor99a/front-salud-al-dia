const API_USERS_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_REGISTRO_URL = import.meta.env.VITE_API_REGISTRO_URL || 'http://localhost:3001';
const API_DOWNLOAD_URL = import.meta.env.VITE_API_DESCARGA || 'http://localhost:3002';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getPatients = async () => {
  try {
    const response = await fetch(`${API_USERS_URL}/patients`, { 
        headers: getHeaders() 
    });
    if (!response.ok) throw new Error('Error al cargar lista de pacientes');
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const getMedicalRecord = async (userId) => {
  try {
    const response = await fetch(`${API_USERS_URL}/medical/records/${userId}`, { 
        headers: getHeaders() 
    });
    
    if (response.status === 404) return null;

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    return null;
  }
};

export const getPatientDashboardData = async (userId) => {
  try {
    const response = await fetch(`${API_REGISTRO_URL}/api/registros/dashboard/${userId}`, { 
        headers: getHeaders() 
    });
    if (!response.ok) return { glucose: null, pressure: null };
    return await response.json();
  } catch (error) {
    return { glucose: null, pressure: null };
  }
};

export const getPatientHistory = async (userId) => {
  try {
    const response = await fetch(`${API_REGISTRO_URL}/api/registros/historial/${userId}`, { 
        headers: getHeaders() 
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const getDownloadUrl = (userId) => {
    return `${API_DOWNLOAD_URL}/api/descargas/historial/pdf/${userId}`;
};