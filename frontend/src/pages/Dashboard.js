import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';

const Dashboard = () => {
  const { 
    myJobs, 
    applications, 
    receivedApplications,
    fetchMyJobs, 
    fetchMyApplications,
    fetchReceivedApplications,
    updateApplicationStatus,
    deleteJob,
    loading 
  } = useJobs();
  const { isJobSeeker, isEmployer } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isEmployer) {
      fetchMyJobs();
      fetchReceivedApplications();
    } else if (isJobSeeker) {
      fetchMyApplications();
    }
  }, [isEmployer, isJobSeeker, fetchMyJobs, fetchReceivedApplications, fetchMyApplications]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(jobId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewing': 'bg-blue-100 text-blue-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'hired': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {isEmployer && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-gray-500 text-sm mb-1">Active Jobs</div>
                <div className="text-3xl font-bold text-blue-600">{myJobs.filter(j => j.status === 'active').length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-gray-500 text-sm mb-1">Total Applications</div>
                <div className="text-3xl font-bold text-green-600">{receivedApplications.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-gray-500 text-sm mb-1">New Applications</div>
                <div className="text-3xl font-bold text-purple-600">
                  {receivedApplications.filter(a => !a.viewedByEmployer).length}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-6 py-4 font-medium ${activeTab === 'jobs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  >
                    My Jobs ({myJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-6 py-4 font-medium ${activeTab === 'applications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  >
                    Applications ({receivedApplications.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : activeTab === 'jobs' ? (
                  myJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
                      <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Post Your First Job
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myJobs.map(job => (
                        <JobCard key={job._id} job={job} onDelete={handleDeleteJob} />
                      ))}
                    </div>
                  )
                ) : (
                  receivedApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      No applications received yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedApplications.map(app => (
                        <div key={app._id} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">
                                <Link to={`/jobs/${app.job._id}`} className="text-blue-600 hover:underline">
                                  {app.job.title}
                                </Link>
                              </h4>
                              <p className="text-gray-600">{app.applicant.name}</p>
                              <p className="text-sm text-gray-500">{app.applicant.email}</p>
                              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                {!app.viewedByEmployer && (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">New</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <select
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(app.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                              </select>
                              <a
                                href={app.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-600 hover:underline text-sm"
                              >
                                View Resume
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {isJobSeeker && (
          <>
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">My Applications</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
                    <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app._id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">
                              <Link to={`/jobs/${app.job._id}`} className="text-blue-600 hover:underline">
                                {app.job.title}
                              </Link>
                            </h4>
                            <p className="text-gray-600">{app.job.company}</p>
                            <p className="text-sm text-gray-500">{app.job.location}</p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                              <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                              {app.viewedByEmployer && (
                                <span className="text-green-600">✓ Viewed by employer</span>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
