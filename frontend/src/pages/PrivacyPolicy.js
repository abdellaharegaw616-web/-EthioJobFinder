const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
            Privacy{' '}
            <span className="text-green-700">
              Policy
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">1. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                EthioJobFinder collects information you provide directly to us, including when you create an account, post a job, apply for a job, or communicate with us. This may include your name, email address, phone number, resume, and other information you choose to provide.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">2. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use the information we collect to provide, maintain, and improve our services, process job applications, communicate with you about job opportunities, and comply with legal obligations.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">3. Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may share your information with employers when you apply for jobs. We do not sell your personal information to third parties. We may share information with service providers who assist us in operating our platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">4. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">5. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have the right to access, update, or delete your personal information. You can do this by logging into your account or contacting us directly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">6. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy, please contact us at abdellaj636@gmail.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
