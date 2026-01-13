import "../styles/homeStyles.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import imagen2 from "../assets/imagen2.png";
function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Salud al Día" />
          <span>Salud al Día</span>
        </div>

        <div className="header-buttons">
          <button
            className="btn-outline"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/signup")}
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* HERO */}
<section className="hero hero-modern">
  <div className="hero-text">
    <span className="badge">Salud explicada por IA</span>

    <h1>
      Monitorea tu Presión y Glucosa <br />
      con Inteligencia Artificial
    </h1>

    <p>
      “Controla tus niveles de presión arterial y glucosa de forma simple,
      segura y confiable. Nuestra plataforma te ayuda a detectar riesgos a
      tiempo y tomar mejores decisiones para tu salud.”
    </p>

    <button
      className="btn-primary big"
      onClick={() => navigate("/login")}
    >
      Comenzar Ahora
    </button>
  </div>

  <div className="hero-image">
    <img src={imagen2} alt="Monitoreo de salud con profesional médico" />
  </div>
</section>

      {/* FEATURES */}
<section className="features">
  <h2>Características Principales</h2>

  <div className="features-container">

    {/* Monitoreo */}
    <div className="feature-card">
      <div className="icon blue">
        <svg viewBox="0 0 24 24">
          <path
            d="M3 12h4l2-5 4 10 2-5h4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>Monitoreo Continuo</h3>
      <p>
        Visualiza tus niveles de glucosa y presión arterial de forma clara.
      </p>
    </div>

    {/* IA */}
    <div className="feature-card">
      <div className="icon blue">
        <svg viewBox="0 0 24 24">
          <path
            d="M8 6a3 3 0 1 0-3 3v6a3 3 0 1 0 3 3m8-12a3 3 0 1 1 3 3v6a3 3 0 1 1-3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3>Asistente IA</h3>
      <p>
        Resuelve dudas de salud con lenguaje simple y entendible.
      </p>
    </div>

    {/* ALERTAS */}
    <div className="feature-card">
      <div className="icon red">
        <svg viewBox="0 0 24 24">
          <path
            d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>Alertas Inteligentes</h3>
      <p>
        Recibe notificaciones cuando tus valores sean riesgosos.
      </p>
    </div>

  </div>
</section>


      {/* CTA */}
      <section className="cta">
        <h2>¿Listo para mejorar tu salud?</h2>
        <p>
          Únete a miles de personas que ya confían en Salud al Día.
        </p>

        <button
          className="btn-white"
          onClick={() => navigate("/signup")}
        >
          Crear Cuenta Ahora
        </button>
      </section>
    </>
  );
}

export default HomePage;
