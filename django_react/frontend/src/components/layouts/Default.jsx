import React from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import Header from './Header';
import Footer from './Footer';

function Default({ children }) {
  return (
    <Box sx={{ flexGrow: 3 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Header size={12} />
      </Grid>
      <Grid container spacing={1}>
        <Grid size={1} />
        <Grid size={10}>
          {children}
        </Grid>
        <Grid size={1} />
      </Grid>
      <Footer />
    </Box>
  );
}

export default Default;
