import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api, { createAdminApi } from '../services/api';
import { User, UserCheck, Stethoscope, Download, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import BloodBankModal from './BloodBankModal';
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import SentimentAnalysisResult from './SentimentAnalysisResult';

// A simple tabs component
const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Donors', icon: User },
    { name: 'Patients', icon: Stethoscope },
    { name: 'Data & Tools', icon: Download },
  ];
  return (
    <nav className="flex space-x-4 border-b border-gray-200" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`
            ${activeTab === tab.name
              ? 'border-primary-green text-primary-green'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
            group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium
          `}
        >
          <tab.icon className="-ml-0.5 h-5 w-5" />
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default function AdminDashboard() {
    // Animation state for fade-in
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
      setFadeIn(true);
    }, []);
  const [activeTab, setActiveTab] = useState('Donors');
  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  // Sentiment analysis states
  const [feedbackText, setFeedbackText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [donorRes, patientRes] = await Promise.all([
        api.get('/donors'),
        api.get('/patients'),
      ]);
      setDonors(donorRes.data);
      setPatients(patientRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleManualVerify = async (donorId) => {
    if (!window.confirm("Are you sure you want to manually verify this donor?")) return;
    
    try {
        // This endpoint should be protected by JWT auth in a real app
        // Using it unprotected for prototype
        await api.post(`/admin/verify-donor/${donorId}`);
        toast.success("Donor verified!");
        fetchData(); // Refresh data
    } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed");
    }
  }

  const handleExport = async () => {
    const adminApi = createAdminApi();
    if (!adminApi) return;
    
    toast.info("Generating Excel export...");
    try {
        const res = await adminApi.get('/export/excel', {
            responseType: 'blob', // Important
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lifelink_export.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Export downloaded!");
    } catch (err) {
        toast.error(err.response?.data?.message || "Export failed. Check API Key.");
    }
  };
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const adminApi = createAdminApi();
    if (!adminApi) return;
    
    const formData = new FormData();
    formData.append('excelFile', file);
    
    toast.info("Uploading and importing data...");
    try {
        const res = await adminApi.post('/import/excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(res.data.message);
        fetchData(); // Refresh data
    } catch (err) {
        toast.error(err.response?.data?.message || "Import failed. Check API Key.");
    }
  };


  return (
    <div className={`container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${fadeIn ? 'animate-fade-in' : ''}`}>
      {/* Hero Section with image and animation */}
      <div className="flex flex-col items-center mb-8 animate-slide-in">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="LifeLink Dashboard" className="rounded-xl shadow-lg w-full max-w-2xl mb-4" style={{animation: 'pulse 2s infinite'}} />
        <h1 className="text-4xl font-bold text-primary-green mb-2 animate-fade-in">LifeLink Admin Dashboard</h1>
        <p className="text-lg text-gray-600 animate-fade-in">Manage donors, patients, and emergency requests with ease.</p>
      </div>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
          70% { box-shadow: 0 0 20px 10px rgba(34,197,94,0.2); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
        }
        .animate-slide-in {
          animation: slide-in 1s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slide-in {
          0% { transform: translateY(-40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
      <div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>

  <Link
    to="/admin/emergency-dashboard"
    className="text-sm font-medium text-gray-600 hover:text-primary-green"
  >
    Emergency Dashboard
  </Link>
</div>

<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      
      {isLoading && <Loader2 className="mt-8 h-8 w-8 animate-spin text-primary-green" />}

      <div className="mt-8">
        {/* Donors Tab */}
        {activeTab === 'Donors' && (
          <div className="overflow-x-auto rounded-lg bg-white shadow ring-1 ring-gray-900/5">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Blood</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {donors.map(donor => (
                        <tr key={donor._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.email}<br/>{donor.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{donor.bloodType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {donor.verified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        <CheckCircle className="h-3 w-3" /> Verified
                                    </span>
                                ) : (
                                     <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                        <XCircle className="h-3 w-3" /> Unverified
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {!donor.verified && (
                                    <button onClick={() => handleManualVerify(donor._id)} className="rounded bg-primary-green px-2 py-1 text-xs text-white hover:bg-dark-green">
                                        Verify
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        )}
        
        {/* Patients Tab */}
        {activeTab === 'Patients' && (
           <div className="overflow-x-auto rounded-lg bg-white shadow ring-1 ring-gray-900/5">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Blood</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Urgency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Location</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {patients.map(p => (
                        <tr key={p._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.email}<br/>{p.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{p.bloodType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.urgency}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.location.name}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Data & Tools Tab */}
        {activeTab === 'Data & Tools' && (
          <div className="space-y-8 rounded-lg bg-white p-8 shadow ring-1 ring-gray-900/5">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Excel Data Management</h3>
              <p className="mt-1 text-sm text-gray-500">Import or export the entire database (Donors & Patients) as an Excel file. Requires Admin API Key.</p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Export to Excel
                </button>
                        
                <label className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 cursor-pointer">
                  <Upload className="h-4 w-4" /> Import from Excel
                  <input type="file" accept=".xlsx" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Blood Bank Directory</h3>
              <p className="mt-1 text-sm text-gray-500">View or download the manually curated list of blood banks.</p>
               <div className="mt-4">
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark-green"
                >
                  View Directory
                </button>
              </div>
            </div>

            {/* Sentiment Analysis Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Donor Feedback Sentiment Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">Paste donor feedback below to analyze satisfaction and issues.</p>
              <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded border-gray-300 p-2"
              placeholder="Paste donor feedback here..."
              />
              <button
              onClick={async () => {
                if (!feedbackText.trim()) return toast.error('Enter feedback text');
                try {
                const res = await api.post('/sentiment-analysis', { text: feedbackText });
                setSentimentResult(res.data);
                toast.success('Sentiment analyzed!');
                } catch (err) {
                toast.error('Failed to analyze sentiment');
                }
              }}
              className="mt-2 px-4 py-2 bg-primary-green text-white rounded-md"
              >Analyze Sentiment</button>
              {sentimentResult && (
              <div className="mt-2 text-sm">
                <strong>Sentiment:</strong> {sentimentResult.sentiment}<br/>
                <strong>Score:</strong> {sentimentResult.score}
              </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role-based Sentiment Analysis for Admin */}
      {user?.role === 'admin' && (
        <div className="my-8">
          <SentimentAnalysisResult sentiment="Positive" />
        </div>
      )}

      <BloodBankModal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} />
    </div>
  );
}