import { Box } from '@mui/material';
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Add margin top to account for fixed header
          width: { sm: `calc(100% - 240px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
