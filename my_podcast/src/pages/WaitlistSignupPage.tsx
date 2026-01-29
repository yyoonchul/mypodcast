import React, { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitWaitlistData } from '../services/waitlist';

interface LocationState {
  podcastType: 'news' | 'career';
  selectedTopics: string[];
  selectedJobRoles: string[];
}

const WaitlistSignupPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [wantProPlan, setWantProPlan] = useState(false);

  useEffect(() => {
    // If no state is provided, redirect back to podcast selection
    if (!state?.podcastType) {
      navigate('/podcast-selection');
    }
  }, [state, navigate]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Firebase에 데이터 저장
      await submitWaitlistData({
        email,
        podcastType: state.podcastType,
        selectedTopics: state.selectedTopics,
        selectedJobRoles: state.selectedJobRoles,
        wantProPlan
      });
      
      setMessage('Thank you for joining our waitlist! We\'ll be in touch soon.');
      setEmail('');
      setWantProPlan(false);
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If no state is provided, don't render the form
  if (!state?.podcastType) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Join the Waitlist</h2>
            <p className="text-sm text-gray-600 mb-4">
              We're excited to have you join our waitlist! Enter your email below to be notified when we launch.
            </p>

            {/* Summary of Selections */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Your Preferences</h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Type:</span> {state.podcastType.charAt(0).toUpperCase() + state.podcastType.slice(1)}
                </p>
                {state.selectedTopics.length > 0 && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Topics:</span> {state.selectedTopics.join(', ')}
                  </p>
                )}
                {state.selectedJobRoles.length > 0 && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Job Roles:</span> {state.selectedJobRoles.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Pro Plan Upsell */}
            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-medium text-indigo-800 mb-1">Pro Plan Features</h3>
              <p className="text-xs text-indigo-700 mb-2">
                Our Pro Plan offers advanced customization options including:
              </p>
              <ul className="text-xs text-indigo-700 list-disc pl-4 mb-2">
                <li>Manual topic entry for hyper-personalization</li>
                <li>Mix multiple podcast types in one feed</li>
                <li>Set preferred podcast length</li>
                <li>Priority access to new features</li>
              </ul>
              <div className="flex items-center mt-2">
                <input
                  id="pro-plan"
                  type="checkbox"
                  checked={wantProPlan}
                  onChange={() => setWantProPlan(!wantProPlan)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="pro-plan" className="ml-2 text-xs text-indigo-800">
                  Contact me when the Pro Plan is available
                </label>
              </div>
            </div>

            {/* Waitlist Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </button>

              {message && (
                <p className={`text-sm text-center ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WaitlistSignupPage; 