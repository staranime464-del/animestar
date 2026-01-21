 // components/PrivacyPolicy.tsx  
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-gray-700 via-dark-gray-800 to-dark-gray-900 text-white py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-anime-green-400 hover:text-green-300 mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        
        <div className="bg-dark-gray-600 rounded-lg p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-gray-600 shadow-lg">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Last Updated: November 2025</span>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Introduction */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div>
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                    At <strong className="text-green-400">AnimeStar</strong>, accessible from <strong className="text-green-400 break-all">https://animestar.com</strong>, 
                    one of our main priorities is the privacy of our visitors.
                  </p>
                  <p className="text-gray-200 mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed">
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span>Information We Collect</span>
              </h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                We may ask you to provide certain personal information, and the reason for the request will be made clear at the time we ask.
              </p>
              <p className="text-green-400 font-semibold mb-2 text-sm sm:text-base">We may also automatically collect:</p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>IP address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Browser information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Pages visited</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Time spent on pages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Device information and general usage data</span>
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>How We Use Your Information</span>
              </h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">We use collected information to:</p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Operate and maintain our website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Improve, personalize and expand our content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Understand how users interact with our website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Develop new features and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Prevent fraud and ensure security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Communicate with you, if necessary</span>
                </li>
              </ul>
            </section>

            {/* Log Files */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Log Files</h2>
              <p className="text-gray-300 text-sm sm:text-base">
                AnimeStar follows a standard procedure for using log files. These logs record visitors when they visit 
                websites — this is a part of web hosting analytics.
              </p>
            </section>

            {/* Cookies & Similar Technologies */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Cookies & Similar Technologies</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Like most websites, AnimeStar uses cookies to store visitor preferences and optimize browsing experience.
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                You can disable cookies through your browser settings.
              </p>
            </section>

            {/* Google AdSense */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Google AdSense & Advertising Cookies</span>
              </h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                We use Google AdSense to serve ads. Google may use advertising cookies, including the DoubleClick cookie, to:
              </p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 mb-3 sm:mb-4 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Personalize ads based on your visit to our site and other websites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Limit repeated ad displays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Measure ad performance</span>
                </li>
              </ul>
              <p className="text-green-400 font-semibold mb-2 text-sm sm:text-base">Google may collect:</p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 mb-3 sm:mb-4 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>IP address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Browser type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>User interests and behavior</span>
                </li>
              </ul>
              <div className="bg-dark-gray-600 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4 border border-gray-600">
                <p className="text-gray-300 mb-2 text-sm sm:text-base">
                  Users can opt out of personalized advertising anytime:
                </p>
                <div className="bg-dark-gray-700 rounded p-2 mb-3 overflow-hidden">
                  <a href="https://www.google.com/settings/ads" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm break-all">
                    https://www.google.com/settings/ads
                  </a>
                </div>
                
                <p className="text-gray-300 mb-2 text-sm sm:text-base">
                  For more information on Google's ad policies:
                </p>
                <div className="bg-dark-gray-700 rounded p-2 overflow-hidden">
                  <a href="https://policies.google.com/technologies/ads" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm break-all">
                    https://policies.google.com/technologies/ads
                  </a>
                </div>
              </div>
            </section>

            {/* Third-Party Advertising Partners */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Third-Party Advertising Partners</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Third-party ad servers may use Cookies, JavaScript, and Web Beacons. They automatically collect data 
                for ad targeting and measurement. AnimeStar has no access or control over these cookies.
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                Users can disable third-party cookies through browser settings.
              </p>
            </section>

            {/* CCPA Privacy Rights */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">CCPA Privacy Rights (California Users)</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                California consumers have the right to:
              </p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 mb-3 sm:mb-4 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Know what personal data is collected</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Request deletion of personal data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Request that personal data not be sold</span>
                </li>
              </ul>
              <p className="text-gray-300 text-sm sm:text-base">
                If you make a request, we will respond within 1 month.
              </p>
            </section>

            {/* GDPR Data Protection Rights */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">GDPR Data Protection Rights (EU Users)</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Every user is entitled to:
              </p>
              <ul className="text-gray-300 list-disc list-inside space-y-2 ml-3 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to access their data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to correct data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to delete data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to restrict processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to object to processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Right to data portability</span>
                </li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Children's Privacy</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                We do not knowingly collect any Personal Identifiable Information from children under the age of 13.
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                If you believe your child provided personal data on our site, please contact us immediately so we can remove such information promptly.
              </p>
            </section>

            {/* Contact Us */}
            <section className="bg-dark-gray-500 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Contact Us</h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                If you have any questions about this Privacy Policy, you may contact us at:
              </p>
              <div className="bg-dark-gray-600 rounded-lg p-3 sm:p-4 border border-gray-600">
                <div className="text-gray-300 flex items-center gap-3 text-sm sm:text-base">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-green-400 font-medium mb-1">Email:</div>
                    <div className="bg-dark-gray-700 rounded p-2 overflow-hidden">
                      <a href="mailto:animestarofficial@gmail.com" 
                         className="text-green-400 hover:text-green-300 transition-colors break-all text-xs sm:text-sm">
                        animestarofficial@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-center text-sm">
              This Privacy Policy is effective as of November 2025 and may be updated periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;