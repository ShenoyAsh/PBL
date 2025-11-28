import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { success } = await login({ email, password });
    
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 relative overflow-hidden">
          {/* Animated blood donation background */}
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Blood Donation" className="absolute inset-0 w-full h-full object-cover opacity-30 animate-bg-fade" style={{zIndex:0}} />
          <style>{`
            @keyframes bg-fade {
              0% { opacity: 0.2; }
              50% { opacity: 0.35; }
              100% { opacity: 0.2; }
            }
            .animate-bg-fade {
              animation: bg-fade 8s infinite alternate;
            }
          `}</style>
          <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 flex flex-col items-center z-10 animate-slide-in">
            <style>{`
              @keyframes slide-in {
                0% { transform: translateY(40px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }
              .animate-slide-in {
                animation: slide-in 1.2s cubic-bezier(0.4,0,0.2,1);
              }
            `}</style>
            <div className="flex flex-col items-center">
              <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3Jhd3BpeGVsX29mZmljZV80MV9waG90b19vZl9yZWFsaXN0aWNfYmxvb29kX2Ryb3BfY29tcGxldGVseV9pc181MGI0ZGVkYi0yM2Q1LTQwMjItYjdlZC03MjRiMGY2MTQ2N2YucG5n.png" alt="Blood Drop" className="w-16 h-16 mb-2 animate-bounce" />
              <h2 className="mt-2 text-center text-3xl font-extrabold text-red-700 drop-shadow-lg">Sign in to LifeLink</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link
                  to="/register"
                  className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
                >
                  create a new account
                </Link>
              </p>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-pulse" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="transition-transform duration-300 hover:scale-105">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Email address"
                    value={email}
                    onChange={onChange}
                  />
                </div>
                <div className="transition-transform duration-300 hover:scale-105">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200 underline"
                    onClick={() => setShowResetModal(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          {/* Password Reset Modal */}
          </div>
        </div>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm animate-slide-in">
              <h3 className="text-xl font-bold mb-2 text-red-700">Reset Password</h3>
              <p className="mb-4 text-sm text-gray-600">Enter your registered email to receive a password reset link.</p>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Email address"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
              />
              <button
                className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                onClick={async () => {
                  setResetStatus('');
                  try {
                    const res = await axios.post('/api/auth/request-password-reset', { email: resetEmail });
                    setResetStatus(res.data.message || 'Reset link sent!');
                  } catch (err) {
                    setResetStatus(err.response?.data?.message || 'Failed to send reset link');
                  }
                }}
                disabled={!resetEmail}
              >
                Send Reset Link
              </button>
              {resetStatus && <div className="mt-2 text-sm text-green-700">{resetStatus}</div>}
              <button
                className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => { setShowResetModal(false); setResetEmail(''); setResetStatus(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
};

export default Login;
