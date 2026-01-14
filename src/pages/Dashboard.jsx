import { useNavigate } from "react-router-dom";
import GlucoseCard from "../components/Dashboard/GlucoseCard";
import PressureCard from "../components/Dashboard/PressureCard";
import "../Styles/DashboardStyles.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const reading = {
    glucose: 300,
    systolic: 134,
    diastolic: 92,
    date: "13 de enero, 14:02",
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
          onClick={() => navigate("/registrar")}
        >
          <h2>➕ Registrar Nueva Información</h2>
          <p>Ingresa nuevos datos de glucosa o presión</p>
        </div>

        {/* TARJETA HISTORIAL */}
        <div
          className="action-card history-card"
          onClick={() => navigate("/historial")}
        >
          <h2>📊 Ver Historial</h2>
          <p>Consulta tus registros anteriores</p>
        </div>
      </section>
    </main>
  );
}
