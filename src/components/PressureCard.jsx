export default function PressureCard({ systolic, diastolic, date }) {
  return (
    <div className="card pressure-card">
      <h3>Presión Arterial</h3>
      <p className="value">{systolic}/{diastolic} mmHg</p>
      <span className="date">{date}</span>
    </div>
  );
}
