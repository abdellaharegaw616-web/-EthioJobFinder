import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';
import { MapPin, Globe, Mail, Phone, Building, Users, Star } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
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
            <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-20 h-20 object-contain" />
              ) : (
                <span className="text-3xl font-bold text-green-700">
                  {company.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {company.location || 'Location not specified'}
                </span>
                
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <Building className="w-5 h-5" />
                    {company.industry}
                  </span>
                )}
                
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-700 hover:underline"
                  >
                    <Globe className="w-5 h-5" />
                    Website
                  </a>
                )}
              </div>

              <p className="mt-4 text-gray-600 max-w-2xl">
                {company.description}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {jobs.length} Active {jobs.length === 1 ? 'Job' : 'Jobs'}
                </span>
                {company.employees && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.employees} Employees
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {company.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {company.email}
                    </span>
                  )}
                  {company.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {company.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Company Reviews</h3>
                  {company.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-gray-500 text-sm">({company.reviewsCount || 0} reviews)</span>
                    </div>
                  )}
                </div>
                {company.reviews && company.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {company.reviews.slice(0, 3).map((review, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">- {review.author}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No reviews yet</p>
                )}
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
