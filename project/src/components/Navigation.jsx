import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ marginBottom: '20px', padding: '10px' }}>
      <Link to="/tours" style={{ marginRight: '10px' }}>Tours</Link>
      {(user.role === 'admin' || user.role === 'agent') && (
        <Link to="/create-tour" style={{ marginRight: '10px' }}>Create Tour</Link>
      )}
      {(user.role === 'admin' || user.role === 'manager') && (
        <Link to="/users" style={{ marginRight: '10px' }}>Users</Link>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navigation;