import React from "react";
// Borramos useNavigate porque ya no lo usamos sin el botón
import "../../Styles/DrChapatinSection.css"; 
import drImage from "../../assets/dr-chapatin.png"; 

export default function DrChapatinSection() {
  // Borramos const navigate = ... porque ya no se usa

  return (
    <section className="chapatin-section">
      <div className="chapatin-container">
        
        {/* Lado Izquierdo: Texto */}
        <div className="chapatin-content">
          <div className="badge-wrapper">
            <span className="badge-ia">IA Médica Avanzada</span>
            <span className="badge-humor">Modo: Dr. Chapatín</span>
          </div>
          
          <h2>No es broma: <br/>Ciencia real detrás del personaje.</h2>
          
          <p className="main-description">
            Puede que el Dr. Chapatín traiga su "bolsita", pero nuestra IA trae 
            <strong> gigabytes de literatura médica validada</strong>. Hemos entrenado el modelo 
            para separar el humor del diagnóstico:
          </p>

          <p className="sub-description">
            La personalidad es para que te relajes. Los datos son para que te cuides.
          </p>

          {/* Grid de Confianza */}
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">📚</span>
              <div>
                <h4>Protocolos Clínicos</h4>
                <p>Basado en guías MINSAL y OMS.</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🧠</span>
              <div>
                <h4>Entrenamiento</h4>
                <p>+1M de casos médicos anonimizados.</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <h4>Seguridad</h4>
                <p>Tus datos están encriptados y seguros.</p>
              </div>
            </div>
          </div>

          {/* Sin botón rojo */}
          
          <p className="disclaimer-text">
            *Nota: Esta IA ofrece orientación y triaje, no reemplaza una consulta médica presencial.
          </p>
        </div>

        {/* Lado Derecho: Imagen */}
        <div className="chapatin-image-wrapper">
          <div className="blob-bg"></div>
          <img src={drImage} alt="Dr Chapatín IA" className="chapatin-img" />
          
          <div className="floating-card">
            <span className="check-icon">✓</span>
            <div className="floating-text">
              <strong>Precisión Analítica</strong>
              <span>98% en detección de síntomas</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}