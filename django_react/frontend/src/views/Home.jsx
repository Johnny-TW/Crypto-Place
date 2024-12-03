import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dashboard from '../views/Crypto-Dashboard';
import HomePageTitle from '../components/layouts/HomePageTitle';
import HomePageCards from '../components/layouts/HomePageCards';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={0} md={1} lg={1} xl={2}></Grid>
        <Grid item xs={12} sm={12} md={10} lg={10} xl={8}>
          <HomePageTitle />
          <HomePageCards />
          <Dashboard />
        </Grid>
        <Grid item xs={12} sm={0} md={1} lg={1} xl={2}></Grid>
      </Grid>
    </Box>
  );
}

export default Home;