import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });
  const [resumes, setResumes] = useState([]);
  const [newResume, setNewResume] = useState({ name: '', url: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadedFiles, setUploadedFiles] = useState({
    cv: [],
    coverLetter: [],
    certificate: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
        bio: user.bio || '',
        linkedIn: user.linkedIn || '',
        github: user.github || '',
        portfolio: user.portfolio || ''
      });
      setResumes(user.resumes || []);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      console.log('Updating profile with:', updateData);
      const updated = await authService.updateProfile(updateData);
      console.log('Profile updated successfully:', updated);
      setUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const handleAddResume = (e) => {
    e.preventDefault();
    if (!newResume.name || !newResume.url) {
      setError('Please provide both resume name and URL');
      return;
    }

    const updatedResumes = [...resumes, { ...newResume, id: Date.now(), uploadedAt: new Date() }];
    setResumes(updatedResumes);
    setNewResume({ name: '', url: '' });
    setMessage('Resume added! Click "Save Changes" to save permanently.');
  };

  const handleRemoveResume = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
    setMessage('Resume removed! Click "Save Changes" to save permanently.');
  };

  const handleFileUpload = (type, fileData) => {
    setUploadedFiles({
      ...uploadedFiles,
      [type]: [...uploadedFiles[type], fileData]
    });
    setMessage(`${type.toUpperCase()} uploaded! Click "Save Changes" to save permanently.`);
  };

  const handleFileDelete = (type, fileId) => {
    setUploadedFiles({
      ...uploadedFiles,
      [type]: uploadedFiles[type].filter(f => f.id !== fileId)
    });
    setMessage(`${type.toUpperCase()} removed! Click "Save Changes" to save permanently.`);
  };

  const handleSaveResumes = async () => {
    try {
      const updated = await authService.updateProfile({ resumes });
      setUser(updated);
      setMessage('Resumes saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resumes');
    }
  };

  const handleSaveDocuments = async () => {
    try {
      const updated = await authService.updateProfile({ documents: uploadedFiles });
      setUser(updated);
      setMessage('Documents saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save documents');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'resumes'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              My Resumes ({resumes.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'documents'
                  ? 'border-b-2 border-green-700 text-green-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Documents
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Node.js, Python..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / Summary</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Brief summary about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800"
                >
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === 'resumes' && (
              <div className="space-y-6">
                {/* Add New Resume */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4 dark:text-white">Add New Resume</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder='Resume name (e.g., "Software Developer Resume")'
                      value={newResume.name}
                      onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                    <input
                      type="url"
                      placeholder="Resume URL (Google Drive, Dropbox, etc.)"
                      value={newResume.url}
                      onChange={(e) => setNewResume({ ...newResume, url: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                    />
                    <button
                      onClick={handleAddResume}
                      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Resume List */}
                <div>
                  <h3 className="font-semibold mb-4 dark:text-white">My Resumes</h3>
                  {resumes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No resumes added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div key={resume.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium dark:text-white">{resume.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Added {new Date(resume.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline px-3 py-1"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleRemoveResume(resume.id)}
                              className="text-red-600 hover:text-red-800 dark:hover:text-red-400 px-3 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {resumes.length > 0 && (
                  <button
                    onClick={handleSaveResumes}
                    className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                  >
                    Save Resume Changes
                  </button>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Upload Documents</h3>
                
                {/* CV Upload */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 dark:text-white">CV / Resume</h4>
                  <FileUpload
                    type="cv"
                    onUpload={(fileData) => handleFileUpload('cv', fileData)}
                    existingFiles={uploadedFiles.cv}
                    onDelete={(fileId) => handleFileDelete('cv', fileId)}
                  />
                </div>

                {/* Cover Letter Upload */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 dark:text-white">Cover Letter</h4>
                  <FileUpload
                    type="coverLetter"
                    onUpload={(fileData) => handleFileUpload('coverLetter', fileData)}
                    existingFiles={uploadedFiles.coverLetter}
                    onDelete={(fileId) => handleFileDelete('coverLetter', fileId)}
                  />
                </div>

                {/* Certificates Upload */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 dark:text-white">Certificates</h4>
                  <FileUpload
                    type="certificate"
                    onUpload={(fileData) => handleFileUpload('certificate', fileData)}
                    existingFiles={uploadedFiles.certificate}
                    onDelete={(fileId) => handleFileDelete('certificate', fileId)}
                  />
                </div>

                <button
                  onClick={handleSaveDocuments}
                  className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
