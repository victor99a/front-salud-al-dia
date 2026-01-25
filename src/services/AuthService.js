const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || "http://localhost:4000/api/admin";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const isAdmin = async () => {
  try {
    const userEmail = localStorage.getItem("user_email");
    const token = localStorage.getItem("token");

    if (!userEmail || !token) return false;

    const response = await fetch(`${API_ADMIN_URL}/verify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: userEmail.toLowerCase() }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    return false;
  }
};

export const getUserProfile = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    return null;
  }
};

export const requestPublicPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/send-reset-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al enviar correo');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};