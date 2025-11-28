import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import Register from './components/auth/Register';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import RegisterDonor from './components/RegisterDonor';
import AdminDashboard from './components/AdminDashboard';
import FindMatch from './components/FindMatch';
import EmergencyRequestForm from './components/EmergencyRequestForm';
import EmergencyDashboard from './components/EmergencyDashboard';

function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen font-sans text-gray-800">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Password Reset Route */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/register-donor" element={<RegisterDonor />} />
              <Route path="/emergency-request" element={<EmergencyRequestForm />} />
              <Route path="/find-match" element={<FindMatch />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/emergency-dashboard" element={<EmergencyDashboard />} />
            </Route>

            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;