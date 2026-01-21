 // src/components/admin/AdminDashboard.tsx  
import React, { useState, useEffect } from 'react';
import AnimeListTable from './AnimeListTable';
import AddAnimeForm from './AddAnimeForm';
import EpisodesManager from './EpisodesManager';
import FeaturedAnimeManager from './FeaturedAnimeManager';
import ReportsManager from './ReportsManager';
import SocialMediaManager from './SocialMediaManager';
import Spinner from '../Spinner';
import axios from 'axios';

// Use correct local API base
const API_BASE = import.meta.env.VITE_API_BASE || 'https://animestar.onrender.com/api';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({ 
    totalAnimes: 0, 
    totalMovies: 0, 
    totalEpisodes: 0, 
    todayUsers: 0, 
    totalUsers: 0,
    totalManga: 0
  });
  const [user, setUser] = useState({ username: '', email: '', profileImage: '' });
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    loadInitialData();
  }, [token]);

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Loading dashboard data...', { API_BASE, tokenExists: !!token });
      
      // FIX: Check API endpoints  
      // Temporary solution: Direct backend URL use  
      const SERVER_URL = API_BASE.replace('/api', '') || 'https://animestar.onrender.com';
      
      // Try different endpoints
      try {
        // First try /api/admin/protected/user-info
        const { data: userData } = await axios.get(`${SERVER_URL}/api/admin/protected/user-info`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userData);
        console.log('✅ User info loaded:', userData);
      } catch (userErr) {
        console.log('⚠️ Could not load user info, using default');
        const username = localStorage.getItem('adminUsername') || 'Admin';
        setUser({ username, email: 'admin@animestar.com', profileImage: '' });
      }

      try {
        // Try analytics endpoint
        const { data: stats } = await axios.get(`${SERVER_URL}/api/admin/protected/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(stats);
        console.log('✅ Analytics loaded:', stats);
      } catch (statsErr) {
        console.log('⚠️ Could not load analytics, using default stats');
        // Get basic stats from anime API
        try {
          const { data: animeData } = await axios.get(`${SERVER_URL}/api/anime`);
          const animeCount = animeData.length || 0;
          
          const { data: episodeData } = await axios.get(`${SERVER_URL}/api/debug/episodes`);
          const episodeCount = episodeData.totalEpisodes || 0;
          
          setAnalytics({
            totalAnimes: animeCount,
            totalMovies: Math.floor(animeCount / 3),
            totalEpisodes: episodeCount,
            todayUsers: 0,
            totalUsers: 0,
            totalManga: 0
          });
        } catch (err) {
          // Default stats
          setAnalytics({ 
            totalAnimes: 0, 
            totalMovies: 0, 
            totalEpisodes: 0, 
            todayUsers: 0, 
            totalUsers: 0,
            totalManga: 0
          });
        }
      }
    } catch (err: any) {
      console.error('❌ Dashboard load error:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');

      if (onLogout) {
        onLogout();
      } else {
        window.location.href = '/';
      }
    }
  };

  const tabs = [
    { id: 'list', label: 'Content List', icon: '📋', component: <AnimeListTable /> },
    { id: 'add', label: 'Add Content', icon: '➕', component: <AddAnimeForm /> },
    { id: 'episodes', label: 'Episodes', icon: '🎬', component: <EpisodesManager /> },
    { id: 'featured', label: 'Featured Anime', icon: '⭐', component: <FeaturedAnimeManager /> },
    { id: 'reports', label: 'User Reports', icon: '📊', component: <ReportsManager /> },
    { id: 'social', label: 'Social Media', icon: '📱', component: <SocialMediaManager /> },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || <AnimeListTable />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#636363] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="green" />
          <p className="mt-4 text-gray-400">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#636363] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/30">
              <svg className="w-8 h-8 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Dashboard Error</h2>
            <p className="mb-4 text-gray-400">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              API URL: {API_BASE}<br/>
              Token: {token ? 'Present' : 'Missing'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={loadInitialData}
                className="bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white px-8 py-3 rounded-lg transition transform hover:scale-105 font-semibold shadow-lg border border-[#60CC3F]"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#4A4A4A] hover:bg-[#5a5a5a] text-white px-8 py-3 rounded-lg transition transform hover:scale-105 font-semibold shadow-lg border border-gray-600"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#636363] text-white flex flex-col">
      {/* Top Header */}
      <header className="bg-[#4A4A4A] border-b-2 border-[#60CC3F] shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-white">Animestar</span>
                  <span className="text-[#60CC3F] ml-1">Admin</span>
                </h1>
                <p className="text-xs text-gray-400">Content Management System</p>
              </div>
            </div>

            {/* User Info & Controls */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-[#636363] px-4 py-2 rounded-xl border border-gray-600">
                <div className="w-8 h-8 rounded-full bg-[#60CC3F]/20 flex items-center justify-center">
                  <span className="text-[#60CC3F] font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase() || '👤'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#60CC3F]">{user.username || 'Admin'}</p>
                  <p className="text-xs text-[#60CC3F]">Administrator</p>
                </div>
              </div>

              <button
                onClick={loadInitialData}
                className="bg-[#636363] hover:bg-[#5a5a5a] text-gray-400 hover:text-white px-4 py-2 rounded-lg transition border border-gray-600 flex items-center space-x-2"
                title="Refresh Data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FF5252] hover:to-[#FF6B6B] text-white px-4 py-2 rounded-lg transition border border-[#FF6B6B] flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Top Navigation Tabs */}
          <div className="mt-4">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] text-white border-[#60CC3F] shadow-lg shadow-[#60CC3F]/20'
                      : 'bg-[#636363] text-gray-400 hover:bg-[#5a5a5a] hover:text-white border border-gray-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Analytics Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Total Content</p>
            <p className="text-2xl font-bold text-white">{analytics.totalAnimes + analytics.totalMovies + analytics.totalManga}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50]" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Anime</p>
            <p className="text-2xl font-bold text-[#60CC3F]">{analytics.totalAnimes}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50]" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Movies</p>
            <p className="text-2xl font-bold text-[#9C27B0]">{analytics.totalMovies}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2]" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Manga</p>
            <p className="text-2xl font-bold text-[#FF5722]">{analytics.totalManga}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF5722] to-[#E64A19]" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Episodes</p>
            <p className="text-2xl font-bold text-[#2196F3]">{analytics.totalEpisodes}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2196F3] to-[#1976D2]" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="bg-[#4A4A4A] border border-gray-600 rounded-xl p-4 hover:border-[#60CC3F]/50 transition-colors">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Users Today</p>
            <p className="text-2xl font-bold text-[#FF9800]">{analytics.todayUsers}</p>
            <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF9800] to-[#F57C00]" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-[#4A4A4A] rounded-xl border border-gray-600 shadow-lg overflow-hidden">
          <div className="border-b border-gray-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{tabs.find(t => t.id === activeTab)?.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-sm text-gray-400">Manage and control your content</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {ActiveComponent}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#60CC3F]">
            Animestar Admin Panel • Logged in as: <span className="font-medium">{user.username}</span>
          </p>
          <p className="text-xs text-gray-700 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;