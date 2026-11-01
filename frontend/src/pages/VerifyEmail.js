import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import authService from '../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      await authService.verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Verifying...</h2>
            <p className="text-gray-600 dark:text-gray-300">Please wait while we verify your email.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-orange-500 dark:text-orange-400">Success!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            <Link 
              to="/login"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md transition"
            >
              Continue to Login
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            <div className="space-y-3">
              <Link 
                to="/login"
                className="inline-block px-6 py-3 border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl font-semibold transition"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
