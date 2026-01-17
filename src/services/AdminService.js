const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || 'http://localhost:4000/api/admin';

export const getStats = async () => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/stats`);
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
  } catch (error) {
    console.error("Error getStats:", error);
    return null;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users`);
    if (!response.ok) throw new Error('Error al cargar usuarios');
    return await response.json();
  } catch (error) {
    console.error("Error getUsers:", error);
    return [];
  }
};

export const resetUserPassword = async (email) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/send-reset-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al enviar correo');
    
    return { success: true };
  } catch (error) {
    console.error("Error resetUserPassword:", error);
    return { success: false, error: error.message };
  }
};

export const updatePasswordFinal = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al actualizar contraseña');

    return { success: true };
  } catch (error) {
    console.error("Error updatePasswordFinal:", error);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users/${userId}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al eliminar usuario');

    return { success: true };
  } catch (error) {
    console.error("Error deleteUser:", error);
    return { success: false, error: error.message };
  }
};

export const requestAccountDeletion = async (userId) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/users/request-deletion/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al solicitar eliminación');

    return { success: true };
  } catch (error) {
    console.error("Error requestAccountDeletion:", error);
    return { success: false, error: error.message };
  }
};