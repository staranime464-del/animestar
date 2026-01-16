 // src/components/admin/AdminLogin.tsx - UPDATED WITH DEBUG LOGS
import React, { useState } from 'react';
import axios from 'axios';

// ✅ FIX: Use environment variable or direct URL
const API_URL = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:3000';

interface AdminLoginProps {
  onLogin: (token: string, username: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState({ username: 'admin', password: 'Anime2121818144' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      console.log('🔐 Attempting login with:', {
        username: form.username,
        passwordLength: form.password.length,
        apiUrl: `${API_URL}/api/admin/login`,
        timestamp: new Date().toISOString()
      });

      const { data } = await axios.post(`${API_URL}/api/admin/login`, form, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Login response:', data);
      
      if (data.success) {
        console.log('✅ Login successful, calling onLogin');
        
        // ✅ FIXED: onLogin call karo, wo App.tsx mein navigate kar dega
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username);
        
        console.log('✅ Local storage set, calling onLogin...');
        
        // Call the onLogin function passed from App.tsx
        onLogin(data.token, data.username);
        
        console.log('✅ onLogin called successfully');
        
      } else {
        setError(data.error || 'Login failed');
        setDebugInfo(`Server responded with success: false. Message: ${data.message}`);
      }
    } catch (err: any) {
      console.error('❌ Login error details:', {
        error: err,
        response: err.response,
        message: err.message,
        code: err.code
      });
      
      let errorMessage = 'Login failed. Check credentials and try again.';
      let debugInfo = '';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
        debugInfo = `Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'No response from server. Check if backend is running.';
        debugInfo = `Request made to: ${API_URL}/api/admin/login, but no response received.`;
      } else {
        // Request setup error
        errorMessage = err.message || 'Error setting up request';
        debugInfo = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setDebugInfo(debugInfo);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setDebugInfo('Testing connection...');
      const response = await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
      setDebugInfo(`✅ Server is running! Status: ${response.data.status}`);
    } catch (err: any) {
      setDebugInfo(`❌ Server not reachable: ${err.message}`);
    }
  };

  const emergencyReset = async () => {
    try {
      setDebugInfo('Attempting emergency reset...');
      const response = await axios.get(`${API_URL}/api/admin/emergency-reset`);
      setDebugInfo(`✅ Emergency reset: ${response.data.message}`);
    } catch (err: any) {
      setDebugInfo(`❌ Emergency reset failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-8 w-full max-w-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Admin Login
        </h2>
        <p className="text-blue-300/70 text-center mb-6">
          AnimeStar Dashboard
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-blue-900/30 border border-blue-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-blue-900/30 border border-blue-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              <strong>Error:</strong> {error}
              {debugInfo && (
                <div className="mt-1 text-xs opacity-75">
                  <details>
                    <summary className="cursor-pointer">Debug Info</summary>
                    {debugInfo}
                  </details>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            onClick={testConnection}
            className="w-full bg-blue-800/30 hover:bg-blue-700/30 border border-blue-700/50 text-blue-300 py-2 rounded-lg text-sm transition"
          >
            Test Server Connection
          </button>
          
          <button
            onClick={emergencyReset}
            className="w-full bg-red-900/20 hover:bg-red-800/20 border border-red-700/50 text-red-300 py-2 rounded-lg text-sm transition"
          >
            Emergency Admin Reset
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-800/20 rounded-lg border border-blue-700/30">
          <p className="text-blue-400/70 text-sm text-center mb-2">
            <strong>Default Credentials:</strong>
          </p>
          <div className="text-center space-y-1">
            <p className="text-blue-300 text-sm">
              Username: <code className="bg-blue-900/50 px-2 py-1 rounded">admin</code>
            </p>
            <p className="text-blue-300 text-sm">
              Password: <code className="bg-blue-900/50 px-2 py-1 rounded">Anime2121818144</code>
            </p>
          </div>
          <div className="mt-2 text-center">
            <p className="text-blue-400/50 text-xs">
              API URL: <code className="bg-blue-900/50 px-2 py-1 rounded text-xs">{API_URL}/api/admin/login</code>
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-blue-400/50 text-center">
          <p>Make sure backend server is running on port 3000</p>
          <p>Check console (F12) for detailed error logs</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;