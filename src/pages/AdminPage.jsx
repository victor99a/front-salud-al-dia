import React, { useState, useEffect } from 'react';
import AdminStats from '../components/Admin/AdminStats';
import UserTable from '../components/Admin/UserTable';
import { getUsers } from '../services/AdminService';
import '../Styles/AdminStyles.css';
import SosButton from '../components/SosButton';

const AdminPage = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getUsers().then(data => setCount(data ? data.length : 0));
  }, []);

  return (
    <div className="admin-page-wrapper">
      <header className="admin-header">
        <h1>Panel de Control</h1>
        <p>Gestión de usuarios y pacientes.</p>
      </header>
      <AdminStats totalUsers={count} />
      <h3 className="section-title">Lista de Pacientes</h3>
      <UserTable />
    </div>
  );
};

export default AdminPage;