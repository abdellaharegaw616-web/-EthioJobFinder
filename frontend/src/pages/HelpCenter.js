import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, FileText, User, Building2, Shield, CreditCard } from 'lucide-react';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('jobseekers');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'jobseekers', name: 'For Job Seekers', icon: User },
    { id: 'employers', name: 'For Employers', icon: Building2 },
    { id: 'account', name: 'Account & Security', icon: Shield },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCard }
  ];

  const faqs = {
    jobseekers: [
      { q: 'How do I create a profile?', a: 'Click "Register" and select "Job Seeker". Fill in your details, upload your resume, and complete your profile to start applying for jobs.' },
      { q: 'Is it free to apply for jobs?', a: 'Yes! Applying for jobs on EthioJobFinder is completely free for all job seekers.' },
      { q: 'How do I upload my resume?', a: 'Go to your Profile page, click "Upload Resume" and select your PDF file. You can upload multiple resumes.' },
      { q: 'How long does the hiring process take?', a: 'Most employers respond within 3-5 business days. You can track your application status in real-time on your Dashboard.' },
      { q: 'Can I work remotely through EthioJobFinder?', a: 'Absolutely! Many employers offer remote and hybrid positions. Use the "Remote" filter when searching for jobs.' },
      { q: 'How do I get job alerts?', a: 'Set up your job preferences in your profile. We\'ll email you when matching jobs are posted.' }
    ],
    employers: [
      { q: 'How do I post a job?', a: 'Register as an employer, then click "Post Job" in the navigation. Fill in job details and publish.' },
      { q: 'How much does it cost to post jobs?', a: 'You can post up to 3 jobs for free. For unlimited postings, check our Pricing page for affordable plans.' },
      { q: 'How do I view applicant resumes?', a: 'All applications appear in your Dashboard. Click on any applicant to view their full profile and resume.' },
      { q: 'Can I edit a job posting after publishing?', a: 'Yes! Go to your Dashboard, find the job, and click "Edit" to make changes.' },
      { q: 'How do I contact applicants?', a: 'Use the messaging feature in your Dashboard or email applicants directly through their profile.' },
      { q: 'What is featured job posting?', a: 'Featured jobs appear at the top of search results and get 3x more views. Available on Professional and Enterprise plans.' }
    ],
    account: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the email instructions to reset.' },
      { q: 'How do I change my email address?', a: 'Go to Profile Settings and update your email. You\'ll need to verify the new address.' },
      { q: 'Is my data secure?', a: 'Yes! We use industry-standard encryption and never share your personal information with third parties without consent.' },
      { q: 'How do I delete my account?', a: 'Contact support@ethiojobfinder.com with your request. We\'ll process it within 48 hours.' },
      { q: 'Can I have both job seeker and employer accounts?', a: 'Yes, but you need separate email addresses for each account type.' }
    ],
    billing: [
      { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, bank transfers, Telebirr, and CBE Birr for Ethiopian customers.' },
      { q: 'How do I upgrade my plan?', a: 'Go to Pricing page, select your plan, and complete payment. Your account upgrades instantly.' },
      { q: 'Can I get a refund?', a: 'We offer a 30-day money-back guarantee for all paid plans. Contact support for refund requests.' },
      { q: 'How do I cancel my subscription?', a: 'Go to your Dashboard > Billing and click "Cancel Subscription". You can use the service until the billing period ends.' },
      { q: 'Do you offer invoices?', a: 'Yes! All payments include downloadable invoices for your records.' }
    ]
  };

  const guides = [
    { title: 'Getting Started Guide', icon: FileText, desc: 'Learn the basics of using EthioJobFinder' },
    { title: 'Resume Writing Tips', icon: User, desc: 'Create a resume that stands out' },
    { title: 'Interview Preparation', icon: MessageCircle, desc: 'Ace your next job interview' },
    { title: 'Hiring Best Practices', icon: Building2, desc: 'Attract and hire top talent' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              help you?
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">Search our knowledge base or browse categories below</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-pink-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-6 rounded-2xl border-2 transition text-left ${
                    activeCategory === cat.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${activeCategory === cat.id ? 'text-pink-500' : 'text-gray-400'}`} />
                  <h3 className="font-semibold">{cat.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">
            {categories.find(c => c.id === activeCategory)?.name} - FAQs
          </h2>
          
          <div className="space-y-3">
            {faqs[activeCategory].map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50"
                >
                  <span className="font-medium">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 bg-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, i) => {
              const Icon = guide.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                  <Icon className="w-10 h-10 text-pink-500 mb-4" />
                  <h3 className="font-semibold mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-500">{guide.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a href="mailto:abdellaj636@gmail.com" className="p-6 border rounded-xl hover:border-pink-500 transition">
              <Mail className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-gray-500">abdellaj636@gmail.com</p>
            </a>
            <a href="tel:+125979567153" className="p-6 border rounded-xl hover:border-pink-500 transition">
              <Phone className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-gray-500">+125979567153 & +125945801156</p>
            </a>
            <a href="https://t.me/ethiojobfinder" target="_blank" rel="noopener noreferrer" className="p-6 border rounded-xl hover:border-pink-500 transition">
              <MessageCircle className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Telegram</h3>
              <p className="text-sm text-gray-500">@ethiojobfinder</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
