import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
        setIsOpen(false); 
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={logo1} alt="Salud al Día" className="logo-img" />
                </Link>

                <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <div className={`nav-collapse ${isOpen ? 'active' : ''}`}>
                    
                    <div className="nav-menu">
                        <a href="#about" className="nav-item" onClick={() => setIsOpen(false)}>Sobre Nosotros</a>
                        <a href="#contact" className="nav-item" onClick={() => setIsOpen(false)}>Contáctanos</a>
                        
                        {token && (
                            <>
                                <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>Mi Panel</Link>
                                <Link to="/historial" className="nav-item" onClick={() => setIsOpen(false)}>Historial</Link>
                            </>
                        )}
                    </div>

                    <div className="nav-auth">
                        {token ? (
                            <button onClick={handleLogout} className="btn-login">Cerrar Sesión</button>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                                <Link to="/signup" className="btn-register" onClick={() => setIsOpen(false)}>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;