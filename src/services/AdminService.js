const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || 'http://localhost:4000/api/admin';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getStats = async () => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/stats`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al cargar usuarios');
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const resetUserPassword = async (email) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/send-reset-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al enviar correo');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updatePasswordFinal = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/update-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al actualizar contraseña');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al eliminar usuario');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const requestAccountDeletion = async (userId) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users/request-deletion/${userId}`, {
      method: 'PATCH',
      headers: getHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al solicitar eliminación');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const verifyAdminStatus = async (email) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/verify-admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email: email.toLowerCase() })
    });

    if (!response.ok) return false;
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    return false;
  }
};