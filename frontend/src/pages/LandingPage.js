import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { Search, Building2, Users, Briefcase, Sparkles, Shield, Zap, Gift, FileText, MessageSquare } from 'lucide-react';
import EmailSubscription from '../components/EmailSubscription';

const LandingPage = () => {
  const { jobs, fetchJobs } = useJobs();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);

  // Quick filters matching Screenshot 2
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');

  const filteredJobs = jobs.filter(j => {
    if (selectedLevel && j.experienceLevel !== selectedLevel) return false;
    if (selectedFunction && j.category !== selectedFunction) return false;
    if (selectedEmployment && j.type !== selectedEmployment) return false;
    if (selectedLocation && !j.location?.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedEducation && !j.educationRequired?.toLowerCase().includes(selectedEducation.toLowerCase())) return false;
    if (searchTerm && !j.title?.toLowerCase().includes(searchTerm.toLowerCase()) && !j.company?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    fetchJobs({ limit: 6 });
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(selectedLocation)}`);
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Banner */}
      {bannerVisible && (
        <div className="bg-orange-500 text-white py-2 px-4 text-center relative shadow-sm">
          <p className="text-sm font-medium">
            Want to Apply Easily From Your Phone? Join Our Telegram Channel!{' '}
            <a 
              href="https://t.me/ethiojobfinder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-bold hover:text-orange-100"
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

      {/* Hero Section matching Screenshot 1 */}
      <section 
        className="relative bg-gray-900 text-white min-h-[460px] sm:min-h-[520px] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url('/images/hero-bg.jpg')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-md">
              FIND YOUR <br />
              <span className="text-blue-500">PERFECT JOB</span> <br />
              EASILY
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 font-medium max-w-lg">
              Connecting Ethiopian job seekers with verified employers across Addis Ababa, Hawassa, and nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Quick Dropdown Filters matching Screenshot 2 */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-blue-600/20"
            >
              Search
            </button>
          </form>

          {/* Dropdown filters matching Screenshot 2 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">job level ▾</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>

            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">Job function ▾</option>
              <option value="IT & Software">Software / IT</option>
              <option value="Finance">Banking & Finance</option>
              <option value="Marketing">Marketing / Graphics</option>
              <option value="Engineering">Engineering</option>
            </select>

            <select
              value={selectedEmployment}
              onChange={(e) => setSelectedEmployment(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">Employment ▾</option>
              <option value="full-time">Permanent / Full-time</option>
              <option value="contract">Temporary / Contract</option>
              <option value="remote">Remote</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">location ▾</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Hawassa">Hawassa</option>
              <option value="Adama">Adama</option>
              <option value="Bahir Dar">Bahir Dar</option>
              <option value="Dire Dawa">Dire Dawa</option>
            </select>

            <select
              value={selectedEducation}
              onChange={(e) => setSelectedEducation(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">Education ▾</option>
              <option value="Bachelor">Bachelor's Degree</option>
              <option value="Diploma">Diploma / TVET</option>
              <option value="Master">Master's Degree</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Section matching Screenshot 2 */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            {filteredJobs.length > 0 ? (
              filteredJobs.slice(0, 6).map((job, idx) => {
                const categoryTag = job.category === 'IT & Software' ? 'software' 
                  : job.category === 'Finance' ? 'bank' 
                  : job.category === 'Marketing' ? 'graphics'
                  : (job.category || 'general').toLowerCase();

                const employmentTag = (job.type === 'contract' || job.type === 'internship') ? 'temporary' : 'permanent';
                const expTag = job.experienceLevel === 'entry' ? '0+ years' : job.experienceLevel === 'mid' ? '1+ years' : '2+ years';

                return (
                  <div key={job._id || idx} className="py-5 first:pt-2 last:pb-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {job.company || job.postedBy?.companyName || 'Ethio job finder'}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Link 
                            to={`/jobs/${job._id}`}
                            className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {job.title}
                          </Link>
                          <span className="bg-[#00adef] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {categoryTag}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                            employmentTag === 'temporary' 
                              ? 'bg-[#f59e0b] text-white' 
                              : 'bg-[#eab308] text-gray-900'
                          }`}>
                            {employmentTag}
                          </span>
                          <span className="bg-[#0284c7] text-white px-3 py-0.5 rounded-full text-xs font-bold">
                            {expTag}
                          </span>
                          <span className="bg-[#18181b] text-white px-3 py-0.5 rounded-full text-xs font-bold">
                            {job.location || 'Addis Ababa'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                        >
                          view detail about the job
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                No vacancies match the selected filters.{' '}
                <button 
                  onClick={() => { setSelectedLevel(''); setSelectedFunction(''); setSelectedEmployment(''); setSelectedLocation(''); setSelectedEducation(''); setSearchTerm(''); }} 
                  className="text-blue-500 underline ml-1 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:underline">
              Browse all vacancies →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner matching Screenshot 3 */}
      <section 
        className="relative py-16 text-white bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.90)), url('/images/cta-banner.jpg')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-3">
                LET'S START YOUR NEW JOB WITH US
              </h2>
              <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
                When looking for a job, it's important to minimize the time spent on activities that don't contribute to your job search efforts.
              </p>
            </div>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-extrabold rounded-xl shadow-lg transition shrink-0 text-center text-sm"
            >
              Join now
            </Link>
          </div>
        </div>
      </section>

      {/* Slider Banner matching Screenshot 4 */}
      <section 
        className="relative py-24 text-white bg-cover bg-center text-center overflow-hidden"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('/images/typing-banner.jpg')" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 drop-shadow">
            GET IMMEDIATE JOB RELEASES
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto mb-6">
            Subscribe for instant notifications on newly published Ethiopian vacancies across tech, banking, and creative industries.
          </p>
          {/* Slider navigation dots matching Screenshot 4 */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-1 bg-white rounded-full"></span>
            <span className="w-8 h-1 bg-white/40 rounded-full"></span>
            <span className="w-8 h-1 bg-white/40 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* Career Advice & Blog Section matching Screenshot 4 */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
              <img 
                src="/images/blog-happy-work.jpg" 
                alt="How to enjoy your works" 
                className="w-full h-52 object-cover" 
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#f59e0b] mb-2">
                    How to enjoy your works
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                </div>
                <div>
                  <Link
                    to="/blog/1"
                    className="inline-block border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
              <img 
                src="/images/blog-interview-tips.jpg" 
                alt="10 tips for technical interviews" 
                className="w-full h-52 object-cover" 
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#f59e0b] mb-2">
                    10 tips for technical interviews
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                </div>
                <div>
                  <Link
                    to="/blog/2"
                    className="inline-block border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
              <img 
                src="/images/blog-time-management.jpg" 
                alt="managing time effectively" 
                className="w-full h-52 object-cover" 
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#f59e0b] mb-2">
                    managing time effectively
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                </div>
                <div>
                  <Link
                    to="/blog/3"
                    className="inline-block border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Top Companies Hiring</h2>
            <p className="text-gray-600 dark:text-gray-300">Join leading organizations in Ethiopia</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Dashen Bank', logo: 'D' },
              { name: 'Safaricom Ethiopia', logo: 'S' },
              { name: 'Ethiopian Airlines', logo: 'E' },
              { name: 'Awash Bank', logo: 'A' },
              { name: 'Tele Ethiopia', logo: 'T' }
            ].map((company, i) => (
              <Link key={i} to={`/jobs?company=${encodeURIComponent(company.name)}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition cursor-pointer">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">{company.logo}</span>
                </div>
                <p className="font-medium text-sm dark:text-white">{company.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Job Categories</h2>
            <p className="text-gray-600 dark:text-gray-300">Explore opportunities by industry</p>
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
                <Link key={i} to="/jobs" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <p className="font-medium text-sm dark:text-white">{category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">How it works</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Whether you're here to grow your team or find your next opportunity, EthioJobFinder makes the process simple, fast, and hassle-free.
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full inline-flex">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-8 py-3 rounded-full font-medium transition ${
                  activeTab === 'companies' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('jobseekers')}
                className={`px-8 py-3 rounded-full font-medium transition ${
                  activeTab === 'jobseekers' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">CREATE A JOB POST</h3>
                      <p className="text-gray-600 dark:text-gray-300">Post your job with details, requirements, and budget in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">FIND TALENT</h3>
                      <p className="text-gray-600 dark:text-gray-300">Review applications and connect with qualified candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">HIRED!</h3>
                      <p className="text-gray-600 dark:text-gray-300">Interview, hire, and onboard your new team member</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">CREATE ACCOUNT</h3>
                      <p className="text-gray-600 dark:text-gray-300">Build your profile and upload your resume in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">FIND YOUR JOB</h3>
                      <p className="text-gray-600 dark:text-gray-300">Browse thousands of jobs and apply with one click</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">GET HIRED!</h3>
                      <p className="text-gray-600 dark:text-gray-300">Land your dream job and start your new career</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <div className="bg-orange-500 rounded-lg p-8 text-white">
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-orange-500 dark:text-orange-400 font-medium mb-2">EthioJobFinder through the eyes of hiring teams</p>
              <h2 className="text-3xl font-bold dark:text-white">Hear what our customers<br />are saying</h2>
            </div>
            <button 
              onClick={() => navigate('/jobs')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline"
            >
              See all stories
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{t.companyLogo}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 dark:text-white">
                Find Work. Get Paid.<br />
                Own Your Future.
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Access verified opportunities from real businesses. Discover different work opportunities every day and apply in minutes.
              </p>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold dark:text-white">{f.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
                  <s.icon className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <p className="text-3xl font-bold dark:text-white">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Support Tools */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Career Support Tools</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Build a professional CV, prepare for interviews, and discover jobs that match your skills.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">CV Builder</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Create a professional resume that stands out to employers.</p>
              <Link to="/resume-builder" className="inline-flex items-center gap-2 text-orange-500 dark:text-orange-400 font-medium hover:text-orange-600 dark:hover:text-orange-300 transition-colors">Build My CV →</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Interview Preparation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Practice with common interview questions and tips.</p>
              <Link to="/help" className="inline-flex items-center gap-2 text-orange-500 dark:text-orange-400 font-medium hover:text-orange-600 dark:hover:text-orange-300 transition-colors">Start Practice →</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Career Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get personalized advice for your career path.</p>
              <Link to="/help" className="inline-flex items-center gap-2 text-orange-500 dark:text-orange-400 font-medium hover:text-orange-600 dark:hover:text-orange-300 transition-colors">Get Advice →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-full inline-flex shadow-sm">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'companies' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('jobseekers')}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === 'jobseekers' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                For Job Seekers
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(activeTab === 'companies' ? companyFaqs : jobSeekerFaqs).map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium dark:text-white">{faq.q}</span>
                  <span className="text-2xl text-gray-400 dark:text-gray-500">
                    {activeFaq === i ? '×' : '+'}
                  </span>
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">The Smarter Way to Work and Hire.</p>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            15,000+ employers trust us to find expert talent. Looking for work? Our AI builds your tailored profile in seconds, helping you connect with the right opportunities instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/register?type=employer')}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
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
    </div>
  );
};

export default LandingPage;
