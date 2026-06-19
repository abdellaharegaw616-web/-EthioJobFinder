import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';
import { useReviews } from '../contexts/ReviewsContext';
import { MapPin, Globe, Mail, Phone, Building, Users, Star, Plus, Trash2 } from 'lucide-react';

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addReview, getCompanyReviews, getCompanyRating, getReviewCount, deleteReview } = useReviews();

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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.comment.trim()) {
      addReview({
        companyId: companyId,
        rating: newReview.rating,
        comment: newReview.comment,
        reviewerName: 'Anonymous User'
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  const companyReviews = getCompanyReviews(companyId);
  const avgRating = getCompanyRating(companyId);
  const reviewCount = getReviewCount(companyId);

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
                  <div className="flex items-center gap-3">
                    {reviewCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{avgRating}</span>
                        <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-800 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Review
                    </button>
                  </div>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={`text-2xl ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                          placeholder="Share your experience with this company..."
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                        >
                          Submit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {companyReviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this company!</p>
                ) : (
                  <div className="space-y-3">
                    {companyReviews.map(review => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.reviewerName}</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
