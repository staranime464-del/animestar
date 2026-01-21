 // components/Contact.tsx - UPDATED FOR ANIMESTAR DARK GRAY + GREEN THEME
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log('📨 Sending contact form data:', formData);
      
      const response = await axios.post(`${API_BASE}/contact`, formData);
      
      if (response.data.success) {
        setSubmitMessage(response.data.message);
        setMessageType('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      }
    } catch (error: any) {
      console.error('❌ Contact form submission error:', error);
      
      const errorMessage = error.response?.data?.error || 
        'Network error: Please check your connection and try again.';
      
      setSubmitMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#636363] text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="inline-flex items-center text-[#60CC3F] hover:text-[#4CAF50] mb-6 transition-colors group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        <div className="bg-[#4A4A4A] rounded-2xl p-6 md:p-10 border border-gray-600/50 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Contact <span className="text-[#60CC3F]">Animestar</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions or feedback? We're here to help you with any inquiries.
            </p>
          </div>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`p-4 rounded-xl mb-6 border ${
              messageType === 'success' 
                ? 'bg-[#60CC3F]/10 border-[#60CC3F] text-[#60CC3F]'
                : 'bg-red-500/10 border-red-500 text-red-400'
            }`}>
              <div className="flex items-center gap-3">
                {messageType === 'success' ? (
                  <div className="w-8 h-8 bg-[#60CC3F]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="font-medium">{submitMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-[#636363] rounded-xl p-6 border border-gray-600/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Contact Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#636363] rounded-lg flex items-center justify-center border border-gray-600 flex-shrink-0">
                      <svg className="w-5 h-5 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Email Address</h3>
                      <a href="mailto:animestarofficial@gmail.com" className="text-[#60CC3F] hover:text-[#4CAF50] transition-colors break-all">
                        animestarofficial@gmail.com
                      </a>
                      <p className="text-gray-400 text-sm mt-1">We'll respond as soon as possible</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#636363] rounded-lg flex items-center justify-center border border-gray-600 flex-shrink-0">
                      <svg className="w-5 h-5 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Response Time</h3>
                      <p className="text-gray-300">24-48 Hours</p>
                      <p className="text-gray-400 text-sm mt-1">We aim to respond to all inquiries quickly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#636363] rounded-lg flex items-center justify-center border border-gray-600 flex-shrink-0">
                      <svg className="w-5 h-5 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Support Type</h3>
                      <p className="text-gray-300">Technical & General Support</p>
                      <p className="text-gray-400 text-sm mt-1">For DMCA requests, please use the DMCA page</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#636363] rounded-xl p-6 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Before You Contact
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#60CC3F]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#60CC3F] rounded-full"></div>
                    </div>
                    <span>Check if your question is answered in our FAQ section</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#60CC3F]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#60CC3F] rounded-full"></div>
                    </div>
                    <span>For copyright issues, use the DMCA takedown process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#60CC3F]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#60CC3F] rounded-full"></div>
                    </div>
                    <span>Include relevant details for faster resolution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#60CC3F]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#60CC3F] rounded-full"></div>
                    </div>
                    <span>Check your spam folder if you don't hear back</span>
                  </li>
                </ul>
              </div>

              {/* Direct Email Button */}
              <a 
                href="mailto:animestarofficial@gmail.com"
                className="block group"
              >
                <div className="bg-gradient-to-r from-[#636363] to-[#4A4A4A] rounded-xl p-6 border border-gray-600 hover:border-[#60CC3F]/50 transition-all group-hover:shadow-lg group-hover:shadow-[#60CC3F]/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Send Direct Email</h3>
                      <p className="text-gray-400 text-sm">Prefer to use your own email client?</p>
                    </div>
                    <div className="w-10 h-10 bg-[#60CC3F] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-[#636363] rounded-xl p-6 border border-gray-600/50">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">Send us a Message</h2>
                <p className="text-gray-400">Fill out the form below and we'll get back to you soon.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#60CC3F]/50 focus:border-[#60CC3F] transition-all disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#60CC3F]/50 focus:border-[#60CC3F] transition-all disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#60CC3F]/50 focus:border-[#60CC3F] transition-all disabled:opacity-50"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Content Issue">Content Issue</option>
                    <option value="Partnership">Partnership</option>
                    <option value="DMCA Request">DMCA Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#60CC3F]/50 focus:border-[#60CC3F] transition-all disabled:opacity-50 resize-none"
                    placeholder="Please describe your inquiry in detail. The more information you provide, the better we can help you."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:shadow-[#60CC3F]/20 border border-[#60CC3F]"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-sm text-center">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;