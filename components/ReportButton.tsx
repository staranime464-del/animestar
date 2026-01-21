 // components/ReportButton.tsx - UPDATED FOR ANIMESTAR DARK GRAY + GREEN THEME
import React, { useState } from 'react';
import axios from 'axios';
import { createPortal } from "react-dom";

const API_BASE = 'https://animestar.onrender.com/api';

interface ReportButtonProps {
  animeId: string;
  episodeId?: string;
  episodeNumber?: number;
  animeTitle: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ 
  animeId, 
  episodeId, 
  episodeNumber, 
  animeTitle 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!issueType) return setMessage('Please select an issue type');
    if (!description || description.trim().length < 10)
      return setMessage('Description must be at least 10 characters');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMessage('Invalid email address');

    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE}/reports`, {
        animeId,
        episodeId: episodeId || null,
        episodeNumber: episodeNumber || null,
        issueType,
        description: description.trim(),
        email: email || 'Not provided',
        username: username || 'Anonymous'
      });

      if (res.data.success) {
        setMessage('Report submitted successfully!');
        setTimeout(() => {
          setShowModal(false);
          setMessage('');
          setIssueType('');
          setDescription('');
          setEmail('');
          setUsername('');
        }, 2500);
      }

    } catch (err: any) {
      setMessage('Failed to submit report. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      setMessage('');
      setIssueType('');
      setDescription('');
      setEmail('');
      setUsername('');
    }, 300);
  };

  return (
    <>
      {/* Enhanced icon button */}
      <button
        onClick={handleButtonClick}
        className="bg-gradient-to-br from-[#636363] to-[#4A4A4A] hover:from-[#FF6B6B] hover:to-[#FF5252] text-white p-2 rounded-lg shadow-lg border border-gray-600 hover:border-[#FF6B6B] transition-all duration-200 group relative"
        title="Report Issue"
      >
        <span className="text-sm transition-transform group-hover:scale-110">🚨</span>
        {/* Tooltip */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#4A4A4A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-gray-600">
          Report Issue
        </div>
      </button>

      {/* ENHANCED MODAL WITH DARK GRAY + GREEN THEME */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Animated Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={handleClose}
            />

            {/* Enhanced Center Popup */}
            <div className="relative bg-gradient-to-br from-[#636363] to-[#4A4A4A] w-full max-w-md rounded-2xl shadow-2xl border border-gray-600 p-6 z-[10000] max-h-[85vh] overflow-y-auto animate-in fade-in-90 zoom-in-90 duration-300">
              
              {/* Enhanced Header */}
              <div className="flex justify-between items-start border-b border-gray-600/50 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-[#FF6B6B] rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-white">Report Issue</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {animeTitle} {episodeNumber ? ` - Episode ${episodeNumber}` : ''}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600/50 transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {/* Enhanced Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Optional Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                      Email <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm transition-all duration-200 focus:border-[#60CC3F] focus:ring-2 focus:ring-[#60CC3F]/20 focus:bg-[#636363] placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                      Username <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm transition-all duration-200 focus:border-[#60CC3F] focus:ring-2 focus:ring-[#60CC3F]/20 focus:bg-[#636363] placeholder-gray-500"
                      placeholder="Anonymous"
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                    Issue Type <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm transition-all duration-200 focus:border-[#60CC3F] focus:ring-2 focus:ring-[#60CC3F]/20 focus:bg-[#636363] appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#4A4A4A]">Select Issue Type</option>
                    <option value="Link Not Working" className="bg-[#4A4A4A]">Download Link Not Working</option>
                    <option value="Wrong Episode" className="bg-[#4A4A4A]">Wrong Episode Content</option>
                    <option value="Poor Quality" className="bg-[#4A4A4A]">Poor Video Quality</option>
                    <option value="Audio Issue" className="bg-[#4A4A4A]">Audio Issue</option>
                    <option value="Subtitle Issue" className="bg-[#4A4A4A]">Subtitle Issue</option>
                    <option value="Other" className="bg-[#4A4A4A]">Other Issue</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                    Description <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm transition-all duration-200 focus:border-[#60CC3F] focus:ring-2 focus:ring-[#60CC3F]/20 focus:bg-[#636363] placeholder-gray-500 resize-none h-24"
                    placeholder="Please describe the issue in detail..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${description.length >= 10 ? 'text-[#60CC3F]' : 'text-gray-500'}`}>
                      {description.length >= 10 ? '✓' : '●'} {description.length}/10 characters
                    </span>
                    <span className="text-gray-500 text-xs">Minimum 10 characters</span>
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`p-3 rounded-xl border text-sm transition-all duration-300 ${
                      message.includes("successfully")
                        ? "bg-[#60CC3F]/10 border-[#60CC3F]/30 text-[#60CC3F]"
                        : "bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {message.includes("successfully") ? "✅" : "❌"}
                      </span>
                      <span>{message}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:from-gray-700 disabled:to-gray-700 text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-[#60CC3F]/25 flex items-center justify-center gap-2 border border-[#60CC3F]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <span>📢</span>
                      Submit Report
                    </>
                  )}
                </button>

                {/* Help Text */}
                <p className="text-center text-gray-500 text-xs">
                  We'll review your report and fix the issue as soon as possible
                </p>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ReportButton;