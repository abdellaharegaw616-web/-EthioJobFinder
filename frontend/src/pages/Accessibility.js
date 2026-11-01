import { Link } from 'react-router-dom';
import { Eye, CheckCircle, ShieldCheck, HeartHandshake, Mail, Phone, Sparkles } from 'lucide-react';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gray-50 dark:bg-gray-800/80 py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold mb-4">
            <Eye className="w-4 h-4" /> Inclusive Access for Everyone
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
            Accessibility <span className="text-orange-500">Statement</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            EthioJobFinder is committed to ensuring digital accessibility for all Ethiopian job seekers and employers, 
            regardless of ability, device, or assistive technology.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {/* Commitment */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              Our Standards & Compliance
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We continually improve the user experience for everyone and apply the relevant accessibility standards. 
              Our web platform aims to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              These guidelines explain how to make web content more accessible for people with a wide range of disabilities, 
              including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Keyboard Navigation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                All interactive features, buttons, search filters, and application flows can be navigated smoothly using standard keyboard controls (Tab, Shift+Tab, Enter, Escape).
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">High Contrast & Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                EthioJobFinder includes native support for high-contrast light and dark themes, ensuring optimal readability and reduced eye strain across all environments.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Screen Reader Compatibility</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Semantic HTML5 landmarks, explicit ARIA labels, descriptive image alt text, and form input associations are implemented for NVDA, JAWS, and VoiceOver.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Responsive & Zoom Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Layouts adapt fluidly from mobile phones to 4K displays and maintain clarity even when browser text zoom is increased up to 200%.
              </p>
            </div>
          </div>

          {/* Feedback & Assistance */}
          <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3 text-orange-950 dark:text-orange-200">
              <HeartHandshake className="w-6 h-6 text-orange-500" />
              Need Assistance or Have Feedback?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you experience any difficulty accessing content or functionality on EthioJobFinder, please reach out to us. 
              We take accessibility feedback seriously and aim to resolve issues promptly.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:aserhailu2020@gmail.com?subject=Accessibility%20Support" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
              >
                <Mail className="w-4 h-4" /> Email: aserhailu2020@gmail.com
              </a>
              <a 
                href="tel:+251953101912" 
                className="inline-flex items-center gap-2 px-6 py-3 border border-orange-300 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-xl font-medium transition"
              >
                <Phone className="w-4 h-4" /> Call: +251953101912
              </a>
            </div>
          </div>

          <div className="text-center pt-8">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline">
              <Sparkles className="w-4 h-4" /> Return to Job Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accessibility;
