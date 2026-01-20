import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getUsers } from '../../services/AdminService';
import UserRow from './UserRow';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []); // Asegura que siempre sea un array
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_names || ''} ${user.last_names || ''}`.toLowerCase();
    const rut = (user.rut || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const role = (user.role || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    // Ahora puedes buscar por nombre, rut, email o rol
    return (
      fullName.includes(term) || 
      rut.includes(term) || 
      email.includes(term) || 
      role.includes(term)
    );
  });

  if (loading) return <div className="loading-text">Cargando pacientes...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-controls">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o rol..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <td colSpan="6" className="no-data-text">
                  {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay usuarios registrados."}
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