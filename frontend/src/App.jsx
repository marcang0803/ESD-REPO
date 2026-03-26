import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  LandingPage,
  Login,
  UserDashboard,
  BrowseClasses,
  ClassDetails,
  MyBookings,
  Wallet,
  Profile,
  ProviderDashboard,
  CreateClass,
  ManageClasses,
  ProviderPayouts,
  AdminDashboard,
} from './pages';
import './index.css';

function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto bg-navy min-h-screen">
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/browse" element={<BrowseClasses />} />
          <Route path="/class/:id" element={<ClassDetails />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />

          {/* Provider Routes */}
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/create-class" element={<CreateClass />} />
          <Route path="/provider/classes" element={<ManageClasses />} />
          <Route path="/provider/payouts" element={<ProviderPayouts />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
