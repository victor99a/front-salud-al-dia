import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { getUsers } from '../../services/AdminService';
import UserRow from './UserRow';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteOnly, setShowDeleteOnly] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleMap = {
    patient: 'paciente',
    specialist: 'especialista',
    admin: 'administrador'
  };

  const filteredUsers = users.filter(user => {
    if (showDeleteOnly && user.status !== 'delete_requested') {
      return false;
    }

    const roleKey = (user.role || "").toLowerCase();
    const roleSpanish = roleMap[roleKey] || roleKey;

    const fullName = `${user.first_names || ''} ${user.last_names || ''}`.toLowerCase();
    const rut = (user.rut || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      fullName.includes(term) || 
      rut.includes(term) || 
      email.includes(term) || 
      roleSpanish.includes(term)
    );
  });

  if (loading) return <div className="loading-text">Cargando usuarios...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-controls">
        <div className="controls-wrapper">
            
            <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, RUT, rol..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button 
                onClick={() => setShowDeleteOnly(!showDeleteOnly)}
                className={`btn-filter ${showDeleteOnly ? 'active' : ''}`}
            >
                <AlertTriangle size={18} />
                {showDeleteOnly ? 'Mostrando Solicitudes' : 'Ver Solicitudes de Borrado'}
            </button>

            <button 
                onClick={fetchUsers}
                className="btn-icon btn-reload"
                title="Recargar lista"
            >
                <RefreshCw size={18} />
            </button>
        </div>
      </div>

      <div className="table-scroll-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  onUpdate={fetchUsers} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data-cell">
                  {showDeleteOnly 
                    ? "No hay solicitudes de eliminación pendientes." 
                    : searchTerm 
                        ? `No se encontraron resultados para "${searchTerm}"`
                        : "No hay usuarios registrados."
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;