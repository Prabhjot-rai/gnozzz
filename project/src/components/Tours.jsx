import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Tours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTours = async () => {
    try {
    
      const formPayload = new FormData();
      formPayload.append('username', user.username);
      formPayload.append('password', user.password);

    
      const response = await axios.post('http://localhost:8000/get-tours', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data' }
      });

     
      setTours(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tours');
    }
  };

  const handleDelete = async (tourId) => {
    try {
     
      const formPayload = new FormData();
      formPayload.append('username', user.username);
      formPayload.append('password', user.password);
      formPayload.append('id', tourId);

     
      await axios.post('http://localhost:8000/delete-tour', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  // Refresh the tours list after deletion
      fetchTours();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete tour');
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div>
      <h2>Tours</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {tours.map(tour => (
        <div key={tour.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid black' }}>
          <h3>{tour.title}</h3>
          <p>Price: ${tour.price}</p>
          <p>Available Seats: {tour.left_seats}/{tour.seats}</p>
          <p>Agent: {tour.agent}</p>
          {(user.role === 'admin' || user.role === 'manager' || user.username === tour.agent) && (
            <button onClick={() => navigate(`/update-tour/${tour.id}`)}>Update</button>
          )}
          {user.role === 'admin' && (
            <button onClick={() => handleDelete(tour.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Tours;