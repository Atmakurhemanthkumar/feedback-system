import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Forms from './components/forms/Forms';
import Feedback from './components/feedback/Feedback';
import AdminPanel from './components/admin/AdminPanel';
import Navbar from './components/layout/Navbar';

axios.defaults.baseURL = 'http://localhost:5000/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');

  const setAuth = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decode token to get user role
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.user.role);
      setIsAuthenticated(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole('user');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar isAuthenticated={isAuthenticated} userRole={userRole} setAuth={setAuth} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/" />} />
              <Route path="/forms" element={isAuthenticated ? <Forms /> : <Navigate to="/login" />} />
             <Route path="/feedback/:id" element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />} />
<Route path="/feedback" element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />} />
              <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
