// src/components/EmployeePageWrapper.jsx
import React from 'react';
import AdminFooter from './AdminFooter'; // Reuse the same footer component

const EmployeePageWrapper = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <div style={{ flex: 1 }}>
      {children}
    </div>
    <AdminFooter />
  </div>
);

export default EmployeePageWrapper;
