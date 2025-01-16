import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dashboard from './Crypto-Dashboard';
import HomePageTitle from '../components/layouts/HomePageTitle';
import HomePageCards from '../components/layouts/HomePageCards';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={0} md={0} lg={1} xl={3} />
        <Grid item xs={12} sm={12} md={12} lg={10} xl={6}>
          <HomePageTitle />
          <HomePageCards />
          <Dashboard />
        </Grid>
        <Grid item xs={12} sm={0} md={0} lg={1} xl={3} />
      </Grid>
    </Box>
  );
}

export default Home;
