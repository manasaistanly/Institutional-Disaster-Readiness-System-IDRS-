import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

import AlertBanner from './components/AlertBanner';
import AdminDashboard from './pages/AdminDashboard';
import SOPManagement from './pages/SOPManagement';
import DrillScheduler from './pages/DrillScheduler';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  // Allow super_admin or institution_admin
  if (!user || user.role === 'user') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <AlertBanner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sops"
          element={
            <AdminRoute>
              <SOPManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/drills"
          element={
            <AdminRoute>
              <DrillScheduler />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
