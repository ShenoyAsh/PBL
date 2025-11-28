import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, MapPin, Droplet, Phone, Mail } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sample donor data - in a real app, this would come from an API
const sampleDonors = [
  {
    id: 1,
    name: 'John Smith',
    bloodType: 'A+',
    location: { lat: 40.7128, lng: -74.0060 },
    lastDonation: '2 months ago',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@example.com',
    available: true,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    bloodType: 'O-',
    location: { lat: 40.72, lng: -74.01 },
    lastDonation: '3 months ago',
    phone: '+1 (555) 987-6543',
    email: 'sarah.j@example.com',
    available: true,
  },
  {
    id: 3,
    name: 'Michael Chen',
    bloodType: 'B+',
    location: { lat: 40.71, lng: -74.00 },
    lastDonation: '1 month ago',
    phone: '+1 (555) 456-7890',
    email: 'michael.c@example.com',
    available: true,
  },
];

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const FindDonors = () => {
  const [donors, setDonors] = useState(sampleDonors);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    bloodType: '',
    location: '',
    availability: true,
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const filteredDonors = donors.filter((donor) => {
    return (
      (filters.bloodType ? donor.bloodType === filters.bloodType : true) &&
      (filters.availability ? donor.available === filters.availability : true)
    );
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Blood Donors</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Filter Donors</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  name="bloodType"
                  value={filters.bloodType}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Blood Types</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={filters.availability}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show available donors only</span>
                </label>
              </div>
              
              <button
                onClick={() => setFilters({ bloodType: '', location: '', availability: true })}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <p>• {filteredDonors.length} donors found</p>
              <p>• {new Set(filteredDonors.map(d => d.bloodType)).size} different blood types</p>
              <p>• {filteredDonors.filter(d => d.available).length} currently available</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
            <MapContainer 
              center={[40.7128, -74.0060]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <ChangeView center={[40.7128, -74.0060]} zoom={13} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredDonors.map((donor) => (
                <Marker 
                  key={donor.id} 
                  position={[donor.location.lat, donor.location.lng]} 
                  icon={DefaultIcon}
                >
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-medium">{donor.name}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Droplet className="h-4 w-4 mr-1" />
                        <span>Blood Type: {donor.bloodType}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Last donation: {donor.lastDonation}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <a 
                          href={`tel:${donor.phone}`} 
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          {donor.phone}
                        </a>
                        <a 
                          href={`mailto:${donor.email}`} 
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {donor.email}
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Available Donors</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Donation</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {donor.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donor.bloodType.endsWith('+') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {donor.bloodType}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{donor.lastDonation}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <a href={`tel:${donor.phone}`} className="text-blue-600 hover:text-blue-800">
                          {donor.phone}
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href={`mailto:${donor.email}`} className="text-blue-600 hover:text-blue-800 mr-3">
                          Email
                        </a>
                        <a href={`tel:${donor.phone}`} className="text-blue-600 hover:text-blue-800">
                          Call
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDonors;
