import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
    }}
  >
    <CircularProgress size={30} />
  </Box>
);

export default Loader;
