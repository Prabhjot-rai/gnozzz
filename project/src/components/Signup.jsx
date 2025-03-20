import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'client',
    position: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
 
    if (!formData.username || !formData.password || !formData.role || !formData.position) {
      setError('All fields are required');
      return;
    }
  
  
    const formPayload = new FormData();
    formPayload.append('username', formData.username);
    formPayload.append('password', formData.password);
    formPayload.append('role', formData.role);
    formPayload.append('position', formData.position);
  
    try {
      const response = await axios.post('http://localhost:8000/signup', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.message) {
        navigate('/login'); 
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed'); 
    }
  };
  
  return (
    <div>
      <h2>Signup</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Position:</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;