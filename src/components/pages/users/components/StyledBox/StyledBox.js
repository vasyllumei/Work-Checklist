import React from 'react';
import { Box } from '@mui/material';

const StyledBox = ({ children }) => {
  const styles = {
    height: 400,
    width: '100%',
    '& .theme--header': {
      backgroundColor: 'rgba(67, 24, 254, 100)',
      color: 'rgba(255,255,255,100)',
    },
    '.css-d2yw5i-MuiDataGrid-root .MuiDataGrid-columnHeaderDraggableContainer': {
      backgroundColor: 'rgba(67, 24, 254, 100)',
    },
    '.css-i4bv87-MuiSvgIcon-root': {
      color: 'rgb(168,158,158)',
    },
  };

  return <Box sx={styles}>{children}</Box>;
};

export default StyledBox;
