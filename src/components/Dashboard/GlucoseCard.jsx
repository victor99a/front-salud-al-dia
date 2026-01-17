export default function GlucoseCard({ glucose, date }) {
  let level = "normal";

  if (glucose >= 200) level = "danger";
  else if (glucose >= 141) level = "warning";

  return (
    <div className={`card glucose-card ${level}`}>
      <div className="card-header">
        <div className="icon-circle glucose-icon">
          <span className="droplet"></span>
        </div>
        <span className={`status ${level}`}>
          {level === "normal" && "Normal"}
          {level === "warning" && "Alerta"}
          {level === "danger" && "Peligro"}
        </span>
      </div>

      <h3>Glucosa</h3>
      <p className="value">{glucose} mg/dL</p>
      <span className="date">{date}</span>
    </div>
  );
}
