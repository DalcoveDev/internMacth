import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Search from './pages/Search.tsx';
import PostInternship from './pages/PostInternship';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetailsView from './pages/ApplicationDetailsView';
import { ConfirmProvider } from './components/ConfirmDialog';
import { lazy, Suspense } from 'react';
import FeedbackPage from './pages/FeedbackPage';
import { Toaster } from '@/components/ui/toaster';

// Lazy load heavy components
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InternshipApproval = lazy(() => import('./pages/InternshipApproval'));

// Lazy load contact page
const Contact = lazy(() => import('./pages/Contact'));
const SendNotification = lazy(() => import('./pages/SendNotification'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const NotificationCenter = lazy(() => import('./pages/NotificationCenter'));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Community = lazy(() => import('./pages/Community'));
const Resources = lazy(() => import('./pages/Resources'));
const SuccessStories = lazy(() => import('./pages/SuccessStories'));
const TestEnv = lazy(() => import('./pages/TestEnv'));
const CompanyLanding = lazy(() => import('./pages/CompanyLanding')); // Add this import
const SimpleTest = lazy(() => import('./pages/SimpleTest'));
const EnvTest = lazy(() => import('./pages/EnvTest'));
const ApplicationConfirmation = lazy(() => import('./pages/ApplicationConfirmation'));

// Loading component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system">
        <NotificationProvider>
          <ConfirmProvider>
              <Router>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Test route for environment variables */}
              <Route path="/test-env" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TestEnv />
                </Suspense>
              } />
              <Route path="/simple-test" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SimpleTest />
                </Suspense>
              } />
              <Route path="/env-test" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <EnvTest />
                </Suspense>
              } />
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
              <Route path="/contact" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/company" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CompanyLanding />
                </Suspense>
              } />
              {/* Application Form Route */}
              <Route path="/apply/:id" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ApplicationForm />
                </ProtectedRoute>
              } />
              {/* Protected routes with lazy loading */}
              <Route path="/post-internship" element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <PostInternship />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/student-dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <StudentDashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/company-dashboard" element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CompanyDashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/application/:id" element={
                <ProtectedRoute allowedRoles={['company', 'student']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ApplicationDetailsView />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/send-notification/:id" element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SendNotification />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <StudentProfile />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute allowedRoles={['student', 'company', 'admin']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotificationCenter />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/career-guidance" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CareerGuidance />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute allowedRoles={['student', 'company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Community />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute allowedRoles={['student', 'company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Resources />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/success-stories" element={
                <ProtectedRoute allowedRoles={['student', 'company']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SuccessStories />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/internship-approval/:id" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <InternshipApproval />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/application-confirmation" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ApplicationConfirmation />
                  </Suspense>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
              </Router>
            </ConfirmProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}