import { useState, useEffect } from 'react';
import { useJobs } from '../contexts/JobContext';
import JobCard from '../components/JobCard';
import { Code, Briefcase, Building2, Megaphone, DollarSign, Heart, GraduationCap, Utensils } from 'lucide-react';

const Home = () => {
  const { jobs, loading, error, pagination, fetchJobs } = useJobs();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    location: '',
    experienceLevel: '',
    minSalary: '',
    maxSalary: '',
    postedDate: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ ...filters, page: 1 });
  };

  const handlePageChange = (page) => {
    fetchJobs({ ...filters, page });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job in Ethiopia</h1>
          <p className="text-xl mb-8">Connect with top employers and opportunities</p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              name="search"
              placeholder="Job title, keywords, or company"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="location"
              placeholder="City or location"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              value={filters.location}
              onChange={handleFilterChange}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100"
            >
              Search Jobs
            </button>
          </form>

          {/* Quick Category Filter */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm mb-3 text-green-100">Browse by category:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  setFilters({ ...filters, category: '' });
                  fetchJobs({ ...filters, category: '', page: 1 });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filters.category === '' 
                    ? 'bg-white text-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilters({ ...filters, category: cat.id });
                      fetchJobs({ ...filters, category: cat.id, page: 1 });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                      filters.category === cat.id 
                        ? 'bg-white text-green-700' 
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Categories</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full text-green-700 text-sm hover:underline flex items-center justify-center gap-2"
                >
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  <svg className={`w-4 h-4 transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvancedFilters && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                      <select
                        name="experienceLevel"
                        value={filters.experienceLevel}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Any Experience</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (2-5 years)</option>
                        <option value="senior">Senior Level (5+ years)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posted Within</label>
                      <select
                        name="postedDate"
                        value={filters.postedDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Any Time</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (ETB)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="minSalary"
                          placeholder="Min"
                          value={filters.minSalary}
                          onChange={handleFilterChange}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="number"
                          name="maxSalary"
                          placeholder="Max"
                          value={filters.maxSalary}
                          onChange={handleFilterChange}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setFilters({
                        search: '',
                        category: '',
                        type: '',
                        location: '',
                        experienceLevel: '',
                        minSalary: '',
                        maxSalary: '',
                        postedDate: ''
                      });
                      fetchJobs({ page: 1 });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Found {pagination.total} jobs
                </div>

                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                      <p className="text-gray-600">No jobs found matching your criteria.</p>
                    </div>
                  ) : (
                    jobs.map(job => <JobCard key={job._id} job={job} />)
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded ${
                          pagination.currentPage === i + 1
                            ? 'bg-green-700 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
