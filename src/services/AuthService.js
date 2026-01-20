const API_ADMIN_URL =
  import.meta.env.VITE_API_ADMIN_URL || "http://localhost:4000/api/admin";

export const isAdmin = async () => {
  try {
    const userEmail = localStorage.getItem("user_email");
    const token = localStorage.getItem("token");

    if (!userEmail || !token) {
      return false;
    }

    const response = await fetch(`${API_ADMIN_URL}/verify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: userEmail.toLowerCase() }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error("Error connection AuthService:", error);
    return false;
  }
};
