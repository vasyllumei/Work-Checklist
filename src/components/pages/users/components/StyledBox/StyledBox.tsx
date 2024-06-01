import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

const StyledBox = ({ children }: { children: ReactNode }) => {
  const styles = {
    height: 400,
    width: '100%',
    '& .theme--header': {
      backgroundColor: 'rgba(67, 24, 254, 1)',
      color: 'rgba(255, 255, 255, 1)',
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: 'rgba(67, 24, 254, 1)',
    },
    '& .css-i4bv87-MuiSvgIcon-root': {
      color: 'rgb(168, 158, 158)',
    },
  };

  return <Box sx={styles}>{children}</Box>;
};

export default StyledBox;
