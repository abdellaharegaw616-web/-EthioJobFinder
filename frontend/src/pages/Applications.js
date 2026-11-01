import { useState } from 'react';
import { useApplications } from '../contexts/ApplicationsContext';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar, 
  Briefcase, 
  Building2, 
  MapPin, 
  Trash2, 
  ExternalLink
} from 'lucide-react';

const Applications = () => {
  const { applications, loading, withdrawApplication } = useApplications();
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      interview_scheduled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      hired: 'bg-orange-500 text-white',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-3.5 h-3.5" />,
      applied: <Clock className="w-3.5 h-3.5" />,
      reviewing: <Clock className="w-3.5 h-3.5" />,
      under_review: <Clock className="w-3.5 h-3.5" />,
      shortlisted: <CheckCircle className="w-3.5 h-3.5" />,
      interview_scheduled: <Calendar className="w-3.5 h-3.5" />,
      hired: <CheckCircle className="w-3.5 h-3.5" />,
      rejected: <XCircle className="w-3.5 h-3.5" />
    };
    return icons[status] || <Clock className="w-3.5 h-3.5" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Under Review',
      applied: 'Application Submitted',
      reviewing: 'In Review',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted',
      interview_scheduled: 'Interview Scheduled',
      hired: 'Hired / Offer Extended',
      rejected: 'Not Selected'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleWithdraw = async (appId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setWithdrawingId(appId);
      await withdrawApplication(appId);
      setFeedback('Application withdrawn successfully.');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback('Failed to withdraw application: ' + (err.response?.data?.message || err.message));
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              My Job Applications
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Track submission statuses, interview schedules, and response updates from Ethiopian employers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback('')} className="text-xs font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm max-w-2xl mx-auto">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No Applications Submitted Yet
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              When you apply to jobs on EthioJob Finder, you can track the status, review history, and manage your submissions here.
            </p>
            <Link 
              to="/jobs" 
              className="inline-flex px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition text-sm shadow-md"
            >
              Discover & Apply for Vacancies
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Job Title</th>
                    <th className="px-6 py-4 font-semibold">Company</th>
                    <th className="px-6 py-4 font-semibold">Submission Date</th>
                    <th className="px-6 py-4 font-semibold">Current Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-sm">
                  {applications.map((app) => {
                    const jobId = app.job?._id || app.jobId || (typeof app.job === 'string' ? app.job : null);
                    const jobTitle = app.job?.title || app.jobTitle || 'Position Vacancy';
                    const company = app.job?.company || app.company || 'Employer';
                    const location = app.job?.location || app.location || 'Ethiopia';
                    const appliedDate = app.createdAt || app.appliedDate;

                    return (
                      <tr key={app._id || jobId} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {jobId ? (
                              <Link to={`/jobs/${jobId}`} className="hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1.5 group">
                                <span>{jobTitle}</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-gray-400" />
                              </Link>
                            ) : (
                              <span>{jobTitle}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span>{company}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                          {formatDate(appliedDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span>{getStatusLabel(app.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {jobId && (
                              <Link
                                to={`/jobs/${jobId}`}
                                className="text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline"
                              >
                                View Job
                              </Link>
                            )}
                            <button
                              onClick={() => handleWithdraw(app._id, jobTitle)}
                              disabled={withdrawingId === app._id}
                              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                              title="Withdraw Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Applications;
