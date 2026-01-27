import axios from 'axios';
import { formatDateDownload } from "../utils/formatDateDownload";

const API_DESCARGA = import.meta.env.VITE_API_DESCARGA;

export async function descargarHistorial(userId, formato) {
  try {
    const response = await axios.get(
      `${API_DESCARGA}/api/descargas/historial/${formato}/${userId}`,
      { responseType: 'blob' } 
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const fecha = formatDateDownload(new Date())
      .replace(/ /g, "_")
      .replace(/·/g, "")
      .replace(/:/g, "-");

    const a = document.createElement("a");
    a.href = url;
    a.download = `historial_${userId}_${fecha}.${formato}`;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error descargando historial:", error);
  }
}