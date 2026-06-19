import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    experienceLevel: 'entry',
    salary: {
      min: '',
      max: '',
      negotiable: false
    },
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skillsRequired: [''],
    educationRequired: '',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData({
        ...formData,
        salary: {
          ...formData.salary,
          [salaryField]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clean up empty array items
    const cleanedData = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim()),
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      benefits: formData.benefits.filter(b => b.trim()),
      skillsRequired: formData.skillsRequired.filter(s => s.trim()),
      salary: {
        ...formData.salary,
        min: formData.salary.min ? Number(formData.salary.min) : undefined,
        max: formData.salary.max ? Number(formData.salary.max) : undefined
      }
    };

    try {
      await createJob(cleanedData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Job</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Addis Ababa, Ethiopia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
              <select
                name="experienceLevel"
                required
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea
              name="description"
              required
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          {/* Salary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Salary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 25000"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="salary.negotiable"
                    checked={formData.salary.negotiable}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Salary Negotiable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Requirement ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Requirement
            </button>
          </div>

          {/* Responsibilities */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Responsibility ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('responsibilities', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('responsibilities')}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Skills */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
            {formData.skillsRequired.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange('skillsRequired', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('skillsRequired', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('skillsRequired')}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Skill
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Required</label>
              <input
                type="text"
                name="educationRequired"
                value={formData.educationRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Bachelor's Degree in Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-3 rounded-md hover:bg-green-800 disabled:opacity-50 font-medium"
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
