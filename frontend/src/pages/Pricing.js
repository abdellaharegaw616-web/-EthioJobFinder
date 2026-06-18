import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Sparkles, Building2, Crown, ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFaq, setActiveFaq] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const faqs = [
    { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.' },
    { q: 'Is there a free trial for paid plans?', a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.' },
    { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, bank transfers, Telebirr, and CBE Birr for Ethiopian customers.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.' },
    { q: 'Can I post jobs for free?', a: 'Yes! The Free plan allows you to post up to 3 active jobs at a time with basic features.' },
    { q: 'What happens when my subscription ends?', a: 'Your job postings remain active for 30 days. You can renew anytime or downgrade to the Free plan.' },
    { q: 'Do you offer custom enterprise solutions?', a: 'Absolutely! Contact our sales team for tailored solutions including dedicated support, custom integrations, and volume discounts.' }
  ];

  const plans = [
    {
      name: 'Free',
      icon: Building2,
      description: 'Perfect for small businesses getting started',
      price: { monthly: 0, yearly: 0 },
      features: [
        { text: '3 active job postings', included: true },
        { text: 'Basic candidate profiles', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Standard support', included: true },
        { text: 'Application tracking', included: false },
        { text: 'Resume database access', included: false },
        { text: 'Featured job listings', included: false },
        { text: 'Priority support', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'API access', included: false }
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Professional',
      icon: Sparkles,
      description: 'For growing companies with regular hiring needs',
      price: { monthly: 2999, yearly: 29990 },
      features: [
        { text: 'Unlimited job postings', included: true },
        { text: 'Full candidate profiles', included: true },
        { text: 'Email & SMS notifications', included: true },
        { text: 'Priority support', included: true },
        { text: 'Application tracking', included: true },
        { text: 'Resume database access (100/month)', included: true },
        { text: 'Featured job listings (5/month)', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Company profile page', included: true },
        { text: 'API access', included: false }
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'For large organizations with advanced needs',
      price: { monthly: 9999, yearly: 99990 },
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Unlimited resume database', included: true },
        { text: 'Unlimited featured listings', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White-label options', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'API access', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handleCta = (planName) => {
    if (!isAuthenticated) {
      navigate('/register?type=employer');
    } else if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@ethiojobfinder.com?subject=Enterprise Plan Inquiry';
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your hiring needs. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-200 rounded-full transition-colors"
              style={{ backgroundColor: billingCycle === 'yearly' ? '#f97316' : '#e5e7eb' }}
            >
              <span
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform"
                style={{ transform: billingCycle === 'yearly' ? 'translateX(32px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              Save 17%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 -mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isHovered = hoveredPlan === index;
              
              return (
                <div
                  key={plan.name}
                  onMouseEnter={() => setHoveredPlan(index)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                    plan.popular 
                      ? 'shadow-2xl border-2 border-pink-500 scale-105 z-10' 
                      : 'shadow-lg border border-gray-100 hover:shadow-xl'
                  } ${isHovered && !plan.popular ? 'scale-105 z-10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-orange-400 to-pink-500' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold">
                        {plan.price[billingCycle] === 0 ? 'Free' : `ETB ${plan.price[billingCycle].toLocaleString()}`}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      )}
                    </div>
                    {plan.price[billingCycle] > 0 && billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ETB {(plan.price.monthly * 12 - plan.price.yearly).toLocaleString()}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCta(plan.name)}
                    className={`w-full py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg'
                        : 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-6 font-semibold">Features</th>
                    <th className="p-6 text-center font-semibold">Free</th>
                    <th className="p-6 text-center font-semibold bg-pink-50">Professional</th>
                    <th className="p-6 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Active Job Postings', '3', 'Unlimited', 'Unlimited'],
                    ['Resume Database Access', '—', '100/month', 'Unlimited'],
                    ['Featured Job Listings', '—', '5/month', 'Unlimited'],
                    ['Application Tracking', '—', '✓', '✓'],
                    ['Analytics Dashboard', '—', 'Basic', 'Advanced'],
                    ['Support', 'Email', 'Priority', '24/7 Dedicated'],
                    ['API Access', '—', '—', '✓'],
                    ['Custom Integrations', '—', '—', '✓'],
                    ['White-label', '—', '—', '✓'],
                    ['SLA Guarantee', '—', '—', '✓']
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-4 text-gray-700">{row[0]}</td>
                      <td className="p-4 text-center text-gray-600">{row[1]}</td>
                      <td className="p-4 text-center bg-pink-50/50 text-gray-900 font-medium">{row[2]}</td>
                      <td className="p-4 text-center text-gray-600">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Job Seekers Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            For{' '}
            <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
              Job Seekers
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Great news! It\'s completely <strong>FREE</strong> to apply for jobs on EthioJobFinder.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-green-800">Free Forever</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Create professional profile</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Apply to unlimited jobs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Upload multiple resumes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Get job alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Track applications</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-purple-800">Premium (Coming Soon)</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>AI Resume Builder</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Profile highlighting</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Priority application</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Skills assessment</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Career coaching</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
            >
              Browse Jobs Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-center mb-12">Everything you need to know about our pricing</p>
          
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-pink-500" />
                    {faq.q}
                  </span>
                  {activeFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 pl-14">
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
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8">
            Our team is here to help you choose the right plan for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:support@ethiojobfinder.com"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
            >
              Contact Sales
            </a>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 border-2 border-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition"
            >
              View Job Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
