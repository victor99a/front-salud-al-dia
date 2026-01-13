import "../Styles/HistoryStyles.css";

export default function HistoryPage() {
  const history = [
    {
      date: "12/01/2026 10:30",
      glucose: 120,
      systolic: 125,
      diastolic: 80,
    },
    {
      date: "11/01/2026 09:10",
      glucose: 140,
      systolic: 135,
      diastolic: 85,
    },
  ];

 return (
  <main className="history-page">
    <h1>Historial de Mediciones</h1>

    {history.map((item, index) => {
      const glucoseAlert = item.glucose > 130;
      const pressureAlert = item.systolic > 130 || item.diastolic > 85;

      return (
        <div
          key={index}
          className={`history-item ${
            glucoseAlert || pressureAlert ? "alert" : ""
          }`}
        >
          <div className="history-header">
            <span className="history-date">{item.date}</span>
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
};