import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (!password || !confirmPassword) {
      setStatus('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      setStatus(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to reset password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 relative overflow-hidden">
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
        <h2 className="text-2xl font-bold text-red-700 mb-4">Reset Your Password</h2>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {status && <div className="mt-2 text-sm text-red-700">{status}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
