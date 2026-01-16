import { useState, useEffect } from "react";
import "../Styles/homeStyles.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import imagen2 from "../assets/imagen2.png";
import carrusel1 from '../assets/carrusel-1.png';
import carrusel3 from '../assets/carrusel-3.png';

function HomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Datos del carrusel
  const slides = [
    {
      badge: "Salud explicada por IA",
      title: "Monitorea tu Presión y Glucosa con Inteligencia Artificial",
      text: "Controla tus niveles de presión arterial y glucosa de forma simple, segura y confiable.",
      image: carrusel1,
    },
    {
      badge: "Tecnología de Vanguardia",
      title: "Análisis Clínico en Lenguaje Simple",
      text: "Nuestra plataforma te ayuda a detectar riesgos a tiempo y tomar mejores decisiones para tu salud.",
      image: imagen2, 
    },
    {
      badge: "Vive tranquilo",
      title: "Tus Datos Médicos están Seguros",
      text: "Implementamos altos estándares de seguridad y cifrado para que tu información personal esté siempre protegida.",
      image: carrusel3,
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <>


      {/* HERO CON CARRUSEL INTERACTIVO */}
      <section className="hero-modern-container">
        {/* Flechas de Navegación */}
        <button className="carousel-arrow left" onClick={prevSlide}>&#10094;</button>
        <button className="carousel-arrow right" onClick={nextSlide}>&#10095;</button>

        <div className="hero hero-modern">
          <div className="hero-text">
            <span className="badge">{slides[currentIndex].badge}</span>
            <h1>{slides[currentIndex].title}</h1>
            <p>{slides[currentIndex].text}</p>
            <button className="btn-primary big" onClick={() => navigate("/login")}>
              Comenzar Ahora
            </button>
          </div>

          <div className="hero-image">
            <img 
              src={slides[currentIndex].image} 
              alt="Monitoreo de salud" 
              className="fade-in" 
              key={currentIndex} 
            />
          </div>
        </div>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Características Principales</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="icon blue">
              <svg viewBox="0 0 24 24"><path d="M3 12h4l2-5 4 10 2-5h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Monitoreo Continuo</h3>
            <p>Visualiza tus niveles de glucosa y presión arterial de forma clara.</p>
          </div>
          <div className="feature-card">
            <div className="icon blue">
              <svg viewBox="0 0 24 24"><path d="M8 6a3 3 0 1 0-3 3v6a3 3 0 1 0 3 3m8-12a3 3 0 1 1 3 3v6a3 3 0 1 1-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Asistente IA</h3>
            <p>Resuelve dudas de salud con lenguaje simple y entendible.</p>
          </div>
          <div className="feature-card">
            <div className="icon red">
              <svg viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <h3>Alertas Inteligentes</h3>
            <p>Recibe notificaciones cuando tus valores sean riesgosos.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>¿Listo para mejorar tu salud?</h2>
        <p>Únete a miles de personas que ya confían en Salud al Día.</p>
        <button className="btn-white" onClick={() => navigate("/signup")}>Crear Cuenta Ahora</button>
      </section>
    </>
  );
}

export default HomePage;