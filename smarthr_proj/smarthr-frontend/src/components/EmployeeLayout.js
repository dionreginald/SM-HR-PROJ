// src/components/EmployeeLayout.jsx
import React from 'react';
import EmployeeNavbar from './EmployeeNavbar'; // Ensure correct path
import { Box, useTheme } from '@mui/material'; // Import useTheme

export default function EmployeeLayout({ children }) {
    // You might fetch employee data here and pass it to Navbar
    const employee = JSON.parse(localStorage.getItem('employee'));
    const theme = useTheme(); // Access the current theme to use breakpoints

    // Determine the navbar height dynamically
    // You can make this even more robust if you have different navbar heights
    // by using useRef and measuring, but for fixed heights, this is fine.
    const navbarHeight = theme.breakpoints.up('sm') ? '70px' : '60px'; // Match your NavbarContainer's height

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <EmployeeNavbar employee={employee} />

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3, // General padding for the content
                    mt: navbarHeight, // Apply margin-top equal to navbarHeight
                    // You might also consider 'pt' for padding-top if 'p' isn't sufficient
                    // pt: `calc(${navbarHeight} + ${theme.spacing(3)})`, // Example if you want more space
                    width: '100%', // Ensure it takes full width
                    boxSizing: 'border-box', // Include padding in the element's total width and height
                }}
            >
                {children}
            </Box>

            {/* Optionally, a footer can go here */}
        </Box>
    );
}