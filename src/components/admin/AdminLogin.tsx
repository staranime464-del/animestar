 // src/components/admin/AdminLogin.tsx - UPDATED: NO DEFAULT CREDENTIALS
import React, { useState } from 'react';
import axios from 'axios';

// ✅ FIX: Use environment variable or direct URL
const API_URL = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:3000';

interface AdminLoginProps {
  onLogin: (token: string, username: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' }); // ✅ EMPTY INITIAL VALUES
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ✅ VALIDATION: Ensure both fields are filled
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/admin/login`, form, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (data.success) {
        // ✅ SIMPLIFIED: Just call onLogin, App.tsx will handle the rest
        onLogin(data.token, data.username);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #60CC3F, #4CAF50);
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          font-weight: bold;
          z-index: 99999;
          box-shadow: 0 5px 15px rgba(96, 204, 63, 0.3);
          animation: fadeInOut 3s ease-in-out;
          font-size: 16px;
        `;
        notification.innerHTML = '✅ Login Successful! Loading Admin Dashboard...';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      let errorMessage = 'Login failed. Check credentials and try again.';
      
      if (err.response) {
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = err.message || 'Error setting up request';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#636363] flex items-center justify-center p-4">
      <div className="bg-[#4A4A4A] border-2 border-gray-600 rounded-xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <span className="text-white">Animestar</span>
            <span className="text-[#60CC3F] ml-1">Admin</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Secure Admin Portal
          </p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#60CC3F] focus:border-[#60CC3F] transition"
                placeholder="Enter admin username"
                required
                autoComplete="off"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#60CC3F] focus:border-[#60CC3F] transition"
                placeholder="Enter admin password"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg border border-[#60CC3F]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Dashboard
              </div>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-[#636363] rounded-lg border border-gray-700">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-[#60CC3F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-[#60CC3F] text-sm font-semibold">
              Security Notice
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              • Enter your admin credentials manually
            </p>
            <p className="text-gray-400 text-sm">
              • Credentials are not pre-filled for security
            </p>
            <p className="text-gray-400 text-sm">
              • Contact system administrator for access
            </p>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
              <span>No Auto-fill</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;