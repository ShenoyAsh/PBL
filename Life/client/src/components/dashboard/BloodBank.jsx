import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Droplet, AlertCircle, CheckCircle } from 'lucide-react';

// Sample blood bank inventory data
const initialInventory = [
  { id: 1, bloodType: 'A+', units: 15, status: 'good', lastUpdated: '2023-11-28' },
  { id: 2, bloodType: 'A-', units: 8, status: 'warning', lastUpdated: '2023-11-28' },
  { id: 3, bloodType: 'B+', units: 20, status: 'good', lastUpdated: '2023-11-27' },
  { id: 4, bloodType: 'B-', units: 5, status: 'critical', lastUpdated: '2023-11-28' },
  { id: 5, bloodType: 'AB+', units: 12, status: 'good', lastUpdated: '2023-11-27' },
  { id: 6, bloodType: 'AB-', units: 3, status: 'critical', lastUpdated: '2023-11-26' },
  { id: 7, bloodType: 'O+', units: 25, status: 'good', lastUpdated: '2023-11-28' },
  { id: 8, bloodType: 'O-', units: 4, status: 'critical', lastUpdated: '2023-11-28' },
];

// Sample recent transactions
const recentTransactions = [
  { id: 1, type: 'Donation', bloodType: 'A+', units: 2, date: '2023-11-28', status: 'completed' },
  { id: 2, type: 'Request', bloodType: 'O-', units: 1, date: '2023-11-28', status: 'pending' },
  { id: 3, type: 'Donation', bloodType: 'B+', units: 1, date: '2023-11-27', status: 'completed' },
  { id: 4, type: 'Request', bloodType: 'AB-', units: 2, date: '2023-11-27', status: 'completed' },
  { id: 5, type: 'Donation', bloodType: 'O+', units: 3, date: '2023-11-26', status: 'completed' },
];

const BloodBank = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUnit, setNewUnit] = useState({
    bloodType: 'A+',
    units: '',
    status: 'good',
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddUnit = (e) => {
    e.preventDefault();
    const newItem = {
      id: inventory.length + 1,
      bloodType: newUnit.bloodType,
      units: parseInt(newUnit.units, 10),
      status: newUnit.status,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setInventory([...inventory, newItem]);
    setShowAddForm(false);
    setNewUnit({ bloodType: 'A+', units: '', status: 'good' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'good':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'critical') {
      return <AlertCircle className="h-4 w-4" />;
    } else if (status === 'warning') {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blood Bank Management</h2>
        <div className="mt-4 md:mt-0 flex space-x-3
        ">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blood Unit
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Blood Unit</h3>
          <form onSubmit={handleAddUnit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  value={newUnit.bloodType}
                  onChange={(e) => setNewUnit({ ...newUnit, bloodType: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
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
                <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                  Units
                </label>
                <input
                  type="number"
                  id="units"
                  value={newUnit.units}
                  onChange={(e) => setNewUnit({ ...newUnit, units: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="good">Good</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add to Inventory
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blood type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="good">Good</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((type) => {
            const item = inventory.find(i => i.bloodType === type) || { units: 0, status: 'empty' };
            const status = item.units === 0 ? 'empty' : item.status;
            
            return (
              <div 
                key={type} 
                className={`p-4 rounded-lg border ${
                  status === 'critical' 
                    ? 'bg-red-50 border-red-200' 
                    : status === 'warning' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : status === 'empty'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplet 
                      className={`h-6 w-6 ${
                        status === 'critical' 
                          ? 'text-red-600' 
                          : status === 'warning' 
                            ? 'text-yellow-600' 
                            : status === 'empty'
                              ? 'text-gray-400'
                              : 'text-green-600'
                      }`} 
                    />
                    <span className="ml-2 text-lg font-semibold">{type}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    status === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : status === 'warning' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : status === 'empty'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                  }`}>
                    {status === 'empty' ? 'Empty' : status === 'good' ? 'Good' : status === 'warning' ? 'Low' : 'Critical'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{item.units || 0} <span className="text-sm font-normal text-gray-500">units</span></div>
                  <div className="text-xs text-gray-500 mt-1">Last updated: {item.lastUpdated || 'N/A'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Transactions</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Units</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'Donation' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.bloodType}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.units} unit{transaction.units !== 1 ? 's' : ''}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.date}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BloodBank;
