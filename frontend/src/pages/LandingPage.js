import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { useSavedJobs } from '../contexts/SavedJobsContext';
import { Search, MapPin, Building2, Users, Briefcase, Sparkles, ChevronDown, Shield, Zap, Gift, FileText, MessageSquare, Bookmark, BookmarkCheck } from 'lucide-react';
import Footer from '../components/Footer';
import EmailSubscription from '../components/EmailSubscription';

const LandingPage = () => {
  const { user } = useAuth();
  const { jobs, fetchJobs } = useJobs();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    fetchJobs({ limit: 6 });
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchTerm}&location=${searchLocation}`);
  };

  const companyFaqs = [
    { q: 'Can I see a breakdown of your pricing plans?', a: 'Absolutely! Our pricing varies depending on the features you need. You can view our detailed plans on our pricing page, we offer different packages to suit your needs.' },
    { q: 'What payment methods do you accept?', a: 'We accept various payment methods including credit/debit cards, bank transfers, and mobile money payments for Ethiopian users.' },
    { q: 'What happens to my job postings when my subscription ends?', a: 'Your job postings will remain active for 30 days after subscription ends. You can renew anytime to keep them visible.' },
    { q: 'Is there a free trial available?', a: 'Yes! We offer a 14-day free trial for all new employer accounts. No credit card required.' },
    { q: 'My hiring needs are specific. Do you offer custom plans?', a: 'Yes, we offer tailored enterprise solutions for large companies with specific hiring needs. Contact our sales team.' }
  ];

  const jobSeekerFaqs = [
    { q: 'Is it free to apply for jobs?', a: 'Yes! Job seekers can apply to unlimited jobs completely free. We believe everyone deserves access to opportunities.' },
    { q: 'How do I create a professional resume?', a: 'Use our AI-powered resume builder to create a tailored resume that matches job requirements automatically.' },
    { q: 'How long does the hiring process take?', a: 'Most employers respond within 3-5 business days. You can track your application status in real-time.' },
    { q: 'Are the employers verified?', a: 'Yes! All employers go through our verification process. Look for the blue checkmark badge.' },
    { q: 'Can I work remotely through EthioJobFinder?', a: 'Absolutely! Many employers on our platform offer remote and hybrid positions.' }
  ];

  const testimonials = [
    { name: 'Abraham Tadesse', role: 'HR Manager', company: 'Maraki English', companyLogo: 'M', text: 'EthioJobFinder helped us hire qualified candidates quickly and efficiently.' },
    { name: 'Saron Girma', role: 'Recruiter', company: 'Dashen Bank', companyLogo: 'D', text: 'The platform made our hiring process much smoother and faster.' },
    { name: 'Mulugeta Eshetu', role: 'HR Manager', company: 'Ethiopian Airlines', companyLogo: 'E', text: 'We found excellent talent through EthioJobFinder for our technical positions.' }
  ];

  const stats = [
    { value: '2,500+', label: 'Jobs Posted', icon: Briefcase },
    { value: '500+', label: 'Companies', icon: Building2 },
    { value: '8,000+', label: 'Applications', icon: Users },
    { value: '20+', label: 'Industries', icon: Building2 }
  ];

  const features = [
    { icon: Zap, title: 'Work Within Reach', desc: 'Search, apply, and secure roles instantly from your phone. Opportunity is always in your pocket.' },
    { icon: Gift, title: 'Get Hired Fast', desc: 'Thousands of candidates land roles within a few hours through our platform.' },
    { icon: Sparkles, title: 'Smart Career Tools', desc: 'Use our AI to instantly convert your CV into a clean and organized profile.' },
    { icon: Shield, title: 'Verified Employers', desc: 'Safety first. We vet every company so you can work with confidence.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      {bannerVisible && (
        <div className="bg-green-700 text-white py-2 px-4 text-center relative">
          <p className="text-sm">
            Want to Apply Easily From Your Phone? Join Our Telegram Channel!{' '}
            <a 
              href="https://t.me/ethiojobfinder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium hover:text-yellow-300"
            >
              Join here
            </a>
          </p>
          <button 
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your Dream Job in
                <br />
                <span className="text-green-700">
                  Ethiopia
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with top employers across Ethiopia. Browse thousands of verified job opportunities and take the next step in your career.
              </p>
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-700" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 h-12"
                    />
                  </div>
                  <div className="w-48 relative hidden sm:block">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-700" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 h-12"
                    />
                  </div>
                </div>
              </form>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/register?type=employer"
                  className="px-8 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
                >
                  Find Talent
                </Link>
                <Link 
                  to="/jobs"
                  className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition inline-block text-center"
                >
                  Find Work
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-500">2,500+ jobs available</span>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold">
                        {job.company?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">8,000+ applications sent</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-xs">
                <p className="text-sm font-medium text-gray-800">500+ companies hiring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-gray-600">Latest opportunities from top employers</p>
            </div>
            <Link to="/jobs" className="text-green-700 font-medium hover:underline">View All Jobs →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                <button
                  onClick={() => isJobSaved(job._id) ? removeJob(job._id) : saveJob(job)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  {isJobSaved(job._id) ? (
                    <BookmarkCheck className="w-5 h-5 text-green-700" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
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
                  <span className="text-sm text-gray-500">Full Time</span>
                  <Link to={`/jobs/${job._id}`} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition">Apply Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Top Companies Hiring</h2>
            <p className="text-gray-600">Join leading organizations in Ethiopia</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Dashen Bank', logo: 'D' },
              { name: 'Safaricom Ethiopia', logo: 'S' },
              { name: 'Ethiopian Airlines', logo: 'E' },
              { name: 'Awash Bank', logo: 'A' },
              { name: 'Tele Ethiopia', logo: 'T' }
            ].map((company, i) => (
              <Link key={i} to={`/jobs?company=${encodeURIComponent(company.name)}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition cursor-pointer">
                <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">{company.logo}</span>
                </div>
                <p className="font-medium text-sm">{company.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Job Categories</h2>
            <p className="text-gray-600">Explore opportunities by industry</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'IT & Software', icon: Briefcase },
              { name: 'Marketing', icon: Briefcase },
              { name: 'Finance', icon: Briefcase },
              { name: 'Engineering', icon: Briefcase },
              { name: 'Healthcare', icon: Briefcase },
              { name: 'Education', icon: Briefcase }
            ].map((category, i) => {
              const Icon = category.icon;
              return (
                <Link key={i} to="/jobs" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-green-700" />
                  </div>
                  <p className="font-medium text-sm">{category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Whether you're here to grow your team or find your next opportunity, EthioJobFinder makes the process simple, fast, and hassle-free.
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-8 py-3 rounded-full font-medium transition ${
                  activeTab === 'companies' 
                    ? 'bg-green-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('jobseekers')}
                className={`px-8 py-3 rounded-full font-medium transition ${
                  activeTab === 'jobseekers' 
                    ? 'bg-green-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Job Seekers
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {activeTab === 'companies' ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-lg">CREATE A JOB POST</h3>
                      <p className="text-gray-600">Post your job with details, requirements, and budget in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-lg">FIND TALENT</h3>
                      <p className="text-gray-600">Review applications and connect with qualified candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-lg">HIRED!</h3>
                      <p className="text-gray-600">Interview, hire, and onboard your new team member</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-lg">CREATE ACCOUNT</h3>
                      <p className="text-gray-600">Build your profile and upload your resume in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-lg">FIND YOUR JOB</h3>
                      <p className="text-gray-600">Browse thousands of jobs and apply with one click</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-lg">GET HIRED!</h3>
                      <p className="text-gray-600">Land your dream job and start your new career</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <div className="bg-green-700 rounded-lg p-8 text-white">
                <h3 className="text-3xl font-bold mb-4">
                  {activeTab === 'companies' ? 'Ready to' : 'Ready to'}
                  <br />
                  {activeTab === 'companies' ? 'Hire Talent?' : 'Find Work?'}
                </h3>
                <p className="text-white/80 mb-6">
                  {activeTab === 'companies' 
                    ? 'Join thousands of companies finding top Ethiopian talent on EthioJobFinder.' 
                    : 'Join 300,000+ job seekers who found their dream job through our platform.'}
                </p>
                <button 
                  onClick={() => navigate(activeTab === 'companies' ? '/register?type=employer' : '/register')}
                  className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition"
                >
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-green-700 font-medium mb-2">EthioJobFinder through the eyes of hiring teams</p>
              <h2 className="text-3xl font-bold">Hear what our customers<br />are saying</h2>
            </div>
            <button 
              onClick={() => navigate('/jobs')}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              See all stories
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <p className="text-gray-700 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-600">{t.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 bg-green-700 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{t.companyLogo}</span>
                      </div>
                      <p className="text-xs text-gray-500">{t.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Find Work. Get Paid.<br />
                Own Your Future.
              </h2>
              <p className="text-gray-600 mb-8">
                Access verified opportunities from real businesses. Discover different work opportunities every day and apply in minutes.
              </p>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{f.title}</h4>
                      <p className="text-sm text-gray-600">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <s.icon className="w-8 h-8 mx-auto mb-3 text-green-700" />
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Support Tools */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Career Support Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build a professional CV, prepare for interviews, and discover jobs that match your skills.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CV Builder</h3>
              <p className="text-gray-600 mb-4">Create a professional resume that stands out to employers.</p>
              <button className="text-green-700 font-medium hover:underline">Build My CV →</button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
              <p className="text-gray-600 mb-4">Practice with common interview questions and tips.</p>
              <button className="text-green-700 font-medium hover:underline">Start Practice →</button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
              <p className="text-gray-600 mb-4">Get personalized advice for your career path.</p>
              <button className="text-green-700 font-medium hover:underline">Get Advice →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-full inline-flex shadow-sm">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'companies' 
                    ? 'bg-green-700 text-white' 
                    : 'text-gray-600'
                }`}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('jobseekers')}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'jobseekers' 
                    ? 'bg-green-700 text-white' 
                    : 'text-gray-600'
                }`}
              >
                For Job Seekers
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(activeTab === 'companies' ? companyFaqs : jobSeekerFaqs).map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium">{faq.q}</span>
                  <span className="text-2xl text-gray-400">
                    {activeFaq === i ? '×' : '+'}
                  </span>
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-4">The Smarter Way to Work and Hire.</p>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            15,000+ employers trust us to find expert talent. Looking for work? Our AI builds your tailored profile in seconds, helping you connect with the right opportunities instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/register?type=employer')}
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
            >
              Start Hiring
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 border-2 border-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition"
            >
              Find Work
            </button>
          </div>
        </div>
      </section>
      <EmailSubscription />
      <Footer />
    </div>
  );
};

export default LandingPage;
