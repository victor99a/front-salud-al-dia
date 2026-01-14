import { useState } from "react";

export default function RegisterReadingModal({ onClose, onSave }) {
  const [glucose, setGlucose] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-centered">
        <h2 className="modal-title">Registrar Lectura</h2>
        <p className="modal-subtitle">
          Ingresa tus valores de salud
        </p>

        <div className="input-group">
          <label>Glucosa (mg/dL)</label>
          <input
            type="number"
            placeholder="Ej: 110"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Presión Sistólica</label>
          <input
            type="number"
            placeholder="Ej: 120"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Presión Diastólica</label>
          <input
            type="number"
            placeholder="Ej: 80"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-save"
            onClick={() =>
              onSave({ glucose, systolic, diastolic })
            }
          >
            Guardar Lectura
          </button>

          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
