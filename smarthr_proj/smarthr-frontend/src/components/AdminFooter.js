// src/components/AdminFooter.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  marginTop: 'auto', // ✅ Pushes footer to bottom
  width: '100%',
  position: 'relative', // ✅ Works well for short content
  bottom: 0,
}));

const AdminFooter = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SmartHR. All rights reserved.
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default AdminFooter;
