import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookRide from './pages/BookRide';
import BookingConfirmation from './pages/BookingConfirmation';
import MyRides from './pages/MyRides';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRides from './pages/admin/AdminRides';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminFeedback from './pages/admin/AdminFeedback';
import MvpSuccess from './pages/MvpSuccess';
import MvpCancel from './pages/MvpCancel';
import MvpPaymentModal from './components/common/MvpPaymentModal';
import FeedbackWidget from './components/common/FeedbackWidget';
import PaymentButton from './components/common/PaymentButton';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div></div>;
  if (!user || (user.role !== 'admin' && user.role !== 'developer')) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '8px', background: '#1e293b', color: '#fff' } }} />
      <MvpPaymentModal />
      <FeedbackWidget />
      <PaymentButton />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<ProtectedRoute><BookRide /></ProtectedRoute>} />
          <Route path="/booking-confirmation/:id" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
          <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
          <Route path="/mvp-success" element={<MvpSuccess />} />
          <Route path="/mvp-cancel" element={<MvpCancel />} />
        </Route>
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/rides" element={<AdminRides />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Route>
      </Routes>
    </>
  );
}
