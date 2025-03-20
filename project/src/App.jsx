import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Tours from './components/Tours';
import CreateTour from './components/CreateTour';
import UpdateTour from './components/UpdateTour';
import Users from './components/Users';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/create-tour" element={<CreateTour />} />
          <Route path="/update-tour/:id" element={<UpdateTour />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;