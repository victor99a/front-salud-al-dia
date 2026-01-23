import { formatDateLong } from "../../utils/formatDate";

export default function PressureCard({ systolic, diastolic, date }) {
  let level = "normal";

  if (systolic >= 140 || diastolic >= 90) level = "danger";
  else if (systolic >= 130 || diastolic >= 85) level = "warning";

  return (
    <div className={`card pressure-card ${level}`}>
      <div className="card-header">
        <div className="icon-circle pressure-icon">🫀</div>
        <span className={`status ${level}`}>
          {level === "normal" && "Normal"}
          {level === "warning" && "Alerta"}
          {level === "danger" && "Peligro"}
        </span>
      </div>

      <h3>Presión Arterial</h3>
      <p className="value">{systolic}/{diastolic} mmHg</p>

      {/* SOLO CAMBIO: formato de fecha y hora */}
      <span className="date">{formatDateLong(date)}</span>
    </div>
  );
}
