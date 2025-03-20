import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    try {
      
      const formPayload = new FormData();
      formPayload.append('username', user.username);
      formPayload.append('password', user.password);

      
      const response = await axios.post('http://localhost:8000/get-users', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });

    
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    }
  };

  const handleDelete = async (userId) => {
    try {
      
      const formPayload = new FormData();
      formPayload.append('username', user.username);
      formPayload.append('password', user.password);
      formPayload.append('id', userId);

      
      await axios.post('http://localhost:8000/delete-user', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  if (user.role !== 'admin' && user.role !== 'manager') {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h2>Users</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {users.map(u => (
        <div key={u.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid black' }}>
          <p>Username: {u.username}</p>
          <p>Role: {u.role}</p>
          <p>Position: {u.position}</p>
          {user.role === 'admin' && (
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Users;