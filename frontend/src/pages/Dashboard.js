import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Plus, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Save, 
  Loader2, 
  Filter
} from 'lucide-react';

const Dashboard = () => {
  const { 
    myJobs, 
    applications, 
    receivedApplications,
    fetchMyJobs, 
    fetchMyApplications,
    fetchReceivedApplications,
    updateApplicationStatus,
    updateJobStatus,
    deleteJob,
    loading 
  } = useJobs();

  const { isJobSeeker, isEmployer, user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'applications', 'company'
  const [jobStatusFilter, setJobStatusFilter] = useState('all'); // 'all', 'active', 'draft', 'closed'
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('all');
  const [expandedNotesId, setExpandedNotesId] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Company Profile State
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companyCity: '',
    companyIndustry: '',
    companySize: '1-10'
  });
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyMessage, setCompanyMessage] = useState('');
  const [companyError, setCompanyError] = useState('');

  // Verification Request State
  const [tinNumber, setTinNumber] = useState('');
  const [verificationDocUrl, setVerificationDocUrl] = useState('');
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState('');

  useEffect(() => {
    if (isEmployer) {
      fetchMyJobs();
      fetchReceivedApplications();
    } else if (isJobSeeker) {
      fetchMyApplications();
    }
  }, [isEmployer, isJobSeeker, fetchMyJobs, fetchReceivedApplications, fetchMyApplications]);

  useEffect(() => {
    if (user) {
      setCompanyData({
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        companyWebsite: user.companyWebsite || '',
        companyCity: user.companyCity || user.location || '',
        companyIndustry: user.companyIndustry || '',
        companySize: user.companySize || '1-10'
      });
    }
  }, [user]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (jobStatusFilter === 'all') return myJobs;
    return myJobs.filter(j => j.status === jobStatusFilter);
  }, [myJobs, jobStatusFilter]);

  // Filtered applicants
  const filteredApplications = useMemo(() => {
    return receivedApplications.filter(app => {
      const matchJob = selectedJobId === 'all' || (app.job?._id || app.job) === selectedJobId;
      const matchStatus = applicantStatusFilter === 'all' || app.status === applicantStatusFilter;
      return matchJob && matchStatus;
    });
  }, [receivedApplications, selectedJobId, applicantStatusFilter]);

  // Status badge colors
  const getStatusBadge = (status) => {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      under_review: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      interview_scheduled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      hired: 'bg-orange-500 text-white',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      withdrawn: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return config[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this vacancy? All associated applicant submissions will remain in your records.')) {
      try {
        await deleteJob(jobId);
      } catch (err) {
        alert(err.message || 'Failed to delete job');
      }
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
    } catch (err) {
      alert(err.message || 'Failed to update job status');
    }
  };

  const handleApplicationStatusUpdate = async (appId, newStatus) => {
    try {
      const currentNote = noteInputs[appId] || '';
      await updateApplicationStatus(appId, newStatus, currentNote);
    } catch (err) {
      alert(err.message || 'Failed to update application status');
    }
  };

  const handleSaveNote = async (appId) => {
    setSavingNoteId(appId);
    try {
      const app = receivedApplications.find(a => a._id === appId);
      const note = noteInputs[appId] !== undefined ? noteInputs[appId] : app?.notes || '';
      await updateApplicationStatus(appId, app?.status || 'reviewing', note);
      setExpandedNotesId(null);
    } catch (err) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyMessage('');
    setCompanyError('');
    try {
      await updateProfile(companyData);
      setCompanyMessage('Company profile saved successfully!');
    } catch (err) {
      setCompanyError(err.response?.data?.message || err.message || 'Failed to save company profile');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleVerificationRequest = async (e) => {
    e.preventDefault();
    setSubmittingVerification(true);
    setVerificationFeedback('');
    try {
      const res = await authService.requestVerification({
        tinNumber,
        businessRegistrationUrl: verificationDocUrl
      });
      setVerificationFeedback(res.message || 'Verification submitted!');
      setTinNumber('');
      setVerificationDocUrl('');
    } catch (err) {
      setVerificationFeedback(err.response?.data?.message || err.message || 'Failed to submit verification');
    } finally {
      setSubmittingVerification(false);
    }
  };

  // Metrics
  const activeCount = myJobs.filter(j => j.status === 'active').length;
  const totalAppsCount = receivedApplications.length;
  const unreviewedCount = receivedApplications.filter(a => !a.viewedByEmployer || a.status === 'pending').length;
  const totalViewsCount = myJobs.reduce((acc, j) => acc + (j.views || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Top Banner */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {isEmployer ? (user?.companyName ? `${user.companyName} Workspace` : 'Employer Command Center') : 'Candidate Dashboard'}
                </h1>
                {isEmployer && user?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Employer
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEmployer
                  ? 'Manage open vacancies, review incoming Ethiopian candidate applications, and track hiring progress.'
                  : 'Track the status of your submitted job applications and career bookmarks.'}
              </p>
            </div>

            {isEmployer && (
              <Link
                to="/post-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition shadow-sm hover:shadow shrink-0"
              >
                <Plus className="w-4 h-4" />
                Post New Vacancy
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEmployer && (
          <>
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Vacancies</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{activeCount}</div>
                <p className="text-xs text-gray-400 mt-1">{myJobs.length} total vacancies listed</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Applicants</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{totalAppsCount}</div>
                <p className="text-xs text-gray-400 mt-1">Across all published roles</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unreviewed</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{unreviewedCount}</div>
                <p className="text-xs text-gray-400 mt-1">Pending recruiter action</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Views</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{totalViewsCount}</div>
                <p className="text-xs text-gray-400 mt-1">Seeker candidate impressions</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === 'jobs'
                      ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Posted Vacancies ({myJobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === 'applications'
                      ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Applicant Pipeline ({receivedApplications.length})
                  {unreviewedCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === 'company'
                      ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Company Profile & Verification
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* TAB 1: Posted Vacancies */}
                {activeTab === 'jobs' && (
                  <div>
                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        {['all', 'active', 'draft', 'closed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setJobStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                              jobStatusFilter === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'vacancy' : 'vacancies'}
                      </span>
                    </div>

                    {loading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Loading vacancies...</p>
                      </div>
                    ) : filteredJobs.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">No vacancies found</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          {jobStatusFilter === 'all' 
                            ? 'Get started by publishing your first job vacancy.' 
                            : `You have no ${jobStatusFilter} vacancies.`}
                        </p>
                        <Link
                          to="/post-job"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Post Vacancy
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredJobs.map((job) => (
                          <div
                            key={job._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-gray-300 transition"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <Link
                                    to={`/jobs/${job._id}`}
                                    className="font-bold text-lg text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition"
                                  >
                                    {job.title}
                                  </Link>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                    job.status === 'active' 
                                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300' 
                                      : job.status === 'draft'
                                      ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                  }`}>
                                    {job.status}
                                  </span>
                                  {job.workArrangement && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 capitalize">
                                      {job.workArrangement}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{job.company}</span>
                                  <span>•</span>
                                  <span>{job.location}</span>
                                  <span>•</span>
                                  <span className="capitalize">{job.type?.replace('-', ' ')}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {job.views || 0} views
                                  </span>
                                  {job.deadline && (
                                    <>
                                      <span>•</span>
                                      <span className={new Date(job.deadline) < new Date() ? 'text-red-500 font-medium' : ''}>
                                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJobId(job._id);
                                    setActiveTab('applications');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-300 text-xs font-semibold hover:bg-orange-100 transition flex items-center gap-1.5"
                                >
                                  <Users className="w-3.5 h-3.5" />
                                  Applicants ({job.applicationsCount || 0})
                                </button>

                                <select
                                  value={job.status}
                                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                  className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200"
                                >
                                  <option value="active">Active</option>
                                  <option value="draft">Draft</option>
                                  <option value="closed">Closed</option>
                                </select>

                                <Link
                                  to={`/edit-job/${job._id}`}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-xs font-medium"
                                  title="Edit vacancy"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium"
                                  title="Delete vacancy"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Applicant Pipeline */}
                {activeTab === 'applications' && (
                  <div>
                    {/* Filter bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Role:</span>
                        </div>
                        <select
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-200 font-medium"
                        >
                          <option value="all">All Vacancies ({myJobs.length})</option>
                          {myJobs.map(j => (
                            <option key={j._id} value={j._id}>{j.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {['all', 'pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setApplicantStatusFilter(st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                              applicantStatusFilter === st
                                ? 'bg-orange-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">No applicants match this filter</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Candidates applying to your open vacancies will appear here in your review pipeline.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredApplications.map((app) => (
                          <div
                            key={app._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-gray-300 transition"
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-lg flex items-center justify-center shrink-0">
                                  {app.applicant?.name ? app.applicant.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                      {app.applicant?.name || 'Applicant'}
                                    </h4>
                                    {!app.viewedByEmployer && (
                                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                        NEW
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-400">
                                      applied for <strong className="text-gray-700 dark:text-gray-200">{app.job?.title}</strong>
                                    </span>
                                  </div>

                                  {app.applicant?.professionalHeadline && (
                                    <p className="text-xs font-medium text-orange-500 dark:text-orange-400 mb-1.5">
                                      {app.applicant.professionalHeadline}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    <span>{app.applicant?.email}</span>
                                    {app.applicant?.phone && <span>• {app.applicant.phone}</span>}
                                    {app.applicant?.location && <span>• {app.applicant.location}</span>}
                                    <span>• Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                  </div>

                                  {/* Candidate Skills */}
                                  {app.applicant?.skills && app.applicant.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                      {app.applicant.skills.slice(0, 6).map((sk, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                          {sk}
                                        </span>
                                      ))}
                                      {app.applicant.skills.length > 6 && (
                                        <span className="text-xs text-gray-400 self-center">+{app.applicant.skills.length - 6} more</span>
                                      )}
                                    </div>
                                  )}

                                  {/* Cover letter snippet */}
                                  {app.coverLetter && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 mb-3 italic line-clamp-2">
                                      "{app.coverLetter}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Action and Status Controls */}
                              <div className="flex flex-col items-end gap-3 shrink-0">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={app.status}
                                    onChange={(e) => handleApplicationStatusUpdate(app._id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-0 ${getStatusBadge(app.status)}`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="interview_scheduled">Interview Scheduled</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Not Selected</option>
                                  </select>

                                  {app.resume && (
                                    <a
                                      href={app.resume}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      CV / Resume
                                    </a>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setExpandedNotesId(expandedNotesId === app._id ? null : app._id)}
                                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  {app.notes ? 'Edit Internal Note' : 'Add Recruiter Note'}
                                </button>
                              </div>
                            </div>

                            {/* Internal Recruiter Notes Drawer */}
                            {expandedNotesId === app._id && (
                              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                  Internal Hiring Team Notes (Candidate cannot see this):
                                </label>
                                <textarea
                                  rows="2"
                                  placeholder="e.g. Completed initial screening call. Strong candidate, schedule technical interview..."
                                  value={noteInputs[app._id] !== undefined ? noteInputs[app._id] : app.notes || ''}
                                  onChange={(e) => setNoteInputs({ ...noteInputs, [app._id]: e.target.value })}
                                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedNotesId(null)}
                                    className="px-3 py-1 text-xs text-gray-500 hover:text-gray-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={savingNoteId === app._id}
                                    onClick={() => handleSaveNote(app._id)}
                                    className="px-4 py-1 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 disabled:opacity-50 inline-flex items-center gap-1"
                                  >
                                    {savingNoteId === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Save Note
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Company Profile & Verification */}
                {activeTab === 'company' && (
                  <div className="space-y-8 max-w-3xl">
                    {/* Verification Status Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/60 to-amber-50/60 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800/60">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                              Verified Employer Badge
                              {user?.isVerified ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">
                                  Verified
                                </span>
                              ) : user?.verificationStatus === 'pending' ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold">
                                  Pending Review
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 font-semibold">
                                  Unverified
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                              {user?.isVerified 
                                ? 'Your company is officially verified on EthioJob Finder. Your vacancies display the verified trust badge.'
                                : user?.verificationStatus === 'pending'
                                ? 'Your business verification request is currently under review by our operations team.'
                                : 'Submit your Ethiopian Business License or TIN to earn the Verified Employer trust badge.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {!user?.isVerified && user?.verificationStatus !== 'pending' && (
                        <form onSubmit={handleVerificationRequest} className="mt-6 pt-6 border-t border-orange-200 dark:border-orange-800/60 space-y-4">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Request Verified Badge</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Ethiopian Taxpayer Identification Number (TIN)</label>
                              <input
                                type="text"
                                placeholder="e.g. 0012345678"
                                value={tinNumber}
                                onChange={(e) => setTinNumber(e.target.value)}
                                required
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Business License Link (Cloud / Google Drive)</label>
                              <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={verificationDocUrl}
                                onChange={(e) => setVerificationDocUrl(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                          {verificationFeedback && (
                            <p className="text-xs font-semibold text-orange-500 dark:text-orange-400">{verificationFeedback}</p>
                          )}
                          <button
                            type="submit"
                            disabled={submittingVerification}
                            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 disabled:opacity-50"
                          >
                            {submittingVerification ? 'Submitting...' : 'Submit Verification Request'}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Company Details Form */}
                    <form onSubmit={handleCompanySubmit} className="space-y-6">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">Public Company Details</h3>

                      {companyMessage && (
                        <div className="p-4 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{companyMessage}</span>
                        </div>
                      )}
                      {companyError && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{companyError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Company Name</label>
                          <input
                            type="text"
                            value={companyData.companyName}
                            onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                            placeholder="e.g. Commercial Bank of Ethiopia"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Official Website</label>
                          <input
                            type="url"
                            value={companyData.companyWebsite}
                            onChange={(e) => setCompanyData({ ...companyData, companyWebsite: e.target.value })}
                            placeholder="https://company.et"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Headquarters City (Ethiopia)</label>
                          <input
                            type="text"
                            value={companyData.companyCity}
                            onChange={(e) => setCompanyData({ ...companyData, companyCity: e.target.value })}
                            placeholder="Addis Ababa, Hawassa, Adama..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Industry Sector</label>
                          <input
                            type="text"
                            value={companyData.companyIndustry}
                            onChange={(e) => setCompanyData({ ...companyData, companyIndustry: e.target.value })}
                            placeholder="Banking & Finance, Telecommunications, Tech..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Company Size (Employees)</label>
                          <select
                            value={companyData.companySize}
                            onChange={(e) => setCompanyData({ ...companyData, companySize: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="1-10">1 - 10 employees (Startup / Boutique)</option>
                            <option value="11-50">11 - 50 employees (Small Enterprise)</option>
                            <option value="51-200">51 - 200 employees (Mid-sized Business)</option>
                            <option value="201-500">201 - 500 employees (Large Corporate)</option>
                            <option value="500+">500+ employees (Enterprise / Public Entity)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1">Company Overview</label>
                        <textarea
                          rows="4"
                          value={companyData.companyDescription}
                          onChange={(e) => setCompanyData({ ...companyData, companyDescription: e.target.value })}
                          placeholder="Tell candidates about your company mission, culture, benefits, and vision..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={savingCompany}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
                        >
                          {savingCompany ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Company Profile
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Job Seeker View */}
        {isJobSeeker && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Submitted Applications</h2>
              <Link to="/jobs" className="text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline">
                Explore More Vacancies →
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">No applications submitted yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Discover thousands of open Ethiopian roles and apply with your profile.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition"
                >
                  Browse Vacancies
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">
                        <Link to={`/jobs/${app.job?._id || app.job}`} className="hover:text-orange-500 transition">
                          {app.job?.title || 'Job Position'}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {app.job?.company} • {app.job?.location} • Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(app.status)}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
