import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        // Get employer's jobs
        const response = await jobService.getJobs({ postedBy: companyId });
        setJobs(response.jobs || []);
        
        // Extract company info from first job
        if (response.jobs && response.jobs.length > 0) {
          const firstJob = response.jobs[0];
          setCompany({
            name: firstJob.company || firstJob.postedBy?.companyName,
            description: firstJob.postedBy?.companyDescription || 'No description available',
            website: firstJob.postedBy?.companyWebsite,
            location: firstJob.location,
            logo: firstJob.postedBy?.companyLogo
          });
        }
      } catch (err) {
        setError('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Company not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-20 h-20 object-contain" />
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  {company.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location || 'Location not specified'}
                </span>
                
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
              </div>

              <p className="mt-4 text-gray-600 max-w-2xl">
                {company.description}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {jobs.length} Active {jobs.length === 1 ? 'Job' : 'Jobs'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No open positions at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
