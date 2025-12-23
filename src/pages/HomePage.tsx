import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-[#001f3f] shadow-md">
        <div className="text-2xl font-bold text-white tracking-tight">
          Smart <span className="text-blue-400">Gas</span> Billing
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/customer-login" className="text-gray-200 hover:text-white font-medium transition">
            Customer Portal
          </Link>
          <Link 
            to="/admin-login" 
            className="text-gray-200 hover:text-white font-medium transition"
          >
            Admin Access
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-black text-slate-900 mb-6 leading-tight">
            Smart Utility Billing <br />
            <span className="text-[#001f3f]">Made Simple</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            A powerful rule-engine platform to calculate gas bills with precision. High-speed, accurate, and transparent.
          </p>
          
          {/* Changed Div/Button Combinations */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/customer-login" 
              className="bg-[#001f3f] text-blue-400 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-800 transition transform hover:-translate-y-1"
            >
              Calculate My Bill
            </Link>
            <Link 
              to="/admin-login" 
              className="bg-[#001f3f] text-blue-400 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-800 transition transform hover:-translate-y-1"
            >
              System Settings
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center">
        <p className="text-slate-500 font-medium">
          © 2025 Acme AI Ltd. | Mirpur DOHS, Dhaka 
        </p>
      </footer>
    </div>
  );
}