import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import Header from './Header';
import Footer from './Footer';

const Default = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 3 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Header size={12} />
      </Grid>
      <Grid container spacing={1}>
        <Grid size={1}>
        </Grid>
        <Grid size={10}>
          {children}
        </Grid>
        <Grid size={1}>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default Default;