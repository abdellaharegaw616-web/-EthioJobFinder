const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of{' '}
            <span className="text-green-700">
              Service
            </span>
          </h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using EthioJobFinder, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                EthioJobFinder is a job platform connecting Ethiopian job seekers with employers. 
                We provide tools for job searching, application submission, resume uploading, and employer hiring.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                You must provide accurate and complete information when creating an account. 
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">4. Job Seeker Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate information in your profile and applications</li>
                <li>Only apply to jobs you are genuinely interested in</li>
                <li>Do not submit false or misleading information</li>
                <li>Respect employer communication and response times</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">5. Employer Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Post accurate and legitimate job listings</li>
                <li>Respond to applicants in a timely manner</li>
                <li>Do not discriminate based on protected characteristics</li>
                <li>Comply with all applicable employment laws</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-600 mb-4">Users may not:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or discriminate against other users</li>
                <li>Use the platform for illegal purposes</li>
                <li>Attempt to bypass security measures</li>
                <li>Scrape or collect data without authorization</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">7. Privacy</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">8. Payment and Billing</h2>
              <p className="text-gray-600 mb-4">
                Employers using paid features agree to our pricing terms. Payments are processed 
                securely through our payment partners. Refunds are subject to our refund policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms. 
                Users may delete their accounts at any time through their profile settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We may update these terms from time to time. We will notify users of significant changes 
                via email or platform notifications. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> abdellaj636@gmail.com<br />
                <strong>Address:</strong> Addis Ababa, Ethiopia<br />
                <strong>Phone:</strong> +125979567153 & +125945801156
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
