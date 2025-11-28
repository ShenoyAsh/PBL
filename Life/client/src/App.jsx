import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import { Bell } from 'lucide-react';

// Auth Components
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import Register from './components/auth/Register';

// Public Components
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';

// Legacy Components (to be migrated to new dashboard structure)
import RegisterDonor from './components/RegisterDonor';
import AdminDashboard from './components/AdminDashboard';
import HospitalDashboard from './components/HospitalDashboard';
import FindMatch from './components/FindMatch';
import EmergencyRequestForm from './components/EmergencyRequestForm';
import EmergencyDashboard from './components/EmergencyDashboard';
import ChatBot from './components/ChatBot';

// New Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import FindDonors from './components/dashboard/FindDonors';
import BloodBank from './components/dashboard/BloodBank';
import CreateRequest from './components/dashboard/CreateRequest';
import EmergencyRequests from './components/dashboard/EmergencyRequests';

function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
    </>
  );
}

function App() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <AuthProvider>
      <div className="App min-h-screen font-sans text-gray-800 relative">
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
              {/* New Dashboard Structure */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="emergency-requests" element={<EmergencyRequests />} />
                <Route path="find-donors" element={<FindDonors />} />
                <Route path="create-request" element={<CreateRequest />} />
                <Route path="blood-bank" element={<BloodBank />} />
              </Route>

              {/* Legacy Routes (Kept for backward compatibility) */}
              <Route path="/register-donor" element={<RegisterDonor />} />
              <Route path="/emergency-request" element={<EmergencyRequestForm />} />
              <Route path="/find-match" element={<FindMatch />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/emergency-dashboard" element={<EmergencyDashboard />} />
              <Route path="/admin/hospital-dashboard" element={<HospitalDashboard />} />
            </Route>

            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {/* Floating ChatBot Button */}
        <button
          onClick={() => setShowChatBot((v) => !v)}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-primary-green p-4 shadow-lg hover:bg-dark-green"
          aria-label="Open ChatBot"
        >
          <span className="font-bold text-white">💬</span>
        </button>
        {showChatBot && (
          <div className="fixed bottom-24 right-8 z-50 w-96 max-w-full">
            <ChatBot />
          </div>
        )}
        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications((v) => !v)}
          className="fixed top-8 right-8 z-50 rounded-full bg-white p-3 shadow-lg border border-gray-200 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6 text-primary-green" />
        </button>
        {showNotifications && (
          <div className="fixed top-20 right-8 z-50 w-80 max-w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>No new notifications.</li>
              {/* TODO: Connect to backend for real notifications */}
            </ul>
            <button className="mt-4 text-xs text-primary-green hover:underline" onClick={() => setShowNotifications(false)}>Close</button>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;