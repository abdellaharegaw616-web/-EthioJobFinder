import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  MapPin, 
  Briefcase,
  LayoutDashboard,
  User,
  Bookmark,
  FileText,
  Bell,
  MessageSquare,
  BarChart2,
  Shield,
  LogOut,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated, isEmployer, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const getRoleBadge = () => {
    if (isAdmin) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">Admin</span>;
    }
    if (isEmployer) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">Employer</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">Job Seeker</span>;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          
          {/* Left Side: Brand Logo & Primary Discovery Links */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-extrabold text-orange-500 leading-tight">Ethio</span>
                <span className="text-sm sm:text-lg font-extrabold text-gray-900 dark:text-white leading-tight">JobFinder</span>
              </div>
            </Link>
            
            {/* Desktop Primary Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
              <Link 
                to="/jobs" 
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
              >
                Explore Jobs
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
              >
                Pricing
              </Link>
              
              {/* Resources Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 transition"
                  aria-expanded={resourcesOpen}
                >
                  Resources <ChevronDown className={`w-3.5 h-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 border border-gray-100 dark:border-gray-700 z-50">
                    <Link 
                      to="/jobs" 
                      onClick={() => setResourcesOpen(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Find Work
                    </Link>
                    <Link 
                      to="/pricing" 
                      onClick={() => setResourcesOpen(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Pricing Plans
                    </Link>
                    <Link 
                      to="/blog" 
                      onClick={() => setResourcesOpen(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Career Blog
                    </Link>
                    <Link 
                      to="/help" 
                      onClick={() => setResourcesOpen(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Help Center
                    </Link>
                  </div>
                )}
              </div>

              <a 
                href="https://t.me/ethiojobfinder" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 transition text-xs"
              >
                Community <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Side: Quick Action CTAs, Theme, Notifications & User Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick shortcuts on larger screens */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
                {isEmployer && (
                  <Link 
                    to="/post-job" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Job</span>
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link 
                  to="/applications" 
                  className="px-2.5 py-1.5 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 text-xs font-semibold transition"
                >
                  Applications
                </Link>
                <Link 
                  to="/saved-jobs" 
                  className="px-2.5 py-1.5 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 text-xs font-semibold transition"
                >
                  Saved Jobs
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
            </button>

            {/* Notification Center */}
            {isAuthenticated && <NotificationBell />}

            {/* Profile Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0 shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden xl:inline text-xs font-semibold truncate max-w-[100px]">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/80">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        {getRoleBadge()}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Section 1: Core Navigation */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <User className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                        <span>My Profile</span>
                      </Link>
                    </div>

                    {/* Section 2: Seeker Hub */}
                    <div className="py-1 border-t border-gray-100 dark:border-gray-700/80">
                      <Link
                        to="/applications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>My Applications</span>
                      </Link>
                      <Link
                        to="/saved-jobs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <Bookmark className="w-4 h-4 text-amber-500" />
                        <span>Saved Vacancies</span>
                      </Link>
                      <Link
                        to="/resume-builder"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Resume Builder</span>
                      </Link>
                      <Link
                        to="/job-alerts"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <Bell className="w-4 h-4 text-indigo-500" />
                        <span>Job Alerts</span>
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Messages</span>
                      </Link>
                      <Link
                        to="/analytics"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition"
                      >
                        <BarChart2 className="w-4 h-4 text-rose-500" />
                        <span>Analytics</span>
                      </Link>
                    </div>

                    {/* Section 3: Employer & Admin Actions */}
                    {(isEmployer || isAdmin) && (
                      <div className="py-1 border-t border-gray-100 dark:border-gray-700/80">
                        {isEmployer && (
                          <Link
                            to="/post-job"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Post a New Vacancy</span>
                          </Link>
                        )}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Command Center</span>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Section 4: Logout */}
                    <div className="pt-1 border-t border-gray-100 dark:border-gray-700/80">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-3.5 py-1.5 border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white rounded-lg font-semibold text-xs sm:text-sm transition shadow-sm"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-3.5 py-1.5 bg-orange-500 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-orange-600 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button 
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700 py-4 bg-white dark:bg-gray-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* User Profile Summary (Mobile) */}
            {isAuthenticated ? (
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/80 px-2">
                <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user?.email}</p>
                    </div>
                  </div>
                  {getRoleBadge()}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-4 px-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold text-white transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1 px-1">
              <Link 
                to="/jobs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
              >
                <Briefcase className="w-4 h-4 text-orange-500" />
                <span>Explore Jobs</span>
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
              >
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Pricing Plans</span>
              </Link>

              {isAuthenticated && (
                <>
                  <div className="pt-3 pb-1 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    My Account
                  </div>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <User className="w-4 h-4 text-orange-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/applications" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Applications</span>
                  </Link>
                  <Link 
                    to="/saved-jobs" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>Saved Vacancies</span>
                  </Link>

                  <div className="pt-3 pb-1 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Candidate Tools
                  </div>
                  <Link 
                    to="/resume-builder" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Resume Builder</span>
                  </Link>
                  <Link 
                    to="/job-alerts" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span>Job Alerts</span>
                  </Link>
                  <Link 
                    to="/messages" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span>Messages</span>
                  </Link>
                  <Link 
                    to="/analytics" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-lg"
                  >
                    <BarChart2 className="w-4 h-4 text-rose-500" />
                    <span>Analytics</span>
                  </Link>

                  {/* Employer / Admin Mobile Direct Links */}
                  {isEmployer && (
                    <Link 
                      to="/post-job"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post a Vacancy</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Command Center</span>
                    </Link>
                  )}
                </>
              )}

              <div className="pt-3 pb-1 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Support & Community
              </div>
              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300"
              >
                Career Blog
              </Link>
              <Link 
                to="/help" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300"
              >
                Help Center
              </Link>
              <a 
                href="https://t.me/ethiojobfinder" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300"
              >
                <span>Telegram Community</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {isAuthenticated && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/80 px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
