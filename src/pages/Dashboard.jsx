import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GlucoseCard from "../components/Dashboard/GlucoseCard";
import PressureCard from "../components/Dashboard/PressureCard";
import "../Styles/DashboardStyles.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [reading, setReading] = useState({
    glucose: 0,
    systolic: 0,
    diastolic: 0,
    date: "",
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/registros/dashboard/${userId}`);
        const data = await res.json();

        setReading({
          glucose: data.glucose?.value || 0,
          systolic: data.pressure?.systolic || 0,
          diastolic: data.pressure?.diastolic || 0,
          date: data.glucose?.date || "",
        });

      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    };

    if (userId) loadDashboard();
  }, []);

  return (
    <main className="dashboard-bg">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Panel de Control</h1>
          <p>Revisa y gestiona tu información de salud</p>
        </header>

        <section className="cards-container">
          <GlucoseCard glucose={reading.glucose} date={reading.date} />

          <PressureCard
            systolic={reading.systolic}
            diastolic={reading.diastolic}
            date={reading.date}
          />

          <div
            className="action-card register-card"
            onClick={() => navigate("/registro-salud")}
          >
            <h2>➕ Registrar Información</h2>
            <p>Ingresa nuevos datos de salud</p>
          </div>

          <div
            className="action-card history-card"
            onClick={() => navigate("/historial")}
          >
            <h2>📊 Ver Historial</h2>
            <p>Consulta registros anteriores</p>
          </div>
        </section>
      </div>
    </main>
  );
}
