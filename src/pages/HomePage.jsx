import { useState, useEffect } from "react";
import "../Styles/homeStyles.css";
import { useNavigate } from "react-router-dom";
import carrusel1 from '../assets/carrusel-1.png';
import carrusel2 from '../assets/imagen2.png';
import carrusel3 from '../assets/carrusel-3.png';

import DrChapatinSection from "../components/Landing/DrChapatinSection"; 
import HowToUseSection from "../components/Landing/HowToUseSection"; 

function HomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

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
      image: carrusel2, 
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
      <section className="hero-modern-container">
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

      <DrChapatinSection />

      <HowToUseSection />

      <section className="cta">
        <h2>¿Listo para mejorar tu salud?</h2>
        <p>Únete a miles de personas que ya confían en Salud al Día.</p>
        <button className="btn-white" onClick={() => navigate("/signup")}>Crear Cuenta Ahora</button>
      </section>
      
    </>
  );
}

export default HomePage;