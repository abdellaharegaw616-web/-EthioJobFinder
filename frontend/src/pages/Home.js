import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useSavedJobs } from '../contexts/SavedJobsContext';
import { useApplications } from '../contexts/ApplicationsContext';
import JobCard from '../components/JobCard';
import jobService from '../services/jobService';
import { 
  Code, 
  Briefcase, 
  Building2, 
  Megaphone, 
  DollarSign, 
  Heart, 
  GraduationCap, 
  Utensils, 
  Sparkles, 
  Search, 
  MapPin, 
  Filter, 
  X, 
  RotateCcw, 
  ArrowUpDown, 
  AlertCircle
} from 'lucide-react';

const ETHIOPIAN_LOCATIONS = [
  'Addis Ababa',
  'Hawassa',
  'Adama (Nazret)',
  'Bahir Dar',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Jimma',
  'Bishoftu',
  'Dessie'
];

const CATEGORIES = [
  { id: 'IT & Software', name: 'IT & Software', icon: Code },
  { id: 'Engineering', name: 'Engineering', icon: Briefcase },
  { id: 'Business', name: 'Business', icon: Building2 },
  { id: 'Marketing', name: 'Marketing', icon: Megaphone },
  { id: 'Sales', name: 'Sales', icon: DollarSign },
  { id: 'Finance', name: 'Finance', icon: DollarSign },
  { id: 'Healthcare', name: 'Healthcare', icon: Heart },
  { id: 'Education', name: 'Education', icon: GraduationCap },
  { id: 'Hospitality', name: 'Hospitality', icon: Utensils }
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, loading, error, pagination, fetchJobs } = useJobs();
  const { savedJobs } = useSavedJobs();
  const { applications } = useApplications();

  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    workArrangement: searchParams.get('workArrangement') || '',
    location: searchParams.get('location') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    educationRequired: searchParams.get('educationRequired') || '',
    minSalary: searchParams.get('minSalary') || '',
    maxSalary: searchParams.get('maxSalary') || '',
    postedDate: searchParams.get('postedDate') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    includeExpired: searchParams.get('includeExpired') === 'true',
    page: parseInt(searchParams.get('page') || '1', 10)
  }));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTabMode, setActiveTabMode] = useState('all');
  const [loadingRecs, setLoadingRecs] = useState(false);

  const searchParamString = searchParams.toString();

  // Load personalized job recommendations if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const loadRecs = async () => {
        try {
          setLoadingRecs(true);
          const res = await jobService.getRecommendations();
          setRecommendations(res.data || []);
        } catch (err) {
          console.warn('Personalized recommendations not available (guest/network):', err.message);
        } finally {
          setLoadingRecs(false);
        }
      };
      loadRecs();
    }
  }, []);

  // Execute job search whenever URL query params change
  useEffect(() => {
    fetchJobs({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      type: searchParams.get('type') || undefined,
      workArrangement: searchParams.get('workArrangement') || undefined,
      location: searchParams.get('location') || undefined,
      experienceLevel: searchParams.get('experienceLevel') || undefined,
      educationRequired: searchParams.get('educationRequired') || undefined,
      minSalary: searchParams.get('minSalary') || undefined,
      maxSalary: searchParams.get('maxSalary') || undefined,
      postedDate: searchParams.get('postedDate') || undefined,
      sortBy: searchParams.get('sortBy') || 'newest',
      includeExpired: searchParams.get('includeExpired') || 'false',
      page: searchParams.get('page') || 1
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchJobs, searchParamString]);

  // Push filter state into URL search params
  const applyFiltersToUrl = useCallback((newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== false) {
        if (key === 'page' && val === 1) return; // omit default page 1
        if (key === 'sortBy' && val === 'newest') return; // omit default sort
        params.set(key, String(val));
      }
    });
    setSearchParams(params);
  }, [setSearchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const updated = { ...filters, page: 1 };
    setFilters(updated);
    applyFiltersToUrl(updated);
  };

  const handleCategoryClick = (catId) => {
    const updated = { ...filters, category: filters.category === catId ? '' : catId, page: 1 };
    setFilters(updated);
    applyFiltersToUrl(updated);
  };

  const handleLocationPreset = (loc) => {
    const updated = { ...filters, location: filters.location === loc ? '' : loc, page: 1 };
    setFilters(updated);
    applyFiltersToUrl(updated);
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    const updated = { ...filters, sortBy, page: 1 };
    setFilters(updated);
    applyFiltersToUrl(updated);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    applyFiltersToUrl(updated);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    const reset = {
      search: '',
      category: '',
      type: '',
      workArrangement: '',
      location: '',
      experienceLevel: '',
      educationRequired: '',
      minSalary: '',
      maxSalary: '',
      postedDate: '',
      sortBy: 'newest',
      includeExpired: false,
      page: 1
    };
    setFilters(reset);
    applyFiltersToUrl(reset);
  };

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.type,
    filters.workArrangement,
    filters.location,
    filters.experienceLevel,
    filters.educationRequired,
    filters.minSalary,
    filters.maxSalary,
    filters.postedDate,
    filters.includeExpired
  ].filter(Boolean).length;

  // Personalized recommendations heuristic based on seeker actions
  const recommendedJobs = useMemo(() => {
    if (savedJobs.length === 0 && applications.length === 0) return [];

    const userCategories = new Set();
    const userLocations = new Set();

    savedJobs.forEach(job => {
      if (job.category) userCategories.add(job.category);
      if (job.location) userLocations.add(job.location);
    });

    applications.forEach(app => {
      if (app.category) userCategories.add(app.category);
      if (app.location) userLocations.add(app.location);
    });

    return jobs.filter(job => {
      const isSaved = savedJobs.some(sj => sj.jobId === job._id || sj._id === job._id);
      const isApplied = applications.some(app => app.jobId === job._id || app._id === job._id);
      if (isSaved || isApplied) return false;
      return userCategories.has(job.category) || userLocations.has(job.location);
    }).slice(0, 3);
  }, [jobs, savedJobs, applications]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white py-14 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-orange-950/40 text-orange-100 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Ethiopia's Leading Job Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Discover Your Next Career in Ethiopia
          </h1>
          <p className="text-base sm:text-lg text-orange-50 max-w-2xl mx-auto mb-8 font-light">
            Verified jobs across Addis Ababa, regional hubs, and remote positions tailored for your skills.
          </p>
          
          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 border border-gray-100 dark:border-gray-700">
            <div className="flex-1 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl">
              <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                name="search"
                placeholder="Job title, keywords, skills, or employer"
                className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                value={filters.search}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex-1 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                name="location"
                placeholder="City or region (e.g. Addis Ababa)"
                className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                value={filters.location}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Vacancies
            </button>
          </form>

          {/* Quick Ethiopian City Filters */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-orange-100 mr-1 font-medium">Popular Cities:</span>
              {ETHIOPIAN_LOCATIONS.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleLocationPreset(city)}
                  className={`px-3 py-1 rounded-full font-medium transition ${
                    filters.location === city 
                      ? 'bg-white text-orange-600 font-bold shadow-sm' 
                      : 'bg-orange-950/40 text-orange-100 hover:bg-orange-600/60'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Horizontal Category Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Browse by Industry Sector
            </h2>
            {filters.category && (
              <button 
                onClick={() => handleCategoryClick('')} 
                className="text-xs text-orange-500 dark:text-orange-400 font-medium hover:underline flex items-center gap-1"
              >
                Clear category ({filters.category}) <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border ${
                filters.category === ''
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Personalized Recommendations Section */}
        {recommendedJobs.length > 0 && (
          <div className="mb-10 p-6 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recommended For You
              </h2>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                (Based on your profile preferences)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Layout: Sidebar Filters + Job Listings */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Filter Vacancies</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={(e) => {
                      handleInputChange(e);
                      applyFiltersToUrl({ ...filters, type: e.target.value, page: 1 });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="">All Employment Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship / Fresh Grad</option>
                    <option value="remote">Remote Position</option>
                  </select>
                </div>

                {/* Work Arrangement */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Work Arrangement
                  </label>
                  <select
                    name="workArrangement"
                    value={filters.workArrangement}
                    onChange={(e) => {
                      handleInputChange(e);
                      applyFiltersToUrl({ ...filters, workArrangement: e.target.value, page: 1 });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="">All Arrangements</option>
                    <option value="on-site">On-site (In Person)</option>
                    <option value="remote">Fully Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={(e) => {
                      handleInputChange(e);
                      applyFiltersToUrl({ ...filters, experienceLevel: e.target.value, page: 1 });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="">Any Experience</option>
                    <option value="entry">Entry Level / Fresh Graduate (0-2 yrs)</option>
                    <option value="mid">Mid Level (2-5 yrs)</option>
                    <option value="senior">Senior Level (5+ yrs)</option>
                    <option value="executive">Executive / Director</option>
                  </select>
                </div>

                {/* Toggle Advanced Filters Button */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full py-1 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline flex items-center justify-between"
                >
                  <span>{showAdvancedFilters ? 'Hide' : 'Show'} Salary & Advanced Filters</span>
                  <span>{showAdvancedFilters ? '▲' : '▼'}</span>
                </button>

                {/* Advanced Filter Fields */}
                {showAdvancedFilters && (
                  <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {/* Education */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                        Education Required
                      </label>
                      <select
                        name="educationRequired"
                        value={filters.educationRequired}
                        onChange={(e) => {
                          handleInputChange(e);
                          applyFiltersToUrl({ ...filters, educationRequired: e.target.value, page: 1 });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm"
                      >
                        <option value="">Any Education</option>
                        <option value="High School">High School</option>
                        <option value="Diploma">Diploma / TVET</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree or higher</option>
                      </select>
                    </div>

                    {/* Salary Range (ETB) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                        Salary Range (ETB)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="minSalary"
                          placeholder="Min"
                          value={filters.minSalary}
                          onChange={handleInputChange}
                          className="w-1/2 px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-xs"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          name="maxSalary"
                          placeholder="Max"
                          value={filters.maxSalary}
                          onChange={handleInputChange}
                          className="w-1/2 px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => applyFiltersToUrl({ ...filters, page: 1 })}
                        className="mt-2 w-full py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium"
                      >
                        Apply Salary Filter
                      </button>
                    </div>

                    {/* Date Posted */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                        Date Posted
                      </label>
                      <select
                        name="postedDate"
                        value={filters.postedDate}
                        onChange={(e) => {
                          handleInputChange(e);
                          applyFiltersToUrl({ ...filters, postedDate: e.target.value, page: 1 });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm"
                      >
                        <option value="">Any Time</option>
                        <option value="24h">Past 24 Hours</option>
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                      </select>
                    </div>

                    {/* Include Expired Jobs Toggle */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-300">
                        <input
                          type="checkbox"
                          name="includeExpired"
                          checked={filters.includeExpired}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFilters(prev => ({ ...prev, includeExpired: checked }));
                            applyFiltersToUrl({ ...filters, includeExpired: checked, page: 1 });
                          }}
                          className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                        />
                        <span>Include closed / expired jobs</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Job Listings Column */}
          <main className="flex-1">
            {/* Header: Result Counts & Sorting Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTabMode === 'all'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  All Vacancies ({pagination.total})
                </button>
                {recommendations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTabMode('recommended')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTabMode === 'recommended'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Matches For You ({recommendations.length})
                  </button>
                )}
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
                <label htmlFor="sortBySelect" className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  id="sortBySelect"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="closingSoon">Closing Date (Deadline)</option>
                  <option value="salaryHigh">Salary: High to Low</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
                <button
                  onClick={() => fetchJobs(filters)}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Recommendations or General Search Results */}
            {activeTabMode === 'recommended' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 flex items-center justify-between text-xs text-orange-900 dark:text-orange-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Ranked by AI compatibility with your profile skills, location, and professional headline.</span>
                  </div>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {recommendations.length} {recommendations.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                {loadingRecs ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700/60 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-gray-100 dark:bg-gray-700/40 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                    <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      No Recommended Matches Yet
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                      Add your skills, target city, and headline in your profile to activate personalized recommendations.
                    </p>
                    <a
                      href="/profile"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition"
                    >
                      Complete Your Profile
                    </a>
                  </div>
                ) : (
                  recommendations.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))
                )}
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700/60 rounded w-1/4 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                    </div>
                    <div className="h-12 bg-gray-100 dark:bg-gray-700/40 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              /* Empty Result State */
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No Job Vacancies Found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any positions matching your selected criteria. Try removing some filters or searching for alternative keywords.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => handleLocationPreset('Addis Ababa')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    View Addis Ababa Jobs
                  </button>
                </div>
              </div>
            ) : (
              /* Job Cards List */
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                      pagination.currentPage === pageNum
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
