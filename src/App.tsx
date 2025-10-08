import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Search from './pages/Search.tsx';
import PostInternship from './pages/PostInternship';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationDetails from './pages/ApplicationDetails';
import ApplicationForm from './pages/ApplicationForm';
import InternshipApproval from './pages/InternshipApproval';
import { ToastProvider } from './components/ToastProvider';
import { ConfirmProvider } from './components/ConfirmDialog';

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <ConfirmProvider>
            <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/search" element={
                <ProtectedRoute allowedRoles={['student']} allowGuest={true}>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Application Form Route */}
              <Route path="/apply/:id" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ApplicationForm />
                </ProtectedRoute>
              } />
              {/* Protected routes */}
              <Route path="/post-internship" element={
                <ProtectedRoute allowedRoles={['company']}>
                  <PostInternship />
                </ProtectedRoute>
              } />
              <Route path="/student-dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/company-dashboard" element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/application/:id" element={
                <ProtectedRoute allowedRoles={['company', 'student']}>
                  <ApplicationDetails />
                </ProtectedRoute>
              } />
              <Route path="/internship-approval/:id" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InternshipApproval />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
            </Router>
          </ConfirmProvider>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}