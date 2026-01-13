import React, { useState } from 'react';
import '../Styles/healthStyles.css';

const HealthForm = () => {
  const [data, setData] = useState({ systolic: '', diastolic: '', glucose: '' });

  return (
    <div className="health-container">
      <form className="health-card">
        <h3>Registrar Mediciones</h3>
        
        <div className="input-group">
          <label>Presión Arterial (Sistólica/Diastólica)</label>
          <div className="dual-input">
            <input type="number" placeholder="120" name="systolic" required />
            <span className="separator">/</span>
            <input type="number" placeholder="80" name="diastolic" required />
          </div>
        </div>

        <div className="input-group">
          <label>Glucosa (mg/dL)</label>
          <input type="number" placeholder="95" name="glucose" required />
        </div>

        <button type="submit" className="btn-save">Guardar Medición</button>
      </form>
    </div>
  );
};

export default HealthForm;