import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters');
      return;
    }

    setStatus('loading');

    try {
      await authService.resetPassword(token, password);
      setStatus('success');
      setMessage('Password reset successful! You can now log in with your new password.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-green-600">Success!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{message}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
