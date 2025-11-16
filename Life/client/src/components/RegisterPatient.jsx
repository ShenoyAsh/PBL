import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function EmergencyRequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: 'A+',
    locationName: '',
    lat: '',
    lng: '',
    urgency: 'High',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencies = ['Critical', 'High', 'Medium', 'Low'];

  const validate = () => {
    let temp = {};
    if (!formData.name) temp.name = 'Name is required';
    if (!formData.email) temp.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) temp.email = 'Email is not valid';
    if (!formData.phone) temp.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) temp.phone = 'Phone must be 10 digits';
    if (!formData.locationName) temp.locationName = 'Location name is required';
    if (!formData.lat) temp.lat = 'Latitude is required';
    if (!formData.lng) temp.lng = 'Longitude is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            locationName: 'My Current Location'
          }));
          setIsLoading(false);
          toast.success('Location fetched');
        },
        () => {
          setIsLoading(false);
          toast.error('Unable to retrieve location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      // 1) Create patient
      const patientRes = await api.post('/register-patient', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bloodType: formData.bloodType,
        locationName: formData.locationName,
        lat: formData.lat,
        lng: formData.lng,
        urgency: formData.urgency, // optional, kept in patient for reference
      });

      const patientId = patientRes.data.patientId || patientRes.data._id;
      if (!patientId) {
        toast.warning('Patient created but no ID returned. Please check server response.');
      }

      // 2) Immediately create emergency request
      await api.post('/emergency-request', {
        patientId,
        requiredBloodType: formData.bloodType,
        urgency: formData.urgency,
        locationName: formData.locationName,
        lat: formData.lat,
        lng: formData.lng
      });

      toast.success('Emergency request posted. Help is on the way.');
      // Optionally redirect to home or a success page
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit emergency request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5">
        <h2 className="text-3xl font-bold tracking-tight text-red-600">Request Emergency Blood</h2>
        <p className="mt-2 text-gray-600">Submit this form to create a patient record and an emergency request immediately.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Patient's Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Required Blood Type</label>
              <select name="bloodType" id="bloodType" value={formData.bloodType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Phone (10 digits)</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency Level</label>
            <select name="urgency" id="urgency" value={formData.urgency} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
              {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Patient Location</label>
            <button type="button" onClick={handleGetLocation} className="text-sm text-primary-green hover:underline">Get My Current Location</button>
            <input type="text" name="locationName" placeholder="Location Name (e.g., 'Apollo Hospital, Bengaluru')" value={formData.locationName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
            {errors.locationName && <p className="mt-1 text-sm text-red-600">{errors.locationName}</p>}
            <div className="grid grid-cols-2 gap-4">
              <input type="number" step="any" name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
              <input type="number" step="any" name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md border border-transparent bg-red-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Emergency Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
