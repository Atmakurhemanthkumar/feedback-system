import React from 'react';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard!
      </Typography>
      <Typography>
        You're successfully logged in.
      </Typography>
    </Container>
  );
};

export default Dashboard;
