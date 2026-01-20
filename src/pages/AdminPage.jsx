import React from 'react';
import AdminStats from '../components/Admin/AdminStats';
import UserTable from '../components/Admin/UserTable';
import '../Styles/AdminStyles.css';

const AdminPage = () => {
  return (
    <div className="admin-page-wrapper">
      <header className="admin-header">
        <h1>Panel de Control</h1>
        <p>Gestión de usuarios y pacientes.</p>
      </header>
      
      <AdminStats />
      
      <h3 className="section-title">Lista de Pacientes</h3>
      
      <UserTable />
    </div>
  );
};

export default AdminPage;