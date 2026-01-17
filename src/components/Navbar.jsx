import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SosButton from './SosButton'; 
import { isAdmin } from '../services/AuthService'; 
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isOpen, setIsOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (token) {
                const adminStatus = await isAdmin();
                setIsUserAdmin(adminStatus);
            }
        };
        checkAdminStatus();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        setIsUserAdmin(false);
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* 1. LOGO (Izquierda) */}
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={logo1} alt="Salud al Día" className="logo-img" />
                </Link>

                {/* 2. MENÚ DESPLEGABLE (Centro/Derecha en PC - Oculto en Móvil) */}
                <div className={`nav-collapse ${isOpen ? 'active' : ''}`}>
                    <div className="nav-menu">
                        <Link to="/about" className="nav-item" onClick={() => setIsOpen(false)}>Sobre Nosotros</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsOpen(false)}>Contáctanos</Link>
                        
                        {token && (
                            <>
                                <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>Mi Panel</Link>
                                <Link to="/historial" className="nav-item" onClick={() => setIsOpen(false)}>Historial</Link>
                                <Link to="/perfil" className="nav-item" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                                
                                {isUserAdmin && (
                                    <Link to="/admin" className="nav-item" onClick={() => setIsOpen(false)}>Panel Admin</Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="nav-auth">
                        {token ? (
                            <>
                                {/* SOS DE ESCRITORIO (Se oculta en móvil vía CSS) */}
                                <div className="sos-desktop-wrapper">
                                    <SosButton />
                                </div>
                                <button onClick={handleLogout} className="btn-login">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                                <Link to="/signup" className="btn-register" onClick={() => setIsOpen(false)}>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. ACCIONES MÓVILES (SOS + Hamburguesa) - Solo visible en móvil */}
                <div className="nav-mobile-actions">
                    {/* Botón SOS Móvil (Siempre visible en la barra) */}
                    {token && (
                        <div className="sos-mobile-wrapper">
                             <SosButton />
                        </div>
                    )}
                    
                    {/* Icono Hamburguesa */}
                    <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;