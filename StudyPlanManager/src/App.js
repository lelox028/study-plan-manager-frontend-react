import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './Pages/Home.js';
import Carrera from './Pages/Carrera.js';
import Login from './Pages/Login.js';
import Signup from './Pages/Signup.js';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/carrera/:slug" element={<ProtectedRoute><Carrera /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;