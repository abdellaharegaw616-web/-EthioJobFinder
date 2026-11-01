import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import FileUpload from '../components/FileUpload';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Globe, 
  Save, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

const Profile = () => {
  const { user, setUser, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Personal Info & Headline
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    professionalHeadline: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });

  // Skills
  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Experience
  const [experiences, setExperiences] = useState([]);
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [showAddExp, setShowAddExp] = useState(false);

  // Education
  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    to: ''
  });
  const [showAddEdu, setShowAddEdu] = useState(false);

  // Resumes & Documents
  const [resumes, setResumes] = useState([]);
  const [newResume, setNewResume] = useState({ name: '', url: '' });
  const [uploadedFiles, setUploadedFiles] = useState({
    cv: [],
    coverLetter: [],
    certificate: []
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    jobRecommendations: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        professionalHeadline: user.professionalHeadline || '',
        bio: user.bio || '',
        linkedIn: user.linkedIn || '',
        github: user.github || '',
        portfolio: user.portfolio || ''
      });
      setSkillsList(user.skills || []);
      setExperiences(user.experience || []);
      setEducations(user.education || []);
      setResumes(user.resumes || []);
      if (user.documents) {
        setUploadedFiles({
          cv: user.documents.cv || [],
          coverLetter: user.documents.coverLetter || [],
          certificate: user.documents.certificate || []
        });
      }
      if (user.notificationPreferences) {
        setNotifications({
          emailAlerts: user.notificationPreferences.emailAlerts ?? true,
          applicationUpdates: user.notificationPreferences.applicationUpdates ?? true,
          jobRecommendations: user.notificationPreferences.jobRecommendations ?? true
        });
      }
    }
  }, [user]);

  // Profile completeness calculation
  const calculateCompleteness = () => {
    let score = 0;
    if (formData.name && formData.email) score += 20;
    if (formData.professionalHeadline && formData.professionalHeadline.trim()) score += 20;
    if (formData.phone && formData.location) score += 15;
    if (skillsList.length >= 2) score += 15;
    if (formData.bio && formData.bio.trim().length > 15) score += 15;
    if (resumes.length > 0 || (uploadedFiles.cv && uploadedFiles.cv.length > 0)) score += 15;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        professionalHeadline: formData.professionalHeadline,
        bio: formData.bio,
        linkedIn: formData.linkedIn,
        github: formData.github,
        portfolio: formData.portfolio,
        skills: skillsList
      };

      const updated = await updateProfile(updateData);
      setUser(updated);
      setMessage('Profile details saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Skill handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateProfile({ skills: skillsList, experience: experiences, education: educations });
      setUser(updated);
      setMessage('Skills & Experience saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skills & experience');
    } finally {
      setSaving(false);
    }
  };

  // Experience handlers
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) {
      setError('Please provide at least a job title and company name');
      return;
    }
    setExperiences([...experiences, { ...newExp }]);
    setNewExp({
      title: '',
      company: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: ''
    });
    setShowAddExp(false);
    setMessage('Experience added! Click "Save Changes" to save permanently.');
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, idx) => idx !== index));
  };

  // Education handlers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.school || !newEdu.degree) {
      setError('Please provide school name and degree');
      return;
    }
    setEducations([...educations, { ...newEdu }]);
    setNewEdu({
      school: '',
      degree: '',
      fieldOfStudy: '',
      from: '',
      to: ''
    });
    setShowAddEdu(false);
    setMessage('Education added! Click "Save Changes" to save permanently.');
  };

  const handleRemoveEducation = (index) => {
    setEducations(educations.filter((_, idx) => idx !== index));
  };

  // Resume handlers
  const handleAddResume = (e) => {
    e.preventDefault();
    if (!newResume.name || !newResume.url) {
      setError('Please provide both resume name and URL');
      return;
    }
    const updatedResumes = [...resumes, { ...newResume, id: Date.now(), uploadedAt: new Date() }];
    setResumes(updatedResumes);
    setNewResume({ name: '', url: '' });
    setMessage('Resume link added! Click "Save Documents" to persist.');
  };

  const handleRemoveResume = (id) => {
    setResumes(resumes.filter(r => (r.id ? r.id !== id : r._id !== id)));
  };

  const handleFileUpload = (type, fileData) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], fileData]
    }));
    setMessage(`${type.toUpperCase()} uploaded! Click "Save Documents" to persist.`);
  };

  const handleFileDelete = (type, fileId) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter(f => f.id !== fileId)
    }));
  };

  const handleSaveDocuments = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateProfile({
        resumes,
        documents: uploadedFiles
      });
      setUser(updated);
      setMessage('Resumes and documents saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save documents');
    } finally {
      setSaving(false);
    }
  };

  // Notification preferences handler
  const handleNotificationToggle = async (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updated);
    try {
      await authService.updateNotificationPreferences(updated);
      if (user) {
        setUser({ ...user, notificationPreferences: updated });
      }
      setMessage('Notification preferences updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Profile Header Banner */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.name || 'My Profile'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 capitalize">
                    {user?.role || 'Job Seeker'}
                  </span>
                </div>
                <p className="text-sm font-medium text-orange-500 dark:text-orange-400 mt-0.5">
                  {formData.professionalHeadline || 'Add a professional headline to stand out to Ethiopian employers'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </span>
                  {user?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.location}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completeness Card */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 w-full md:w-72">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Profile Completeness
                </span>
                <span className="font-bold text-orange-500 dark:text-orange-400">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completeness === 100 
                  ? 'All-star profile! Ethiopian recruiters can easily find you.'
                  : 'Complete headline, skills & CV to get 3x more recruiter contacts.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-300 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-xs font-semibold underline hover:opacity-80">
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-xs font-semibold underline hover:opacity-80">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Personal Info & Headline
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'experience'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Skills & Experience
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              CV & Documents ({resumes.length + (uploadedFiles.cv?.length || 0)})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'notifications'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              Alerts & Notifications
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: Profile & Headline */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                    Professional Headline <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    A punchy summary of your role and top expertise (e.g., "Full-Stack Engineer | React & Node.js | Addis Ababa").
                  </p>
                  <input
                    type="text"
                    name="professionalHeadline"
                    value={formData.professionalHeadline}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Accountant | ACCA Certified | Financial Analyst"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+251 91 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">City / Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Addis Ababa, Hawassa, Adama, Remote..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">About / Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Highlight your key achievements, years of experience, and what makes you a standout candidate..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">GitHub / Repo</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white mb-2">
                      <Globe className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Skills & Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Professional Skills</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Add tags for skills, frameworks, languages, or domain expertise you possess.
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="e.g. JavaScript, Accounting, Project Management, Python"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Add Skill
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-700">
                    {skillsList.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No skills listed yet. Add skills to match Ethiopian job vacancies.</span>
                    ) : (
                      skillsList.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-600 transition"
                            title="Remove skill"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Work Experience</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">List previous roles and key achievements</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddExp(!showAddExp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-500 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-300 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Role
                    </button>
                  </div>

                  {showAddExp && (
                    <div className="bg-gray-50 dark:bg-gray-700/60 p-4 rounded-xl border border-gray-200 dark:border-gray-600 mb-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Job Title *"
                          value={newExp.title}
                          onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Company / Organization *"
                          value={newExp.company}
                          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Addis Ababa)"
                          value={newExp.location}
                          onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="currentRole"
                            checked={newExp.current}
                            onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                            className="rounded text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="currentRole" className="text-xs text-gray-700 dark:text-gray-300">
                            I currently work here
                          </label>
                        </div>
                      </div>
                      <textarea
                        placeholder="Brief summary of duties and achievements..."
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddExp(false)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600"
                        >
                          Add to List
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {experiences.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No work experience listed yet.</p>
                    ) : (
                      experiences.map((exp, idx) => (
                        <div key={idx} className="flex items-start justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{exp.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                            {exp.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{exp.description}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <GraduationCap className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                        Education & Qualifications
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Degrees, diplomas, and university credentials</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddEdu(!showAddEdu)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-500 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-300 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>

                  {showAddEdu && (
                    <div className="bg-gray-50 dark:bg-gray-700/60 p-4 rounded-xl border border-gray-200 dark:border-gray-600 mb-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Institution / University (e.g. Addis Ababa University) *"
                          value={newEdu.school}
                          onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Degree / Certificate (e.g. BSc, MSc, Diploma) *"
                          value={newEdu.degree}
                          onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study (e.g. Computer Science)"
                          value={newEdu.fieldOfStudy}
                          onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:col-span-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddEdu(false)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600"
                        >
                          Add to List
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {educations.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No education credentials listed yet.</p>
                    ) : (
                      educations.map((edu, idx) => (
                        <div key={idx} className="flex items-start justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{edu.degree} in {edu.fieldOfStudy || 'Field'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">{edu.school}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove education"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleSaveSkills}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Skills & Qualifications
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Resumes & Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-8">
                {/* CV / Resume Upload */}
                <div className="bg-gray-50 dark:bg-gray-700/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Upload Primary CV / Resume</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Upload your latest resume (PDF or DOCX, max 5MB). Recruiters will view this when reviewing your applications.
                  </p>
                  <FileUpload
                    type="cv"
                    onUpload={(fileData) => handleFileUpload('cv', fileData)}
                    existingFiles={uploadedFiles.cv}
                    onDelete={(fileId) => handleFileDelete('cv', fileId)}
                  />
                </div>

                {/* Cloud Link Resumes */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Or Link Cloud Resume (Google Drive, Dropbox)</h3>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="text"
                      placeholder='Resume label (e.g., "Full-Stack CV 2026")'
                      value={newResume.name}
                      onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Public URL (https://drive.google.com/...)"
                      value={newResume.url}
                      onChange={(e) => setNewResume({ ...newResume, url: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddResume}
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 shrink-0"
                    >
                      Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {resumes.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No cloud resume links added.</p>
                    ) : (
                      resumes.map((resItem) => (
                        <div key={resItem.id || resItem._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{resItem.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <a
                              href={resItem.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline flex items-center gap-1"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveResume(resItem.id || resItem._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Additional Documents: Certificates */}
                <div className="bg-gray-50 dark:bg-gray-700/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Certifications & Credentials</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Upload degrees, certifications, or professional awards (PDF, PNG, JPG).
                  </p>
                  <FileUpload
                    type="certificate"
                    onUpload={(fileData) => handleFileUpload('certificate', fileData)}
                    existingFiles={uploadedFiles.certificate}
                    onDelete={(fileId) => handleFileDelete('certificate', fileId)}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleSaveDocuments}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Resumes & Documents
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Alerts & Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Notification Preferences</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Control what notifications and updates you receive from EthioJob Finder.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Application Status Updates</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive instant alerts when recruiters review, shortlist, or update your job application.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.applicationUpdates}
                        onChange={() => handleNotificationToggle('applicationUpdates')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">New Job Recommendations</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Get suggestions for newly posted vacancies that match your skills and preferred Ethiopian cities.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.jobRecommendations}
                        onChange={() => handleNotificationToggle('jobRecommendations')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Email Newsletters & Highlights</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Periodic email summaries of Ethiopian hiring trends, salary insights, and top vacancies.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailAlerts}
                        onChange={() => handleNotificationToggle('emailAlerts')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
