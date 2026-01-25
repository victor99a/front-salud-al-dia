import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SosButton from './SosButton'; 
import { isAdmin } from '../services/AuthService'; 
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';
import { Stethoscope, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'patient');
    const [docName, setDocName] = useState(localStorage.getItem('user_name') || '');
    const [token, setToken] = useState(localStorage.getItem('token'));

    const refreshAuthState = async () => {
        const currentToken = localStorage.getItem('token');
        const currentRole = localStorage.getItem('user_role');
        const currentName = localStorage.getItem('user_name');

        setToken(currentToken);
        if (currentRole) setUserRole(currentRole);
        setDocName(currentName || '');

        if (currentToken) {
            try {
                const adminStatus = await isAdmin();
                setIsUserAdmin(adminStatus);
                if (adminStatus) setUserRole('admin');
            } catch (error) {
                setIsUserAdmin(false);
            }
        } else {
            setIsUserAdmin(false);
            setUserRole('patient');
        }
    };

    useEffect(() => {
        refreshAuthState();
        window.addEventListener('auth-change', refreshAuthState);
        window.addEventListener('storage', refreshAuthState);
        return () => {
            window.removeEventListener('auth-change', refreshAuthState);
            window.removeEventListener('storage', refreshAuthState);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("auth-change"));
        navigate('/login');
        setIsOpen(false);
    };

    if (userRole === 'specialist') {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="nav-logo">
                        <img src={logo1} alt="Salud al Día" className="logo-img" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
                        <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', color: '#1e3a8a', fontSize: '0.95rem' }}>
                                {docName || 'Especialista'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Profesional de Salud</span>
                        </div>
                        <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                            <Stethoscope size={20} />
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="btn-logout-specialist"
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', 
                                padding: '8px 16px', border: '1px solid #e2e8f0', 
                                color: '#64748b', background: 'white', borderRadius: '8px',
                                cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
                            }}
                        >
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </nav>
        );
    }

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
                                {showSos && <div className="sos-desktop-wrapper"><SosButton /></div>}
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
                    {showSos && <div className="sos-mobile-wrapper"><SosButton /></div>}
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