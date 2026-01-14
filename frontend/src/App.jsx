import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout'; // Import the new Layout
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

// Wrapper to apply Layout only to private routes
const LayoutWrapper = ({ children }) => {
    return <Layout>{children}</Layout>;
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard"
            element={
              <PrivateRoute>
                <LayoutWrapper>
                    <Dashboard />
                </LayoutWrapper>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <PrivateRoute roles={['CITIZEN']}>
                <LayoutWrapper>
                    <ReportIssue />
                </LayoutWrapper>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <LayoutWrapper>
                    <AdminDashboard />
                </LayoutWrapper>
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
