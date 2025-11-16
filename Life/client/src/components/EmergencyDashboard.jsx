import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createAdminApi } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function EmergencyDashboard() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    bloodType: '',
    urgency: '',
    status: '' // Pending / Fulfilled / Expired
  });

  const fetchRequests = async () => {
    const adminApi = createAdminApi();
    if (!adminApi) return;
    setIsLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.bloodType) params.append('bloodType', filters.bloodType);
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.status) params.append('status', filters.status);

      const res = await adminApi.get(`/admin/emergency-requests?${params.toString()}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fetch requests. Check Admin API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchRequests();
  };

  const handleFulfill = async (id) => {
    const adminApi = createAdminApi();
    if (!adminApi) return;
    try {
      await adminApi.patch(`/admin/emergency-request/${id}/fulfill`);
      toast.success('Marked as fulfilled');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fulfill request');
    }
  };

  const handleExpire = async (id) => {
    const adminApi = createAdminApi();
    if (!adminApi) return;
    try {
      await adminApi.patch(`/admin/emergency-request/${id}/expire`);
      toast.success('Marked as expired');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to expire request');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Emergency Dashboard (Admin)</h1>

      <div className="mt-6 flex gap-4">
        <select name="bloodType" value={filters.bloodType} onChange={handleFilterChange} className="rounded-md border-gray-300 p-2">
          <option value="">All Blood Types</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
        </select>

        <select name="urgency" value={filters.urgency} onChange={handleFilterChange} className="rounded-md border-gray-300 p-2">
          <option value="">All Urgency</option>
          {['Critical','High','Medium','Low'].map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange} className="rounded-md border-gray-300 p-2">
          <option value="">Status: Pending</option>
          <option value="Pending">Pending</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Expired">Expired</option>
        </select>

        <button onClick={applyFilters} className="rounded bg-primary-green px-4 py-2 text-white">Apply</button>
      </div>

      {isLoading ? (
        <div className="mt-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="mt-8 grid gap-6">
          {requests.length === 0 && <p>No requests found.</p>}
          {requests.map(req => (
            <div key={req._id} className="rounded-lg bg-white p-6 shadow ring-1 ring-gray-900/5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{req.patientId?.name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">{req.requiredBloodType} • {req.urgency} • {req.status}</p>
                  <p className="mt-2 text-sm">{req.location?.name}</p>
                  <p className="mt-1 text-xs text-gray-400">Posted: {new Date(req.timePosted).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => handleFulfill(req._id)} className="rounded bg-blue-600 px-3 py-1 text-white">Mark Fulfilled</button>
                      <button onClick={() => handleExpire(req._id)} className="rounded bg-gray-600 px-3 py-1 text-white">Expire</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
