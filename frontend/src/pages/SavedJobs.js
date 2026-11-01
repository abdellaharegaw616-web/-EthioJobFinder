import { useSavedJobs } from '../contexts/SavedJobsContext';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
  const { savedJobs, loading } = useSavedJobs();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Saved Vacancies
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300">
                  {savedJobs.length} {savedJobs.length === 1 ? 'Job' : 'Jobs'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Keep track of roles you're interested in and apply before application deadlines close.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shrink-0"
            >
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              Discover More Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved jobs yet</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-md mx-auto">
              Save promising vacancies as you browse so you can review requirements and apply later before deadlines.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition shadow-sm hover:shadow"
            >
              Browse Open Vacancies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SavedJobs;
