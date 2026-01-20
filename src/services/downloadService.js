const API_DESCARGA = import.meta.env.VITE_API_DESCARGA;

export async function descargarHistorial(userId, formato) {
  try {
    const response = await fetch(
      `${API_DESCARGA}/api/descargas/historial/${formato}/${userId}`
    );

    if (!response.ok) {
      throw new Error("Error en la descarga");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `historial_${userId}.${formato}`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error descargando historial:", error);
  }
}
