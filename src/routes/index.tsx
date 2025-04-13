import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Lazy load pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminTours = lazy(() => import('@/pages/admin/Tours'));
const TourForm = lazy(() => import('@/pages/admin/TourForm'));
const TripItinerary = lazy(() => import('@/pages/trips/itineraries/TripItinerary'));
const UserDashboard = lazy(() => import('@/pages/user/Dashboard'));

const LoadingSpinner = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tours" element={<AdminTours />} />
          <Route path="tours/new" element={<TourForm />} />
          <Route path="tours/:id" element={<TourForm />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'guide']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        {/* Public Tour Itinerary View */}
        <Route path="/tours/:id/itinerary" element={<TripItinerary />} />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}