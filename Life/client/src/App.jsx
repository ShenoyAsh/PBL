import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import RegisterDonor from './components/RegisterDonor';
import RegisterPatient from './components/RegisterPatient';
import AdminDashboard from './components/AdminDashboard';
import FindMatch from './components/FindMatch';

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
    <div className="App min-h-screen font-sans text-gray-800">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register-donor" element={<RegisterDonor />} />
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="/find-match" element={<FindMatch />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;