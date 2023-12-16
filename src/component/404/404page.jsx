import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page not found
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
