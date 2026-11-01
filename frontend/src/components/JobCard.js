import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSavedJobs } from '../contexts/SavedJobsContext';
import { useApplications } from '../contexts/ApplicationsContext';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  MapPin,
  Banknote,
  Eye,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Star,
  Loader2
} from 'lucide-react';

const JobCard = ({ job, onDelete }) => {
  const { isEmployer, user } = useAuth();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const { applyToJob, isJobApplied, getApplicationStatus } = useApplications();
  const isOwner = isEmployer && (job.postedBy?._id === user?._id || job.postedBy === user?._id);

  const isExpired = Boolean(job.isExpired || (job.deadline && new Date(job.deadline) < new Date()) || job.status === 'closed');

  const formatSalary = () => {
    if (job.salary?.negotiable) return 'Negotiable';
    if (job.salary?.min && job.salary?.max) {
      return `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    }
    if (job.salary?.min) return `From ${job.salary.min.toLocaleString()} ${job.salary.currency || 'ETB'}`;
    return 'Not disclosed';
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300',
      'part-time': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'contract': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'internship': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'remote': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const [isApplying, setIsApplying] = useState(false);
  const [applyNotice, setApplyNotice] = useState('');

  const handleApply = async () => {
    if (isJobApplied(job._id) || isExpired || isApplying) return;
    setIsApplying(true);
    setApplyNotice('');
    try {
      await applyToJob(job);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Application failed';
      setApplyNotice(msg);
      setTimeout(() => setApplyNotice(''), 4000);
    } finally {
      setIsApplying(false);
    }
  };

  const getApplicationStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      interview_scheduled: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300',
      hired: 'bg-orange-500 text-white',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getApplicationStatusLabel = (status) => {
    const labels = {
      pending: 'Pending Review',
      applied: 'Applied',
      reviewing: 'Under Review',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted',
      interview_scheduled: 'Interview Scheduled',
      hired: 'Hired',
      rejected: 'Not Selected'
    };
    return labels[status] || status;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border ${job.isFeatured ? 'border-amber-300 dark:border-amber-700 ring-1 ring-amber-300/40' : isExpired ? 'border-red-200 dark:border-red-900/40 opacity-90' : 'border-gray-200 dark:border-gray-700'} p-6 relative`}>
      {/* Save Button */}
      <button
        onClick={() => isJobSaved(job._id) ? removeJob(job._id) : saveJob(job)}
        className="absolute top-5 right-5 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-500 dark:text-gray-400"
        title={isJobSaved(job._id) ? 'Remove from saved' : 'Save job'}
        aria-label="Save job"
      >
        {isJobSaved(job._id) ? (
          <BookmarkCheck className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        ) : (
          <Bookmark className="w-5 h-5 hover:text-orange-500" />
        )}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              <Link to={`/jobs/${job._id}`} className="hover:text-orange-500 dark:hover:text-orange-400 transition">
                {job.title}
              </Link>
            </h3>

            {job.matchScore && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-700">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                {job.matchScore}% Match
              </span>
            )}

            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <Star className="w-3 h-3 fill-current text-amber-500" />
                Featured
              </span>
            )}

            {isExpired && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <AlertCircle className="w-3 h-3" />
                Closed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-3">
            <Link
              to={`/company/${job.postedBy?._id || job.postedBy}`}
              className="font-medium hover:text-orange-500 dark:hover:text-orange-400 transition"
            >
              {job.postedBy?.companyName || job.company}
            </Link>
            {job.postedBy?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full" title="Verified Ethiopian Employer">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${getJobTypeColor(job.type)}`}>
              {job.type?.replace('-', ' ')}
            </span>
            {job.workArrangement && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 capitalize">
                {job.workArrangement}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {job.category}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 capitalize">
              {job.experienceLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm gap-y-2 gap-x-4 mb-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </span>
            <span className="flex items-center">
              <Banknote className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
              <span>{formatSalary()}</span>
            </span>
            {job.deadline && (
              <span className={`flex items-center ${isExpired ? 'text-red-500 dark:text-red-400 font-medium' : ''}`}>
                <Calendar className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </span>
            )}
            <span className="flex items-center text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5 mr-1 shrink-0" />
              {job.views || 0} views
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {job.description}
          </p>

          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-orange-700 dark:text-orange-400 font-medium mb-3">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Matching skills:</span>
              {job.matchedSkills.slice(0, 4).map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[11px]">
                  {sk}
                </span>
              ))}
              {job.matchedSkills.length > 4 && (
                <span className="text-[11px] text-gray-400">+{job.matchedSkills.length - 4} more</span>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60">
            <div>
              {isJobApplied(job._id) ? (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getApplicationStatusColor(getApplicationStatus(job._id))}`}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {getApplicationStatusLabel(getApplicationStatus(job._id))}
                </div>
              ) : isExpired ? (
                <span className="text-xs font-medium text-red-500 dark:text-red-400">
                  Applications closed for this vacancy
                </span>
              ) : (
                !isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        'Quick Apply'
                      )}
                    </button>
                    {applyNotice && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {applyNotice}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/jobs/${job._id}`}
                className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>

        {/* Owner Controls */}
        {isOwner && onDelete && (
          <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
            <Link
              to={`/edit-job/${job._id}`}
              className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Edit Vacancy"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(job._id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Delete Vacancy"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
