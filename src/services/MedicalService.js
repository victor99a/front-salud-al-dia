const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getMedicalRecord = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/medical/records/${userId}`);
    
    if (!response.ok) {
        if(response.status === 404) return null;
        throw new Error('Error al cargar datos');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateMedicalRecord = async (userId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/medical/records/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error('Error al actualizar datos');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};