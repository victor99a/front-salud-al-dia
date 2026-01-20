import React from "react";
import "../../Styles/HowToUseSection.css";

export default function HowToUseSection() {
  return (
    <section className="tutorial-section">
      <div className="tutorial-container">
        
        <div className="tutorial-header">
          <span className="tutorial-badge">Guía Rápida</span>
          <h2>Toma el control en 3 pasos</h2>
          <p>Registrar tu salud nunca fue tan sencillo. Olvídate de las libretas de papel.</p>
        </div>

        <div className="steps-grid">
          {/* PASO 1 */}
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon-bg purple">
              <svg viewBox="0 0 24 24" width="32" height="32"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
            </div>
            <h3>Entra al Registro</h3>
            <p>Desde tu Panel Principal, busca la tarjeta que dice <strong>"Registrar Información"</strong> con el signo más (+).</p>
          </div>

          {/* PASO 2 */}
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon-bg blue">
              <svg viewBox="0 0 24 24" width="32" height="32"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
            </div>
            <h3>Ingresa tus Datos</h3>
            <p>Escribe tus niveles de <strong>Glucosa</strong> o <strong>Presión Arterial</strong>. El formulario es inteligente y validará los números por ti.</p>
          </div>

          {/* PASO 3 */}
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon-bg green">
              <svg viewBox="0 0 24 24" width="32" height="32"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg>
            </div>
            <h3>Recibe tu Análisis</h3>
            <p>Al guardar, nuestra IA analizará el resultado y te dirá al instante si estás <strong>Estable</strong> o si necesitas atención.</p>
          </div>
        </div>

      </div>
    </section>
  );
}