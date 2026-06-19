import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Sun, Moon, MapPin, Briefcase } from 'lucide-react';
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

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-green-700 leading-tight">Ethio</span>
                <span className="text-sm sm:text-lg font-bold text-green-700 leading-tight">JobFinder</span>
              </div>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/jobs" className="text-gray-600 hover:text-gray-900 transition">
                Explore Jobs
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition">
                Pricing
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-1 transition"
                >
                  Resources <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 border dark:border-gray-600">
                    <Link to="/jobs" onClick={() => setResourcesOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Find Work</Link>
                    <Link to="/pricing" onClick={() => setResourcesOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Pricing</Link>
                    <Link to="/blog" onClick={() => setResourcesOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Blog</Link>
                    <Link to="/help" onClick={() => setResourcesOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Help Center</Link>
                  </div>
                )}
              </div>
              <a 
                href="https://t.me/ethiojobfinder"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1 transition"
              >
                Learn <span className="text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isAuthenticated ? (
                <>
                  {isEmployer && (
                    <Link 
                      to="/post-job" 
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                    >
                      Post Job
                    </Link>
                  )}
                  <Link 
                    to="/saved-jobs" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Saved Jobs
                  </Link>
                  <Link 
                    to="/applications" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Applications
                  </Link>
                  <Link 
                    to="/resume-builder" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Resume Builder
                  </Link>
                  <Link 
                    to="/job-alerts" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Job Alerts
                  </Link>
                  <Link 
                    to="/messages" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/analytics" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    Analytics
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition"
                    >
                      Admin
                    </Link>
                  )}
                  <NotificationBell />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 transition"
                    >
                      <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user?.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-xl shadow-lg py-2 border dark:border-gray-600 z-50">
                        <div className="px-4 py-2 border-b dark:border-gray-600">
                          <p className="font-medium text-sm dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Profile
                        </Link>
                        {isEmployer && (
                          <Link
                            to="/post-job"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            Post a Job
                          </Link>
                        )}
                        <div className="border-t dark:border-gray-600 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 sm:px-5 py-2 bg-green-700 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-green-800 transition whitespace-nowrap"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-green-700 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-green-800 transition whitespace-nowrap"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-600 py-4">
            <div className="space-y-3">
              {/* Theme Toggle Mobile */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <Link 
                to="/jobs" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Explore Jobs
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Pricing
              </Link>
              <Link 
                to="/jobs" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Find Work
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Blog
              </Link>
              <Link 
                to="/help" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Help Center
              </Link>
              <a 
                href="https://t.me/ethiojobfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Learn ↗
              </a>
              
              {!isAuthenticated ? (
                <div className="pt-4 border-t dark:border-gray-600 space-y-3">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 border-2 border-green-700 dark:border-green-600 rounded-lg font-medium text-green-700 dark:text-green-400 whitespace-nowrap"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 bg-green-700 text-white rounded-lg font-medium whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t dark:border-gray-600 space-y-2">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Profile
                  </Link>
                  {isEmployer && (
                    <Link 
                      to="/post-job"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Post a Job
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Logout
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
