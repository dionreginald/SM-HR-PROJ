// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Public Components
import Homepage from './components/Homepage';
import HomeNavbar from './components/Homenavbar';
import Register from './components/Register';
import Login from './components/Login';
import TawkToChat from './components/TawkToChat';

// Public Pages
import FeaturesPage from './pages/FeaturesPage';
import ResourcesPage from './pages/ResourcesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import Logout from './components/Logout';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import EditEmployee from './components/EditEmployee';
import EmployeeDetails from './components/EmployeeDetails';
import AddPayroll from './components/AddPayroll';
import ViewPayrolls from './components/ViewPayrolls';
import Payslips from './components/Payslips';
import ViewLeaveRequests from './components/ViewLeaveRequests';
import AdminNotificationSender from './components/AdminNotificationSender';
import Events from './components/Events';
import AdminFooter from './components/AdminFooter'; // ✅ Footer for Admin

// Employee Components
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeProfile from './components/EmployeeProfile';
import EmployeeLeaveRequest from './components/EmployeeLeaveRequest';
import EmployeeNotificationList from './components/EmployeeNotificationList';
import EmployeePayslips from './components/EmployeePayslips';
import EmployeeLayout from './components/EmployeeLayout';

// Protected Route Logic
function AdminProtectedRoute({ children }) {
  const admin = localStorage.getItem('admin');
  return admin ? children : <Navigate to="/login" replace />;
}

function EmployeeProtectedRoute({ children }) {
  const employee = localStorage.getItem('employee');
  return employee ? children : <Navigate to="/employee-login" replace />;
}

// Wrapper for Admin pages with sticky footer
const AdminPageWrapper = ({ children }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  }}>
    <div style={{ flex: 1 }}>
      {children}
    </div>
    <AdminFooter />
  </div>
);

// Pages with HomeNavbar and Tawk.to
const withNavbar = (Component) => () => (
  <>
    <HomeNavbar />
    <Component />
    <TawkToChat /> {/* ✅ Live Chat Widget on public pages */}
  </>
);

const HomePageWithNavbar = withNavbar(Homepage);
const RegisterPageWithNavbar = withNavbar(Register);
const LoginPageWithNavbar = withNavbar(Login);
const FeaturesPageWithNavbar = withNavbar(FeaturesPage);
const ResourcesPageWithNavbar = withNavbar(ResourcesPage);
const PricingPageWithNavbar = withNavbar(PricingPage);
const AboutPageWithNavbar = withNavbar(AboutPage);
const ContactPageWithNavbar = withNavbar(ContactPage);

export default function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePageWithNavbar />} />
          <Route path="/register" element={<RegisterPageWithNavbar />} />
          <Route path="/login" element={<LoginPageWithNavbar />} />
          <Route path="/features" element={<FeaturesPageWithNavbar />} />
          <Route path="/resources" element={<ResourcesPageWithNavbar />} />
          <Route path="/pricing" element={<PricingPageWithNavbar />} />
          <Route path="/about" element={<AboutPageWithNavbar />} />
          <Route path="/contact" element={<ContactPageWithNavbar />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />

          {/* Admin Routes with Footer */}
          <Route path="/dashboard" element={<AdminProtectedRoute><AdminPageWrapper><Dashboard /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/profile" element={<AdminProtectedRoute><AdminPageWrapper><Profile /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/change-password" element={<AdminProtectedRoute><AdminPageWrapper><ChangePassword /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/add-employee" element={<AdminProtectedRoute><AdminPageWrapper><AddEmployee /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/employees" element={<AdminProtectedRoute><AdminPageWrapper><ViewEmployees /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/employees/:id" element={<AdminProtectedRoute><AdminPageWrapper><EmployeeDetails /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/edit-employee/:id" element={<AdminProtectedRoute><AdminPageWrapper><EditEmployee /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/add-payroll" element={<AdminProtectedRoute><AdminPageWrapper><AddPayroll /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/view-payrolls" element={<AdminProtectedRoute><AdminPageWrapper><ViewPayrolls /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/payslips" element={<AdminProtectedRoute><AdminPageWrapper><Payslips /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/leave-requests" element={<AdminProtectedRoute><AdminPageWrapper><ViewLeaveRequests /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<AdminProtectedRoute><AdminPageWrapper><AdminNotificationSender /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/dashboard/events" element={<AdminProtectedRoute><AdminPageWrapper><Events /></AdminPageWrapper></AdminProtectedRoute>} />
          <Route path="/logout" element={<AdminProtectedRoute><AdminPageWrapper><Logout /></AdminPageWrapper></AdminProtectedRoute>} />

          {/* Employee Routes (using EmployeeLayout, no footer) */}
          <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeLayout><EmployeeDashboard /></EmployeeLayout></EmployeeProtectedRoute>} />
          <Route path="/employee-profile" element={<EmployeeProtectedRoute><EmployeeLayout><EmployeeProfile /></EmployeeLayout></EmployeeProtectedRoute>} />
          <Route path="/employee-leave-request" element={<EmployeeProtectedRoute><EmployeeLayout><EmployeeLeaveRequest /></EmployeeLayout></EmployeeProtectedRoute>} />
          <Route path="/employee-notifications" element={<EmployeeProtectedRoute><EmployeeLayout><EmployeeNotificationList employeeId={JSON.parse(localStorage.getItem('employee'))?.id} /></EmployeeLayout></EmployeeProtectedRoute>} />
          <Route path="/employee-payslips" element={<EmployeeProtectedRoute><EmployeeLayout><EmployeePayslips /></EmployeeLayout></EmployeeProtectedRoute>} />

          {/* 404 Page */}
          <Route path="*" element={<div style={{ padding: 20 }}><h2>404 - Page not found</h2></div>} />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}
