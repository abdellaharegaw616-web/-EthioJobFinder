import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Banknote, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  AlertCircle, 
  Save, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

const ETHIOPIAN_CITIES = [
  'Addis Ababa',
  'Hawassa',
  'Adama (Nazret)',
  'Bahir Dar',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Jimma',
  'Bishoftu',
  'Dessie'
];

const PostJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { createJob, updateJob, fetchJob } = useJobs();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: user?.companyName || '',
    location: user?.companyCity || user?.location || 'Addis Ababa',
    type: 'full-time',
    workArrangement: 'on-site',
    category: 'IT & Software',
    experienceLevel: 'mid',
    status: 'active',
    salary: {
      min: '',
      max: '',
      currency: 'ETB',
      negotiable: false
    },
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skillsRequired: [''],
    educationRequired: '',
    deadline: ''
  });

  // Load existing job if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadJob = async () => {
        try {
          setFetchingJob(true);
          const data = await fetchJob(id);
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              company: data.company || user?.companyName || '',
              location: data.location || 'Addis Ababa',
              type: data.type || 'full-time',
              workArrangement: data.workArrangement || 'on-site',
              category: data.category || 'IT & Software',
              experienceLevel: data.experienceLevel || 'entry',
              status: data.status || 'active',
              salary: {
                min: data.salary?.min || '',
                max: data.salary?.max || '',
                currency: data.salary?.currency || 'ETB',
                negotiable: data.salary?.negotiable || false
              },
              requirements: data.requirements && data.requirements.length > 0 ? data.requirements : [''],
              responsibilities: data.responsibilities && data.responsibilities.length > 0 ? data.responsibilities : [''],
              benefits: data.benefits && data.benefits.length > 0 ? data.benefits : [''],
              skillsRequired: data.skillsRequired && data.skillsRequired.length > 0 ? data.skillsRequired : [''],
              educationRequired: data.educationRequired || '',
              deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : ''
            });
          }
        } catch (err) {
          setError('Failed to fetch vacancy details for editing.');
        } finally {
          setFetchingJob(false);
        }
      };
      loadJob();
    }
  }, [id, isEditMode, fetchJob, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray.length > 0 ? newArray : [''] }));
  };

  const handleCityPreset = (city) => {
    setFormData(prev => ({ ...prev, location: city }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!formData.company.trim()) {
      setError('Please provide a company name.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please specify a location or Ethiopian city.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a detailed job description.');
      return;
    }

    // Validate deadline
    if (formData.deadline && formData.status !== 'draft') {
      const chosenDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosenDate < today) {
        setError('Application deadline must be a future date.');
        return;
      }
    }

    // Clean up empty array items
    const cleanedRequirements = formData.requirements.map(r => r.trim()).filter(Boolean);
    if (cleanedRequirements.length === 0) {
      setError('Please provide at least one job requirement or qualification.');
      return;
    }

    const payload = {
      ...formData,
      requirements: cleanedRequirements,
      responsibilities: formData.responsibilities.map(r => r.trim()).filter(Boolean),
      benefits: formData.benefits.map(b => b.trim()).filter(Boolean),
      skillsRequired: formData.skillsRequired.map(s => s.trim()).filter(Boolean),
      salary: {
        currency: 'ETB',
        min: formData.salary.min ? Number(formData.salary.min) : undefined,
        max: formData.salary.max ? Number(formData.salary.max) : undefined,
        negotiable: Boolean(formData.salary.negotiable)
      }
    };

    setLoading(true);

    try {
      if (isEditMode) {
        await updateJob(id, payload);
        setSuccess('Job vacancy updated successfully!');
      } else {
        await createJob(payload);
        setSuccess('Job vacancy published successfully!');
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save job vacancy.');
      setLoading(false);
    }
  };

  // Get today's date formatted as YYYY-MM-DD for datepicker min attribute
  const todayDateString = new Date().toISOString().split('T')[0];

  if (fetchingJob) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading vacancy details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header Banner */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Employer Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {isEditMode ? 'Edit Job Vacancy' : 'Post an Ethiopian Job Vacancy'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEditMode 
                  ? 'Update position details, requirements, or application deadline.'
                  : 'Reach thousands of qualified Ethiopian professionals and job seekers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-300 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Building2 className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Role & Company Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer, Lead Accountant, Civil Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Hiring Company / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Ethio Telecom, Commercial Bank of Ethiopia"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Industry Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
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
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote-only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Work Arrangement <span className="text-red-500">*</span>
                </label>
                <select
                  name="workArrangement"
                  required
                  value={formData.workArrangement}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="on-site">On-site (Physical Office)</option>
                  <option value="hybrid">Hybrid (Office + Remote)</option>
                  <option value="remote">100% Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="experienceLevel"
                  required
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="entry">Entry Level (0-2 yrs)</option>
                  <option value="mid">Mid Level (2-5 yrs)</option>
                  <option value="senior">Senior Level (5+ yrs)</option>
                  <option value="executive">Executive / Director</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Vacancy Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="active">Active (Visible to job seekers)</option>
                  <option value="draft">Draft (Saved privately)</option>
                  <option value="closed">Closed (No longer accepting applicants)</option>
                </select>
              </div>
            </div>

            {/* Location with Ethiopian City Presets */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                Location (Ethiopian City or Region) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Addis Ababa (Bole), Hawassa, Adama"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none mb-2"
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 mr-1">Popular Cities:</span>
                {ETHIOPIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCityPreset(city)}
                    className={`px-2 py-0.5 rounded-full text-xs transition border ${
                      formData.location.includes(city)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                Job Overview & Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the company mission, the team, day-to-day work, and the impact of this vacancy..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Compensation & Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Banknote className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Compensation & Deadlines
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Minimum Monthly Salary (ETB)
                </label>
                <input
                  type="number"
                  name="salary.min"
                  min="0"
                  step="500"
                  value={formData.salary.min}
                  onChange={handleChange}
                  placeholder="e.g. 20000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Maximum Monthly Salary (ETB)
                </label>
                <input
                  type="number"
                  name="salary.max"
                  min="0"
                  step="500"
                  value={formData.salary.max}
                  onChange={handleChange}
                  placeholder="e.g. 35000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="salary.negotiable"
                    checked={formData.salary.negotiable}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Salary Negotiable
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Application Deadline Date
                </label>
                <input
                  type="date"
                  name="deadline"
                  min={todayDateString}
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave blank for rolling/ongoing applications.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Education Credential Required
                </label>
                <input
                  type="text"
                  name="educationRequired"
                  value={formData.educationRequired}
                  onChange={handleChange}
                  placeholder="e.g. BSc in Computer Science or related degree"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Requirements & Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Requirements & Skills
            </h2>

            {/* Requirements list */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Requirements & Qualifications <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', idx, e.target.value)}
                      placeholder={`e.g. 3+ years experience with React or Node.js`}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', idx)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Remove requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Requirement
              </button>
            </div>

            {/* Responsibilities list */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Key Responsibilities & Duties
              </label>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleArrayChange('responsibilities', idx, e.target.value)}
                      placeholder={`e.g. Collaborate with engineering and product design teams`}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('responsibilities', idx)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Remove responsibility"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayField('responsibilities')}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Responsibility
              </button>
            </div>

            {/* Skills required */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Skills & Tech Stack Tags
              </label>
              <div className="space-y-2">
                {formData.skillsRequired.map((skill, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skillsRequired', idx, e.target.value)}
                      placeholder={`e.g. JavaScript, PostgreSQL, Docker`}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('skillsRequired', idx)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayField('skillsRequired')}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 shadow-sm hover:shadow"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditMode ? 'Save Vacancy Changes' : 'Publish Job Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
