import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [config, setConfig] = useState({
    rate_per_litre: 0,
    vat_percentage: 0,
    service_charge: 0,
    admin_pin: ''
  });

  const [loading, setLoading] = useState(true);

  // Define API URL once using Environment Variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // 1. Fetch current data from Backend on page load
  useEffect(() => {
    // UPDATED: Use dynamic URL instead of localhost
    fetch(`${API_BASE_URL}/billing/config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig({
          rate_per_litre: Number(data.rate_per_litre),
          vat_percentage: Number(data.vat_percentage),
          service_charge: Number(data.service_charge),
          admin_pin: '' 
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching config:", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // 2. Send updated data to Backend
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // UPDATED: Use /billing/config and method PATCH
      const response = await fetch(`${API_BASE_URL}/billing/config`, {
        method: 'PATCH', // Use PATCH to update existing record
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.status === 401) {
        alert("❌ Access Denied: Incorrect Admin PIN!");
        return;
      }

      if (response.ok) {
        alert("✅ Configuration updated successfully!");
        // Clear the PIN field after success for security
        setConfig(prev => ({ ...prev, admin_pin: '' }));
      } else {
        const errData = await response.json();
        alert(`❌ Error: ${errData.message || "Failed to update"}`);
      }
    } catch (error) {
      alert("❌ Server connection lost. Check if backend is running.");
    }
  };

  if (loading) return <div className="text-center p-20">Loading Configuration...</div>;

  return (
    // ... rest of your JSX remains exactly the same
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-[#001f3f] shadow-md">
        <div className="text-2xl font-bold text-white tracking-tight">
          Smart <span className="text-blue-400">Gas</span> Billing
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-gray-200 hover:text-white font-medium transition">Home</Link>
          <Link to="/customer-login" className="text-gray-200 hover:text-white font-medium transition">Customer Portal</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Configuration Dashboard</h1>
          
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4 text-[#001f3f]">Update Pricing Rules</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Per Litre (৳)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    value={config.rate_per_litre}
                    onChange={(e) => setConfig({...config, rate_per_litre: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VAT (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    max="100"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    value={config.vat_percentage}
                    onChange={(e) => setConfig({...config, vat_percentage: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (৳)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    value={config.service_charge}
                    onChange={(e) => setConfig({...config, service_charge: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold text-red-600">Admin Security PIN</label>
                <input 
                  type="password" 
                  placeholder="Enter 6-digit PIN to authorize changes"
                  className="w-full max-w-md p-3 border border-slate-200 rounded-xl outline-none bg-slate-50"
                  value={config.admin_pin}
                  onChange={(e) => setConfig({...config, admin_pin: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="bg-[#001f3f] text-white px-10 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                Apply New Configuration
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="py-8 bg-white border-t border-slate-200 text-center">
        <p className="text-slate-500 font-medium">© 2025 Acme AI Ltd. | Mirpur DOHS, Dhaka</p>
      </footer>
    </div>
  );
}