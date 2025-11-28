import React from 'react';
import { Activity, Users, Clock, Heart } from 'lucide-react';

const Overview = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800">Active Requests</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          <p className="text-sm text-blue-500 mt-1">+2 from yesterday</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-green-800">Available Donors</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">156</p>
          <p className="text-sm text-green-500 mt-1">+12 this week</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-lg font-medium text-yellow-800">Pending Matches</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
          <p className="text-sm text-yellow-500 mt-1">Waiting for response</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="text-lg font-medium text-purple-800">Blood Bank Stock</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">87%</p>
          <p className="text-sm text-purple-500 mt-1">Good condition</p>
        </div>

        {/* New Feature Cards */}
        <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-medium text-pink-800">Lives Saved</h3>
             <Heart className="h-5 w-5 text-pink-600" />
          </div>
          <p className="text-3xl font-bold text-pink-600 mt-2">1,240</p>
          <p className="text-sm text-pink-500 mt-1">Since inception</p>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-medium text-indigo-800">Avg Response</h3>
             <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600 mt-2">15m</p>
          <p className="text-sm text-indigo-500 mt-1">-5% from last month</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New blood request from John Doe</p>
                <p className="text-sm text-gray-500">2 hours ago • A+ blood needed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;