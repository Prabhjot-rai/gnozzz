import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateTour() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    start_date: '',
    end_date: '',
    seats: '',
    left_seats: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
      
        const formPayload = new FormData();
        formPayload.append('username', user.username);
        formPayload.append('password', user.password);

        const response = await axios.post('http://localhost:8000/get-tours', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

       
        const tour = response.data.find(t => t.id === parseInt(id));
        if (tour) {
          setFormData(tour);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch tour');
      }
    };
    fetchTour();
  }, [id, user.username, user.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formPayload = new FormData();
    formPayload.append('username', user.username);
    formPayload.append('password', user.password);
    formPayload.append('id', id); 
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    formPayload.append('start_date', formData.start_date);
    formPayload.append('end_date', formData.end_date);
    formPayload.append('seats', formData.seats);
    formPayload.append('left_seats', formData.left_seats);

    try {
    
      await axios.post('http://localhost:8000/update-tour', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

    
      navigate('/tours');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update tour');
    }
  };

  return (
    <div>
      <h2>Update Tour</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Seats:</label>
          <input
            type="number"
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Left Seats:</label>
          <input
            type="number"
            value={formData.left_seats}
            onChange={(e) => setFormData({ ...formData, left_seats: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Tour</button>
      </form>
    </div>
  );
}

export default UpdateTour;