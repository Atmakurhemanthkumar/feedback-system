import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userRole, setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Feedback System
        </Typography>

        {!isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/forms')}>Forms</Button>
            <Button color="inherit" onClick={() => navigate('/feedback')}>Feedback</Button>
            {userRole === 'admin' && (
              <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
