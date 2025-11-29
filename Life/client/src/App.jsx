import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PrivateRoute from './components/auth/PrivateRoute';
import NotificationBell from './components/notifications/NotificationBell';

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
import EmergencyRequestForm from './components/RegisterPatient'; 
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
  const [introComplete, setIntroComplete] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  
  // 1. Create a reference for the video player
  const videoRef = useRef(null);
  // 2. State to track if video has started
  const [isPlaying, setIsPlaying] = useState(false);

  // --- INTRO VIDEO LOGIC ---
  if (!introComplete) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center h-screen w-screen overflow-hidden">
        <video
          ref={videoRef}       // Attach the reference
          src="/intro.mp4"
          playsInline
          // NO autoPlay here
          // NO muted here
          className="w-full h-full object-cover"
          onEnded={() => setIntroComplete(true)}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Play Button - Only shows before video starts */}
        {!isPlaying && (
          <button
            onClick={() => {
              videoRef.current.play(); // Play programmatically
              setIsPlaying(true);
            }}
            className="absolute z-50 px-8 py-4 bg-primary-green text-white text-xl font-bold rounded-full shadow-2xl hover:bg-dark-green transition-transform hover:scale-105 animate-pulse"
          >
            ▶ Play Intro
          </button>
        )}
        
        {/* Skip Button */}
        <button
          onClick={() => setIntroComplete(true)}
          className="absolute bottom-10 right-10 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/20 transition-all text-sm font-medium"
        >
          Skip Intro
        </button>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="App min-h-screen font-sans text-gray-800 relative animate-fade-in">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-donor" element={<RegisterDonor />} />

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
            <NotificationBell />
          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;