import { useSavedJobs } from '../contexts/SavedJobsContext';
import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Briefcase } from 'lucide-react';

const SavedJobs = () => {
  const { savedJobs, removeJob } = useSavedJobs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-green-700" />
            <h1 className="text-3xl font-bold">Saved Jobs</h1>
          </div>
          <p className="text-gray-600">Jobs you've bookmarked for later application</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {savedJobs.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No saved jobs yet</h2>
              <p className="text-gray-500 mb-6">Start bookmarking jobs you're interested in</p>
              <Link to="/jobs" className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeJob(job._id)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                    title="Remove from saved"
                  >
                    <Bookmark className="w-5 h-5 text-green-700" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold">
                      {job.company?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{job.type || 'Full Time'}</span>
                    <Link to={`/jobs/${job._id}`} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SavedJobs;
