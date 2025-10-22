import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import OTPModal from './OTPModal'; // We will create this next

export default function RegisterDonor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: 'A+',
    locationName: '',
    lat: '',
    lng: '',
    availability: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [donorId, setDonorId] = useState(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = 'Email is not valid';
    if (!formData.phone) tempErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = 'Phone must be 10 digits';
    if (!formData.locationName) tempErrors.locationName = 'Location name is required';
    if (!formData.lat) tempErrors.lat = 'Latitude is required';
    if (!formData.lng) tempErrors.lng = 'Longitude is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            locationName: "My Current Location" // User should update this
          }));
          setIsLoading(false);
          toast.success("Location fetched!");
        },
        () => {
          setIsLoading(false);
          toast.error("Unable to retrieve location. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/register-donor', formData);
      toast.success(res.data.message);
      setDonorId(res.data.donorId);
      setShowOTPModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSuccess = () => {
    setShowOTPModal(false);
    setDonorId(null);
    // Reset form or redirect
     setFormData({
        name: '', email: '', phone: '', bloodType: 'A+',
        locationName: '', lat: '', lng: '', availability: true,
     });
  }

  return (
    <>
      <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Become a Donor</h2>
          <p className="mt-2 text-gray-600">Join our network and save lives. Fill out the form below to get started.</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Form fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
               <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                <select name="bloodType" id="bloodType" value={formData.bloodType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green">
                  {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (10 digits)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <button type="button" onClick={handleGetLocation} className="text-sm text-primary-green hover:underline">
                Get My Current Location
              </button>
              <input type="text" name="locationName" placeholder="Location Name (e.g., 'Indiranagar, Bengaluru')" value={formData.locationName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
              {errors.locationName && <p className="mt-1 text-sm text-red-600">{errors.locationName}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                 <input type="number" step="any" name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
                 <input type="number" step="any" name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green" />
              </div>
               {errors.lat && <p className="mt-1 text-sm text-red-600">{errors.lat}</p>}
               {errors.lng && <p className="mt-1 text-sm text-red-600">{errors.lng}</p>}
            </div>
            
            <div className="flex items-center">
              <input id="availability" name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green" />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">Available for donation</label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-primary-green py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register & Verify'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        donorId={donorId}
        onSuccess={onOTPSuccess}
      />
    </>
  );
}