import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GlucoseCard from "../components/Dashboard/GlucoseCard";
import PressureCard from "../components/Dashboard/PressureCard";
import "../Styles/DashboardStyles.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const reading = {
    glucose: 300,
    systolic: 134,
    diastolic: 92,
    date: "13 de enero, 14:02",
  };

  const goToRegister = () => {
    setLoadingRegister(true);
    setTimeout(() => {
      navigate("/registro-salud");   // 👈 ruta correcta
    }, 500);
  };

  const goToHistory = () => {
    setLoadingHistory(true);
    setTimeout(() => {
      navigate("/historial");
    }, 500);
  };

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">Panel de Control</h1>
      <p className="dashboard-subtitle">
        Revisa y gestiona tu información de salud
      </p>

      <section className="cards-container">
        <GlucoseCard glucose={reading.glucose} date={reading.date} />
        <PressureCard
          systolic={reading.systolic}
          diastolic={reading.diastolic}
          date={reading.date}
        />

        {/* TARJETA REGISTRAR */}
        <div
          className="action-card register-card"
          onClick={goToRegister}
        >
          {loadingRegister ? (
            <div className="spinner"></div>
          ) : (
            <>
              <h2>➕ Registrar Nueva Información</h2>
              <p>Ingresa nuevos datos de glucosa o presión</p>
            </>
          )}
        </div>

        {/* TARJETA HISTORIAL */}
        <div
          className="action-card history-card"
          onClick={goToHistory}
        >
          {loadingHistory ? (
            <div className="spinner"></div>
          ) : (
            <>
              <h2>📊 Ver Historial</h2>
              <p>Consulta tus registros anteriores</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

