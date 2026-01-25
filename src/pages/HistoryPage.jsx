import { useEffect, useState } from "react";
import "../Styles/HistoryStyles.css";
import { descargarHistorial } from "../services/downloadService";
import { formatDateLong } from "../utils/formatDate";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem("user_id");

  const API_URL =
    import.meta.env.VITE_API_REGISTRO_URL || "http://localhost:3001";

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/registros/historial/${userId}`
        );

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <main className="history-page">
      <h1>Historial de Mediciones</h1>

      <div className="download-buttons">
        <button
          className="download-btn pdf"
          onClick={() => descargarHistorial(userId, "pdf")}
        >
          Descargar PDF
        </button>

        <button
          className="download-btn csv"
          onClick={() => descargarHistorial(userId, "csv")}
        >
          Descargar CSV
        </button>
      </div>

      {history.length === 0 && <p>No hay registros disponibles</p>}

      {history.map((item, index) => {
        const glucoseAlert = item.glucose > 130;
        const pressureAlert =
          item.systolic > 130 || item.diastolic > 85;

        return (
          <div
            key={index}
            className={`history-item ${
              glucoseAlert || pressureAlert ? "alert" : ""
            }`}
          >
            <div className="history-header">
              <span className="history-date">
                {formatDateLong(item.date)}
              </span>
            </div>

            <div className="history-values">
              <span className={`badge glucose ${glucoseAlert ? "danger" : ""}`}>
                Glucosa: {item.glucose} mg/dL
              </span>

              <span
                className={`badge pressure ${
                  pressureAlert ? "danger" : ""
                }`}
              >
                Presión: {item.systolic}/{item.diastolic} mmHg
              </span>
            </div>
          </div>
        );
      })}
    </main>
  );
}
