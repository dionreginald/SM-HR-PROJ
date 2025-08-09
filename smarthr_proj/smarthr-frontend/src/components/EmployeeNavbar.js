// src/components/EmployeeNavbar.jsx
import React, { useState, useEffect } from 'react'; // Removed createContext, useContext as they are now in ThemeContext.js
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

// Material-UI Imports
import {
    Box,
    Typography,
    Button,
    Tooltip,
    IconButton,
    Badge,
    Switch,
    FormControlLabel,
} from '@mui/material';
// Ensure useTheme and alpha are imported from @mui/material/styles
import { styled, alpha } from '@mui/material/styles'; // Corrected import for useTheme

// Import useThemeContext from your dedicated ThemeContext.js file
import { useThemeContext } from '../contexts/ThemeContext';


// --- Styled Components for the Navbar ---
// (No changes here, assuming they are correct from previous iterations)

const NavbarContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: theme.palette.mode === 'light'
        ? `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`
        : `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
    boxShadow: theme.palette.mode === 'light'
        ? '0 4px 15px rgba(0, 0, 0, 0.1)'
        : '0 4px 15px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 3),
    zIndex: 1100,
    height: '70px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 2),
        height: '60px',
    },
}));

const LogoContainer = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    '& img': {
        height: '45px',
        width: 'auto',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        '& img': {
            height: '35px',
        },
    },
}));

const NavItemsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
        gap: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '90px',
    height: '45px',
    borderRadius: '25px',
    transition: 'background-color 0.3s ease, transform 0.2s ease, color 0.3s ease, box-shadow 0.3s ease',
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,

    backgroundColor: active
        ? theme.palette.primary.main
        : 'transparent',
    color: active
        ? theme.palette.primary.contrastText
        : theme.palette.text.secondary,

    boxShadow: active
        ? `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`
        : 'none',

    '&:hover': {
        backgroundColor: active
            ? theme.palette.primary.dark
            : (theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.text.primary, 0.08)),
        transform: 'translateY(-3px)',
        color: active
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
        boxShadow: active
            ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`
            : (theme.palette.mode === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(255, 255, 255, 0.1)'),
    },

    '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
        fontSize: '20px',
        color: active
            ? theme.palette.primary.contrastText
            : theme.palette.text.secondary,
        transition: 'color 0.3s ease',
    },

    [theme.breakpoints.down('sm')]: {
        minWidth: 'unset',
        padding: theme.spacing(0.8, 1.2),
        fontSize: '0.8rem',
        '& .MuiButton-startIcon': {
            fontSize: '18px',
            marginRight: theme.spacing(0.3),
        },
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    transition: 'color 0.3s ease, transform 0.2s ease, background-color 0.3s ease',
    '&:hover': {
        color: theme.palette.primary.main,
        transform: 'scale(1.15)',
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
    fontSize: '0.95rem',
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));

const LogoutButton = styled(NavButton)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    boxShadow: `0 4px 15px ${alpha(theme.palette.error.main, 0.4)}`,
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
        boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.6)}`,
        transform: 'translateY(-3px)',
    },
    color: theme.palette.error.contrastText,
    '& .MuiButton-startIcon': {
        color: theme.palette.error.contrastText,
    },
}));


export default function EmployeeNavbar({ employee }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount] = useState(0);
    // This is correct: Get mode and toggleColorMode from the context
    const { toggleColorMode, mode } = useThemeContext();

    // Debugging logs - Keep these temporarily!
    useEffect(() => {
        console.log('EmployeeNavbar rendered. Current mode from context:', mode);
    }, [mode]); // Log whenever mode changes

    const handleLogout = () => {
        localStorage.removeItem('employee');
        navigate('/employee-login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <NavbarContainer aria-label="Employee Navigation Bar">
            {/* Logo */}
            <LogoContainer to="/employee-dashboard" aria-label="Go to Employee Dashboard" tabIndex={0}>
                {/* Dynamically choose logo based on theme mode. */}
                <img
                    src={mode === 'light' ? '/images/smarthr-logo.png' : '/images/smarthr-logo-dark.png'}
                    alt="SmartHR Logo"
                />
            </LogoContainer>

            {/* Right Side - Navigation Items */}
            <NavItemsContainer>
                {/* Dashboard Home Link */}
                <NavButton
                    component={Link}
                    to="/employee-dashboard"
                    active={isActive('/employee-dashboard') ? 1 : 0}
                    startIcon={<HomeIcon />}
                >
                    Home
                </NavButton>

                {/* Payroll Link */}
                <NavButton
                    component={Link}
                    to="/employee-payslips"
                    active={isActive('/employee-payslips') ? 1 : 0}
                    startIcon={<AccountBalanceWalletIcon />}
                >
                    Payroll
                </NavButton>

                {/* Profile Link */}
                <NavButton
                    component={Link}
                    to="/employee-profile"
                    active={isActive('/employee-profile') ? 1 : 0}
                    startIcon={<PersonIcon />}
                >
                    Profile
                </NavButton>

                {/* Leave Request Link */}
                <NavButton
                    component={Link}
                    to="/employee-leave-request"
                    active={isActive('/employee-leave-request') ? 1 : 0}
                    startIcon={<CalendarMonthIcon />}
                >
                    Leave
                </NavButton>

                {/* Notification Icon and Refresh */}
                <Tooltip title="Notifications">
                    <StyledIconButton
                        component={Link}
                        to="/employee-notifications"
                        aria-label={`View notifications, ${unreadCount} unread`}
                    >
                        <Badge badgeContent={unreadCount} color="error" overlap="circular" max={99}>
                            <NotificationsIcon />
                        </Badge>
                    </StyledIconButton>
                </Tooltip>

                {/* Dark/Light Mode Toggle Switch */}
                <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'} // THIS IS CORRECTLY LINKED TO THE 'mode' STATE
                                onChange={toggleColorMode}
                                name="darkModeToggle"
                                color="primary"
                                sx={(theme) => ({
                                    '& .MuiSwitch-thumb': {
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    },
                                    '& .MuiSwitch-track': {
                                        // This uses the 'theme' object passed into the sx function
                                        backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.primary.dark, 0.7),
                                    }
                                })}
                            />
                        }
                        label={mode === 'light' ? 'Light' : 'Dark'}
                        labelPlacement="start"
                        sx={(theme) => ({
                            color: theme.palette.text.secondary,
                            marginRight: theme.spacing(1),
                            '& .MuiTypography-root': {
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            },
                        })}
                    />
                </Tooltip>


                {/* Welcome Text */}
                <WelcomeText>
                    {employee ? `Welcome, ${employee.full_name || employee.email.split('@')[0]}` : ''}
                </WelcomeText>

                {/* Logout Button */}
                <LogoutButton
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                >
                    Logout
                </LogoutButton>
            </NavItemsContainer>
        </NavbarContainer>
    );
}