import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formPayload = new FormData();
    formPayload.append('username', formData.username);
    formPayload.append('password', formData.password);

    try {
      // Send the FormData object to the backend
      const response = await axios.post('http://localhost:8000/login', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
        }
      });

      // Check for successful login
      if (response.data.role) {
        // Save user details in localStorage
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: response.data.role
        }));
        navigate('/tours'); // Redirect to the tours page
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed'); // Handle backend errors
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;