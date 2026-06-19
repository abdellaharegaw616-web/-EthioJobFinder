import { useState } from 'react';
import { FileText, Download, Plus, Trash2, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Link, Code } from 'lucide-react';

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: []
  });

  const [experienceItem, setExperienceItem] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [educationItem, setEducationItem] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [skill, setSkill] = useState('');

  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [e.target.name]: e.target.value
      }
    });
  };

  const addExperience = () => {
    if (experienceItem.title && experienceItem.company) {
      setResumeData({
        ...resumeData,
        experience: [...resumeData.experience, { ...experienceItem }]
      });
      setExperienceItem({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const removeExperience = (index) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    if (educationItem.degree && educationItem.institution) {
      setResumeData({
        ...resumeData,
        education: [...resumeData.education, { ...educationItem }]
      });
      setEducationItem({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const removeEducation = (index) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill]
      });
      setSkill('');
    }
  };

  const removeSkill = (index) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    });
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Resume download feature would generate a PDF here. For now, you can print the page (Ctrl+P) and save as PDF.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-green-700" />
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex border-b mb-6">
              {['personal', 'experience', 'education', 'skills'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium capitalize flex-1 ${
                    activeTab === tab
                      ? 'border-b-2 border-green-700 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={resumeData.personal.fullName}
                    onChange={handlePersonalChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={resumeData.personal.email}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={resumeData.personal.phone}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="+251 911 123 456"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={resumeData.personal.location}
                    onChange={handlePersonalChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Addis Ababa, Ethiopia"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Link className="w-4 h-4" />
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={resumeData.personal.linkedin}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      GitHub
                    </label>
                    <input
                      type="text"
                      name="github"
                      value={resumeData.personal.github}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={resumeData.personal.summary}
                    onChange={handlePersonalChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                    placeholder="Brief professional summary..."
                  />
                </div>
              </div>
            )}

            {/* Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-700" />
                    Add Experience
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={experienceItem.title}
                      onChange={(e) => setExperienceItem({ ...experienceItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={experienceItem.company}
                      onChange={(e) => setExperienceItem({ ...experienceItem, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={experienceItem.location}
                      onChange={(e) => setExperienceItem({ ...experienceItem, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={experienceItem.startDate}
                        onChange={(e) => setExperienceItem({ ...experienceItem, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={experienceItem.endDate}
                        onChange={(e) => setExperienceItem({ ...experienceItem, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <textarea
                      placeholder="Job Description"
                      value={experienceItem.description}
                      onChange={(e) => setExperienceItem({ ...experienceItem, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                    />
                    <button
                      onClick={addExperience}
                      className="w-full px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                      </div>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-700" />
                    Add Education
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={educationItem.degree}
                      onChange={(e) => setEducationItem({ ...educationItem, degree: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={educationItem.institution}
                      onChange={(e) => setEducationItem({ ...educationItem, institution: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={educationItem.location}
                      onChange={(e) => setEducationItem({ ...educationItem, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={educationItem.startDate}
                        onChange={(e) => setEducationItem({ ...educationItem, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={educationItem.endDate}
                        onChange={(e) => setEducationItem({ ...educationItem, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={educationItem.description}
                      onChange={(e) => setEducationItem({ ...educationItem, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                    />
                    <button
                      onClick={addEducation}
                      className="w-full px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      </div>
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-700" />
                    Add Skills
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a skill"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((s, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Preview</h2>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="border p-6 bg-gray-50 min-h-[600px]" id="resume-preview">
              {resumeData.personal.fullName && (
                <div className="border-b-2 border-green-700 pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{resumeData.personal.fullName}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                    {resumeData.personal.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {resumeData.personal.email}
                      </span>
                    )}
                    {resumeData.personal.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {resumeData.personal.phone}
                      </span>
                    )}
                    {resumeData.personal.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {resumeData.personal.location}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {resumeData.personal.summary && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-green-700 mb-2">Professional Summary</h2>
                  <p className="text-gray-700">{resumeData.personal.summary}</p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index}>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-gray-600">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                        {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                        {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((s, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
