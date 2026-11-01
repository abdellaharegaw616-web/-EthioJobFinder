import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import ApplicationForm from '../components/ApplicationForm';
import jobService from '../services/jobService';
import { 
  MapPin, 
  Banknote, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Briefcase, 
  GraduationCap, 
  Share2, 
  Check,
  ShieldAlert,
  Flag,
  X,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading, fetchJob, deleteJob } = useJobs();
  const { isAuthenticated, isJobSeeker, isEmployer, user } = useAuth();
  const { isJobApplied } = useApplications();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Safety Reporting State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('fee_scam_asking_for_money');
  const [reportDetails, setReportDetails] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    fetchJob(id);
  }, [id, fetchJob]);

  // Candidate Match compatibility calculation
  const candidateMatch = useMemo(() => {
    if (!isAuthenticated || !isJobSeeker || !user || !job) return null;

    const userSkills = (user.skills || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);
    const jobSkills = [
      ...(job.skillsRequired || []),
      ...(job.requirements || [])
    ].map(s => String(s).toLowerCase().trim()).filter(Boolean);

    const matched = [];
    userSkills.forEach(us => {
      if (jobSkills.some(js => js.includes(us) || us.includes(js))) {
        matched.push(us);
      }
    });

    const uniqueMatched = [...new Set(matched)];
    let score = 25;

    if (userSkills.length > 0 && jobSkills.length > 0) {
      const ratio = Math.min(1, uniqueMatched.length / Math.max(1, Math.min(jobSkills.length, 4)));
      score += Math.round(ratio * 45);
    } else {
      score += 20;
    }

    const userLoc = (user.location || '').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();
    const isRemote = job.workArrangement === 'remote' || job.type === 'remote' || jobLoc.includes('remote');
    if (isRemote || (userLoc && jobLoc && jobLoc.includes(userLoc))) {
      score += 20;
    }

    const finalScore = Math.min(99, Math.max(35, score));

    return {
      score: finalScore,
      matchedSkills: uniqueMatched,
      locationMatch: isRemote ? 'Remote Friendly' : (userLoc && jobLoc && jobLoc.includes(userLoc)) ? `Aligned with ${job.location}` : job.location
    };
  }, [isAuthenticated, isJobSeeker, user, job]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job vacancy?')) {
      try {
        await deleteJob(id);
        navigate('/jobs');
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const handleApplySuccess = () => {
    setApplySuccess(true);
    setShowApplyForm(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReporting(true);
    setReportError('');
    setReportSuccess('');
    try {
      const res = await jobService.reportJob(id, {
        reason: reportReason,
        details: reportDetails
      });
      setReportSuccess(res.message || 'Report submitted for review.');
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess('');
        setReportDetails('');
      }, 2000);
    } catch (err) {
      setReportError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  const formatSalary = () => {
    if (!job?.salary) return 'Not disclosed';
    if (job.salary.negotiable) return 'Negotiable';
    if (job.salary.min && job.salary.max) {
      return `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    }
    if (job.salary.min) return `From ${job.salary.min.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    return 'Not disclosed';
  };

  const isOwner = isEmployer && (job?.postedBy?._id === user?._id || job?.postedBy === user?._id);
  const isExpired = Boolean(job?.isExpired || (job?.deadline && new Date(job.deadline) < new Date()) || job?.status === 'closed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Job Vacancy Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">This listing may have been removed or the link is incorrect.</p>
            <Link to="/jobs" className="inline-flex px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/jobs" className="text-sm font-semibold text-orange-500 dark:text-orange-400 hover:underline inline-flex items-center gap-1">
            ← Back to Job Search
          </Link>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied!' : 'Share Job'}
          </button>
        </div>

        {/* Expiration Notice Banner */}
        {isExpired && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                Applications Closed
              </h4>
              <p className="text-amber-800 dark:text-amber-300 text-xs sm:text-sm mt-0.5">
                This vacancy has reached its deadline ({job.deadline ? new Date(job.deadline).toLocaleDateString() : 'closed'}) or is no longer accepting new submissions.
              </p>
            </div>
          </div>
        )}

        {/* Job Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {job.title}
                </h1>
                {isExpired && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    Expired
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300 mb-4">
                <Link to={`/company/${job.postedBy?._id || job.postedBy}`} className="font-semibold text-orange-500 dark:text-orange-400 hover:underline">
                  {job.postedBy?.companyName || job.company}
                </Link>
                {job.postedBy?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Employer
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300 capitalize">
                  {job.type?.replace('-', ' ')}
                </span>
                {job.workArrangement && (
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 capitalize">
                    {job.workArrangement}
                  </span>
                )}
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {job.category}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 capitalize">
                  {job.experienceLevel} level
                </span>
                {job.educationRequired && (
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {job.educationRequired}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white">{formatSalary()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                  <span>
                    Deadline: <strong>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open until filled'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                  <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex sm:flex-col gap-2 shrink-0 self-start">
                <Link
                  to={`/edit-job/${job._id}`}
                  className="px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition"
                >
                  Edit Job
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Delete Job
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                Job Description
              </h2>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Responsibilities</h2>
                <ul className="space-y-2.5 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 mt-2 shrink-0"></span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requirements & Qualifications</h2>
                <ul className="space-y-2.5 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 mt-2 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Benefits & Perks</h2>
                <ul className="space-y-2.5 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 mt-2 shrink-0"></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Application Status</h3>

              {isExpired ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1.5" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Applications Closed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This job is no longer accepting submissions.</p>
                </div>
              ) : (applySuccess || isJobApplied(job?._id)) ? (
                <div className="text-center py-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    {applySuccess ? 'Application Submitted!' : 'Already Applied'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {applySuccess 
                      ? `Your CV and application were received by ${job.company}. You will receive status updates in your dashboard.`
                      : `You have submitted an application for this vacancy at ${job.company}. Track progress in Applications.`}
                  </p>
                  <Link
                    to="/applications"
                    className="mt-3 inline-block text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    View My Applications →
                  </Link>
                </div>
              ) : showApplyForm ? (
                <ApplicationForm
                  jobId={job._id}
                  onSuccess={handleApplySuccess}
                  onCancel={() => setShowApplyForm(false)}
                />
              ) : isAuthenticated && isJobSeeker ? (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Submit your CV and cover letter directly to the employer.
                  </p>
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-sm"
                  >
                    Apply for this Position
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Sign in to your account or register to apply for this vacancy.
                  </p>
                  <Link
                    to="/login"
                    className="block w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition text-sm mb-2 shadow-sm"
                  >
                    Sign In to Apply
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs"
                  >
                    Create Free Account
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  You are logged in as an employer or admin. Switch to a job seeker account to apply.
                </p>
              )}
            </div>

            {/* Candidate Match Compatibility Card */}
            {candidateMatch && (
              <div className="bg-orange-50/60 dark:bg-orange-950/20 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Profile Compatibility
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-orange-500 text-white shadow-sm">
                    {candidateMatch.score}% Match
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Location Fit:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">{candidateMatch.locationMatch}</span>
                  </div>

                  {candidateMatch.matchedSkills.length > 0 && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1 font-medium">Matching Profile Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidateMatch.matchedSkills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-[11px] font-medium">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Employer Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">About the Employer</h3>
              <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                {job.postedBy?.companyName || job.company}
                {job.postedBy?.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Employer" />
                )}
              </p>
              {job.postedBy?.companyDescription && (
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-xs leading-relaxed">
                  {job.postedBy.companyDescription}
                </p>
              )}
              {job.postedBy?.companyWebsite && (
                <a
                  href={job.postedBy.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 dark:text-orange-400 hover:underline text-xs font-medium mt-3 inline-block"
                >
                  Visit Official Website ↗
                </a>
              )}
            </div>

            {/* Skills Required */}
            {job.skillsRequired?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Platform Safety & Fraud Warning Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                    Safe Apply & Fraud Notice
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed mb-3">
                    Never pay any money or fee for applications, interviews, test fees, or equipment. Legitimate Ethiopian employers never request advance fees.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 hover:text-red-700 dark:hover:text-red-400 transition underline"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Report Suspicious Vacancy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Vacancy Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Report Job Vacancy</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Help keep Ethiopian job seekers safe</p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center">
                <Check className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">{reportSuccess}</p>
                <p className="text-xs text-gray-500 mt-1">Our moderation team will review this listing shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                {reportError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 text-xs">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    What is the issue with this vacancy?
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="fee_scam_asking_for_money">Fee Scam / Employer asking for money or payment</option>
                    <option value="fraudulent_job_offer">Fraudulent / Fake company or vacancy</option>
                    <option value="misleading_information">Misleading salary, responsibilities, or terms</option>
                    <option value="inappropriate_offensive_content">Inappropriate, offensive, or discriminatory content</option>
                    <option value="expired_position">Expired / Position already filled</option>
                    <option value="other">Other policy violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any relevant context, messages, or fee amounts requested..."
                    maxLength={1000}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reporting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {reporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
