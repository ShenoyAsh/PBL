import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import { Bell, Trash2 } from 'lucide-react';

// Auth Components
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import Register from './components/auth/Register';

// Public Components
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import Footer from './components/Footer';

// Legacy Components
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
  const [notifications, setNotifications] = useState([]);

  // Initialize mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "Urgent: A+ Blood needed at City Hospital", time: "10m ago", read: false },
      { id: 2, message: "Your donation request was approved.", time: "1h ago", read: false },
      { id: 3, message: "New donor registered in your area.", time: "2h ago", read: true },
      { id: 4, message: "Reminder: Blood drive tomorrow at 9 AM.", time: "1d ago", read: true }
    ]);
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

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

              {/* Legacy Routes */}
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
        <Footer />

        {/* Floating ChatBot Button */}
        <button
          onClick={() => setShowChatBot((v) => !v)}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-primary-green p-4 shadow-lg hover:bg-dark-green transition-transform hover:scale-105"
          aria-label="Open ChatBot"
        >
          <span className="font-bold text-white text-xl">💬</span>
        </button>
        {showChatBot && (
          <div className="fixed bottom-24 right-8 z-50 w-96 max-w-full animate-fade-in-up">
            <ChatBot />
          </div>
        )}

        {/* Notification Bell */}
        <div className="fixed top-24 right-8 z-50">
            <button
            onClick={() => setShowNotifications((v) => !v)}
            className="rounded-full bg-white p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all relative"
            aria-label="Notifications"
            >
            <Bell className="h-6 w-6 text-primary-green" />
            {notifications.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                {notifications.length}
                </span>
            )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                  {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Clear
                      </button>
                  )}
                </div>
                
                <ul className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                    <li key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                        {notif.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                    </li>
                    ))
                ) : (
                    <li className="px-4 py-8 text-center text-sm text-gray-500">
                    No new notifications
                    </li>
                )}
                </ul>
            </div>
            )}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;