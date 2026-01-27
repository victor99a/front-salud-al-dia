import { Navigate } from "react-router-dom";

const SpecialistGuard = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    
    if (!token) return <Navigate to="/login" replace />;
    
    if (role !== 'specialist' && role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

export default SpecialistGuard;