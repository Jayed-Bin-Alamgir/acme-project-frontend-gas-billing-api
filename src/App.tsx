import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminDashboard';
//import AdminDashboard from './pages/AdminDashboard'; // For later use

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}