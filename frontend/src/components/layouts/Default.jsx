import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Default = ({ children }) => {
  return (
    <Container fluid>
      <Header />
      <Row>
        <Col className="main-content content-default">
          {children}
        </Col>
        <Footer />
      </Row>
    </Container>
  );
}

export default Default;
