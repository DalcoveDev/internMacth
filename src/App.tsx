import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
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
import InternshipApproval from './pages/InternshipApproval';
export function App() {
  return <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected routes */}
            <Route path="/post-internship" element={<ProtectedRoute allowedRoles={['company']}>
                  <PostInternship />
                </ProtectedRoute>} />
            <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>} />
            <Route path="/company-dashboard" element={<ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>} />
            <Route path="/application/:id" element={<ProtectedRoute allowedRoles={['company', 'student']}>
                  <ApplicationDetails />
                </ProtectedRoute>} />
            <Route path="/internship-approval/:id" element={<ProtectedRoute allowedRoles={['admin']}>
                  <InternshipApproval />
                </ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>;
}