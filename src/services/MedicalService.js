const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createMedicalRecord = async (data) => {
  try {
    const response = await fetch(`${API_URL}/medical/records`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear ficha');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMedicalRecord = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/medical/records/${userId}`, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        if(response.status === 404) return null;
        throw new Error('Error al cargar datos');
    }
    
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const updateMedicalRecord = async (userId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/medical/records/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error('Error al actualizar datos');
    return await response.json();
  } catch (error) {
    throw error;
  }
};