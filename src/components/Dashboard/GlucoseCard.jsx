export default function GlucoseCard({ glucose, date }) {
  return (
    <div className="card glucose-card">
      <h3>Glucosa</h3>
      <p className="value">{glucose} mg/dL</p>
      <span className="date">{date}</span>
    </div>
  );
}
