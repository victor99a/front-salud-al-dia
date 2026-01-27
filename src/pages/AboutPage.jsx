import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FcPrivacy, FcMindMap, FcLike } from 'react-icons/fc'; 
import '../Styles/AboutStyles.css';

const AboutPage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Cuidando tu salud con tecnología</h1>
        <p>
          En <strong>Salud al Día</strong>, creemos que el bienestar debe ser accesible, 
          inteligente y fácil de entender para todos.
        </p>
      </div>

      <div className="about-mission">
        <div className="mission-card">
          <h2> Nuestra Misión</h2>
          <p>
            Democratizar el acceso a un monitoreo de salud preventivo. 
            Utilizamos tecnología avanzada para que puedas registrar, visualizar 
            y entender tus indicadores vitales (glucosa y presión) sin complicaciones.
          </p>
        </div>
        <div className="mission-card">
          <h2> Nuestra Visión</h2>
          <p>
            Ser la plataforma líder en Latinoamérica en autogestión de salud digital, 
            conectando a pacientes con sus datos médicos de manera segura y eficiente, 
            reduciendo riesgos mediante la prevención temprana.
          </p>
        </div>
      </div>

      <div className="about-values">
        <h2>¿Por qué elegirnos?</h2>
        <div className="values-grid">
          <div className="value-item">
            <span className="value-icon"><FcPrivacy size={45} /></span>
            <h3>Seguridad Total</h3>
            <p>Tus datos médicos están encriptados y protegidos con los más altos estándares.</p>
          </div>
          <div className="value-item">
            <span className="value-icon"><FcMindMap size={45} /></span>
            <h3>Innovación IA</h3>
            <p>Integramos inteligencia artificial para ayudarte a interpretar tus resultados.</p>
          </div>
          <div className="value-item">
            <span className="value-icon"><FcLike size={45} /></span>
            <h3>Centrado en Ti</h3>
            <p>Diseñamos cada pantalla pensando en tu facilidad de uso y tranquilidad.</p>
          </div>
        </div>
      </div> 

      <section className="cta-footer">
        <h2>¿Listo para mejorar tu salud?</h2>
        <p>Únete a miles de personas que ya confían en Salud al Día.</p>
        <button className="btn-white" onClick={() => navigate("/signup")}>
          Crear Cuenta Ahora
        </button>
      </section>
    </div>
  );
};

export default AboutPage;