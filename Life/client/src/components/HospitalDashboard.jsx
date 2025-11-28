import React, { useState, useEffect } from 'react';
import { User, AlertCircle, HeartPulse, MapPin, Users, Droplet, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const TABS = [
  { name: 'Overview' },
  { name: 'Emergency Requests' },
  { name: 'Find Donors' },
  { name: 'Create Request' },
  { name: 'Blood Bank' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emerald = 'bg-emerald-500 text-white';

function getBloodTypeColor(count) {
  if (count === 0) return 'bg-red-100 text-red-600 border-red-400';
  if (count < 3) return 'bg-red-50 text-red-500 border-red-200';
  if (count < 7) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    donors: 0,
    patients: 0,
    nearby: 0,
    bloodTypeCounts: {},
    recentRequests: [],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reqRes, donorRes] = await Promise.all([
          api.get('/admin/emergency-requests'),
          api.get('/donors'),
        ]);
        const requestsData = reqRes.data || [];
        const donorsData = donorRes.data || [];

        // Stats calculation
        const pending = requestsData.filter(r => r.status === 'Pending').length;
        const donorsAvailable = donorsData.filter(d => d.availability && d.verified).length;
        const patients = requestsData.map(r => r.patientId?._id).filter(Boolean).length;
        // Nearby requests: for demo, just count all requests (replace with location logic if needed)
        const nearby = requestsData.length;

        // Blood type counts
        const bloodTypeCounts = BLOOD_TYPES.reduce((acc, type) => {
          acc[type] = donorsData.filter(d => d.bloodType === type && d.availability && d.verified).length;
          return acc;
        }, {});

        // Recent requests (last 5)
        const recentRequests = requestsData
          .sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted))
          .slice(0, 5);

        setStats({
          pending,
          donors: donorsAvailable,
          patients,
          nearby,
          bloodTypeCounts,
          recentRequests,
        });
        setDonors(donorsData);
        setRequests(requestsData);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav Tabs */}
      <nav className="flex space-x-2 border-b bg-white px-8 pt-6 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
              activeTab === tab.name
                ? 'bg-emerald-500 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="p-8">
        {activeTab === 'Overview' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                <AlertCircle className="h-8 w-8 text-emerald-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-gray-500">Pending Requests</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                <Users className="h-8 w-8 text-emerald-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.donors}</div>
                  <div className="text-sm text-gray-500">Available Donors</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                <User className="h-8 w-8 text-emerald-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.patients}</div>
                  <div className="text-sm text-gray-500">Total Patients</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                <MapPin className="h-8 w-8 text-emerald-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.nearby}</div>
                  <div className="text-sm text-gray-500">Nearby Requests</div>
                </div>
              </div>
            </div>

            {/* Blood Type Availability Grid */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-emerald-700">Blood Type Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BLOOD_TYPES.map(type => (
                  <div
                    key={type}
                    className={`rounded-lg shadow-sm p-4 flex flex-col items-center border ${getBloodTypeColor(stats.bloodTypeCounts[type])}`}
                  >
                    <Droplet className="h-6 w-6 mb-2" />
                    <div className="font-bold text-lg">{type}</div>
                    <div className="text-2xl font-bold">{stats.bloodTypeCounts[type]}</div>
                    <div className="text-xs mt-1">
                      {stats.bloodTypeCounts[type] === 0
                        ? 'Unavailable'
                        : stats.bloodTypeCounts[type] < 3
                        ? 'Low'
                        : stats.bloodTypeCounts[type] < 7
                        ? 'Medium'
                        : 'High'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Emergency Requests Table */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-emerald-700">Recent Emergency Requests</h2>
              <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Urgency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentRequests.map(req => (
                      <tr key={req._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {req.patientId?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                          {req.urgency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.location?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {req.status === 'Pending' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              <XCircle className="h-3 w-3" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              <CheckCircle className="h-3 w-3" /> Fulfilled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stats.recentRequests.length === 0 && (
                  <div className="p-4 text-gray-500 text-center">No recent requests found.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Other tabs can be implemented as needed */}
        {activeTab !== 'Overview' && (
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8 text-gray-500 text-center">
            <span className="text-emerald-500 font-semibold">{activeTab}</span> content coming soon.
          </div>
        )}
      </div>
    </div>
  );
}