import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AdminStats from '../components/Admin/AdminStats';
import UserTable from '../components/Admin/UserTable';
import RegisterSpecialistModal from '../components/Admin/RegisterSpecialistModal';
import '../Styles/AdminStyles.css';

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="admin-page-wrapper">
      <header className="admin-header">
        <div className="header-content">
            <div>
                <h1>Panel de Control</h1>
                <p>Gestión de usuarios y pacientes.</p>
            </div>
            
            <button 
                className="btn-create-specialist" 
                onClick={() => setShowModal(true)}
            >
                <UserPlus size={20} />
                Nuevo Especialista
            </button>
        </div>
      </header>
      
      <AdminStats key={`stats-${refreshKey}`} />
      
      <h3 className="section-title">Lista de Usuarios</h3>
      
      <UserTable key={`table-${refreshKey}`} />

      {showModal && (
        <RegisterSpecialistModal 
            onClose={() => setShowModal(false)} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
};

export default AdminPage;