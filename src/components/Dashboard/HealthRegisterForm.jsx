import { useState } from "react";
import "../../Styles/healthRegister.css";

export default function HealthRegisterForm() {
  const [glucose, setGlucose] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      glucose,
      pressure: `${systolic}/${diastolic}`,
      date: new Date().toISOString()
    };

    console.log("Datos enviados:", data);
    alert("Registro guardado correctamente");
  };

  return (
    <form className="health-form" onSubmit={handleSubmit}>
      <div className="form-card blue">
        <h2>Glucosa (mg/dL)</h2>
        <input
          type="number"
          placeholder="Ej: 120"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          required
        />
      </div>

      <div className="form-card red">
        <h2>Presión Arterial</h2>
        <div className="pressure-inputs">
          <input
            type="number"
            placeholder="Sistólica (Ej: 120)"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            required
          />
          <span>/</span>
          <input
            type="number"
            placeholder="Diastólica (Ej: 80)"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            required
          />
        </div>
      </div>

      <button className="save-btn">Guardar Registro</button>
    </form>
  );
}
