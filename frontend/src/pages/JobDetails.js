import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import ApplicationForm from '../components/ApplicationForm';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading, fetchJob, deleteJob } = useJobs();
  const { isAuthenticated, isJobSeeker, isEmployer, user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJob(id);
  }, [id, fetchJob]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const handleApplySuccess = () => {
    setApplySuccess(true);
    setShowApplyForm(false);
  };

  const formatSalary = () => {
    if (!job?.salary) return 'Not specified';
    if (job.salary.negotiable) return 'Negotiable';
    if (job.salary.min && job.salary.max) {
      return `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    }
    if (job.salary.min) return `From ${job.salary.min.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    return 'Not specified';
  };

  const isOwner = isEmployer && job?.postedBy?._id === user?._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">Job not found.</p>
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.type?.replace('-', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {job.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {job.experienceLevel}
                </span>
              </div>

              <div className="text-gray-500 dark:text-gray-400 text-sm space-y-1">
                <p>📍 {job.location}</p>
                <p>💰 {formatSalary()}</p>
                <p>👁 {job.views} views</p>
                <p>📄 {job.applicationsCount} applications</p>
                {job.deadline && (
                  <p>⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit-job/${job._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Job Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Benefits</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button or Form */}
            {isJobSeeker && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {applySuccess ? (
                  <div className="text-center">
                    <div className="text-green-600 text-5xl mb-4">✓</div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Application Submitted!</h3>
                    <p className="text-gray-600 dark:text-gray-300">Good luck with your application.</p>
                  </div>
                ) : showApplyForm ? (
                  <ApplicationForm
                    jobId={job._id}
                    onSuccess={handleApplySuccess}
                    onCancel={() => setShowApplyForm(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Apply for this Job
                  </button>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Sign in to apply for this job</p>
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">About the Company</h3>
              <p className="font-medium text-gray-900 dark:text-white">{job.postedBy?.companyName || job.company}</p>
              {job.postedBy?.companyDescription && (
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{job.postedBy.companyDescription}</p>
              )}
              {job.postedBy?.companyWebsite && (
                <a
                  href={job.postedBy.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
                >
                  Visit Website
                </a>
              )}
            </div>

            {/* Skills Required */}
            {job.skillsRequired?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
