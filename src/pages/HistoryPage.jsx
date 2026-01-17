import { useEffect, useState } from "react";
import "../Styles/HistoryStyles.css";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/registros/historial/${userId}`
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

      {history.length === 0 && (
        <p>No hay registros disponibles</p>
      )}

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
                {new Date(item.date).toLocaleString()}
              </span>
            </div>

            <div className="history-values">
              <span className={`badge glucose ${glucoseAlert ? "danger" : ""}`}>
                Glucosa: {item.glucose} mg/dL
              </span>

              <span className={`badge pressure ${pressureAlert ? "danger" : ""}`}>
                Presión: {item.systolic}/{item.diastolic} mmHg
              </span>
            </div>
          </div>
        );
      })}
    </main>
  );
}
