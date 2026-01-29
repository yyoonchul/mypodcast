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

const SignUpPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [wantProPlan, setWantProPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state?.podcastType) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const state = location.state as LocationState;
      await submitWaitlistData({
        email,
        podcastType: state.podcastType,
        selectedTopics: state.selectedTopics,
        selectedJobRoles: state.selectedJobRoles,
        wantProPlan,
      });
      setMessage('Thank you for joining our waitlist! We\'ll be in touch soon.');
      setEmail('');
      setWantProPlan(false);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!location.state) {
    return null;
  }

  const state = location.state as LocationState;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Waitlist</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Podcast Preferences</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Type:</span> {state.podcastType === 'news' ? 'News' : 'Career'}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Topics:</span> {state.selectedTopics.join(', ')}
                </p>
                {state.selectedJobRoles.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-medium">Job Roles:</span> {state.selectedJobRoles.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wantProPlan"
                  checked={wantProPlan}
                  onChange={(e) => setWantProPlan(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="wantProPlan" className="ml-2 block text-sm text-gray-700">
                  I'm interested in the Pro Plan
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              {message && (
                <div className="text-green-600 text-sm">{message}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Join Waitlist'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage; 