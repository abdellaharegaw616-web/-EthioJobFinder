import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would call an API to subscribe the email
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]');
      
      if (subscriptions.includes(email)) {
        setStatus('error');
        setMessage('This email is already subscribed.');
      } else {
        subscriptions.push(email);
        localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions));
        setStatus('success');
        setMessage('Successfully subscribed to weekly job updates!');
        setEmail('');
      }
    }, 1000);
  };

  return (
    <div className="bg-green-700 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Mail className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
        <p className="text-green-100 mb-6">
          Subscribe to receive weekly job updates and career tips directly in your inbox.
        </p>

        {status === 'success' ? (
          <div className="bg-green-600 rounded-lg p-4 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="mt-3 text-red-200 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        <p className="text-green-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default EmailSubscription;
