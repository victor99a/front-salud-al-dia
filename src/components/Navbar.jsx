import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SosButton from './SosButton'; 
import { isAdmin } from '../services/AuthService'; 
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // 1. Verificación asíncrona: Solo ocurre si el token cambia (Evita bucle infinito al servidor)
    useEffect(() => {
        const verifyAdmin = async () => {
            if (token) {
                try {
                    const adminStatus = await isAdmin();
                    setIsUserAdmin(adminStatus);
                } catch (error) {
                    setIsUserAdmin(false);
                }
            } else {
                setIsUserAdmin(false);
            }
        } else {
            setIsUserAdmin(false);
        }
    };

    useEffect(() => {
        checkStatus();

        window.addEventListener('storage', checkStatus);
        const interval = setInterval(checkStatus, 1000);

        return () => {
            window.removeEventListener('storage', checkStatus);
            clearInterval(interval);
        };
        verifyAdmin();
    }, [token]);

    // 2. Sincronización ligera: Solo lee localStorage (Sin costo de red)
    useEffect(() => {
        const checkTokenChange = () => {
            const currentToken = localStorage.getItem('token');
            if (currentToken !== token) {
                setToken(currentToken);
            }
        };

        window.addEventListener('storage', checkTokenChange);
        const interval = setInterval(checkTokenChange, 1000);

        return () => {
            window.removeEventListener('storage', checkTokenChange);
            clearInterval(interval);
        };
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        setIsUserAdmin(false);
        setToken(null);
        navigate('/login');
        setIsOpen(false);
    };

    const showSos = token && !isUserAdmin;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={logo1} alt="Salud al Día" className="logo-img" />
                </Link>

                <div className={`nav-collapse ${isOpen ? 'active' : ''}`}>
                    <div className="nav-menu">
                        <Link to="/about" className="nav-item" onClick={() => setIsOpen(false)}>Sobre Nosotros</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsOpen(false)}>Contáctanos</Link>
                        
                        {token && (
                            <>
                                {!isUserAdmin ? (
                                    <>
                                        <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>Mi Panel</Link>
                                        <Link to="/historial" className="nav-item" onClick={() => setIsOpen(false)}>Historial</Link>
                                        <Link to="/perfil" className="nav-item" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                                    </>
                                ) : (
                                    <Link to="/admin" className="nav-item" onClick={() => setIsOpen(false)}>Panel Admin</Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="nav-auth">
                        {token ? (
                            <>
                                {showSos && (
                                    <div className="sos-desktop-wrapper">
                                        <SosButton />
                                    </div>
                                )}
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

                <div className="nav-mobile-actions">
                    {showSos && (
                        <div className="sos-mobile-wrapper">
                             <SosButton />
                        </div>
                    )}
                    
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