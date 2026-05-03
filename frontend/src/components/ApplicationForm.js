import { useState, useEffect } from 'react';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';

const ApplicationForm = ({ jobId, onSuccess, onCancel }) => {
  const { applyForJob } = useJobs();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: ''
  });
  const [savedResumes, setSavedResumes] = useState([]);
  const [useSavedResume, setUseSavedResume] = useState(true);

  useEffect(() => {
    if (user?.resumes) {
      setSavedResumes(user.resumes);
      if (user.resumes.length > 0) {
        setFormData(prev => ({ ...prev, resume: user.resumes[0].url }));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applyForJob({
        job: jobId,
        ...formData
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Apply for this Job</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resume *
          </label>
          
          {savedResumes.length > 0 && (
            <div className="mb-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useSavedResume}
                  onChange={(e) => setUseSavedResume(e.target.checked)}
                  className="rounded"
                />
                Use saved resume
              </label>
            </div>
          )}
          
          {useSavedResume && savedResumes.length > 0 ? (
            <select
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a resume...</option>
              {savedResumes.map((resume) => (
                <option key={resume.id} value={resume.url}>
                  {resume.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/your-resume.pdf"
            />
          )}
          
          <p className="text-sm text-gray-500 mt-1">
            {savedResumes.length > 0 
              ? 'Select from your saved resumes or enter a new URL'
              : 'Provide a link to your resume (Google Drive, Dropbox, etc.)'}
            {' '}
            <a href="/profile" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Manage resumes in Profile
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us why you're a great fit for this position..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
