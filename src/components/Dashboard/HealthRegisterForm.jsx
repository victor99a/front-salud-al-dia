import { useState } from "react";
import axios from "axios";
import "../../Styles/healthRegister.css";

export default function HealthRegisterForm() {
  const [glucose, setGlucose] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDACIÓN SALUD (sin romper lógica)
    if (glucose <= 0 || systolic <= 0 || diastolic <= 0) {
      alert("❌ Los valores de salud deben ser mayores a 0");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_REGISTRO_URL || "http://localhost:3001";

      const payload = {
        patientId: localStorage.getItem("user_id"),
        glucosa: Number(glucose),
        sistolica: Number(systolic),
        diastolica: Number(diastolic),
      };

      console.log("Enviando:", payload);

      await axios.post(`${API_URL}/api/registros`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("✅ Registro guardado correctamente");

      setGlucose("");
      setSystolic("");
      setDiastolic("");

    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      alert("❌ Error al guardar registro");
    }
  };

  return (
    <form className="health-form" onSubmit={handleSubmit}>
      <div className="form-card blue">
        <h2>Glucosa (mg/dL)</h2>
        <input
          type="number"
          min="1"                     
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
            min="1"                  
            placeholder="Sistólica (Ej: 120)"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            required
          />
          <span>/</span>
          <input
            type="number"
            min="1"                 
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
