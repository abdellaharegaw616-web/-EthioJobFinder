import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import CompanyProfile from './pages/CompanyProfile';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import HelpCenter from './pages/HelpCenter';
import OurStory from './pages/OurStory';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-job/:id" 
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
              <Route path="/company/:companyId" element={<CompanyProfile />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </JobProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
