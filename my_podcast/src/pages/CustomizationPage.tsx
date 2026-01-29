import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LocationState {
  podcastType: 'news' | 'career';
}

const CustomizationPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [podcastType, setPodcastType] = useState<'news' | 'career'>('news');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.podcastType) {
      setPodcastType(state.podcastType);
    } else {
      // If no podcast type is selected, redirect back to selection page
      navigate('/podcast-selection');
    }
  }, [location.state, navigate]);

  const topics = [
    'Technology', 'Business', 'Science', 'Health', 'Politics',
    'Entertainment', 'Sports', 'Education', 'Environment', 'Arts'
  ];

  const jobs = [
    'Software Engineer', 'Product Manager', 'Data Scientist', 'UX/UI Designer',
    'Marketing Manager', 'Business Analyst', 'DevOps Engineer', 'AI Engineer'
  ];

  const handleTopicToggle = (topic: string): void => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleNext = (): void => {
    if (podcastType === 'news' && selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }
    if (podcastType === 'career' && !selectedJob) {
      alert('Please select a job role');
      return;
    }
    navigate('/signup', {
      state: {
        podcastType,
        selectedTopics: podcastType === 'news' ? selectedTopics : [],
        selectedJobRoles: podcastType === 'career' ? [selectedJob] : []
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Customize Your Experience
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              {podcastType === 'news' ? (
                <>
                  Choose the topics that matter to you, <br className="hidden md:block" />
                  and we'll deliver daily news episodes curated just for your interests. <br className="hidden md:block" />
                  Stay informed effortlessly.
                </>
              ) : (
                <>
                  Select your profession, and we'll curate daily podcasts with industry news, <br className="hidden md:block" />
                  expert insights, and key trends helping you stay ahead in your field.
                </>
              )}
            </p>
          </div>

          {podcastType === 'news' && (
            <div className="mb-6 md:mb-12">
              <h2 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3 md:mb-6">Select Topics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicToggle(topic)}
                    className={`group relative p-2 md:p-4 rounded-xl transition-all duration-200 ${
                      selectedTopics.includes(topic)
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white hover:bg-indigo-50 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xs md:text-base">{topic}</span>
                    {selectedTopics.includes(topic) && (
                      <div className="absolute top-1 md:top-2 right-1 md:right-2">
                        <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {podcastType === 'career' && (
            <div className="mb-6 md:mb-12">
              <h2 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3 md:mb-6">Select Job Role</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {jobs.map((job) => (
                  <button
                    key={job}
                    onClick={() => setSelectedJob(job)}
                    className={`group relative p-2 md:p-4 rounded-xl transition-all duration-200 ${
                      selectedJob === job
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white hover:bg-indigo-50 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xs md:text-base">{job}</span>
                    {selectedJob === job && (
                      <div className="absolute top-1 md:top-2 right-1 md:right-2">
                        <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 md:px-8 py-2 md:py-4 rounded-full text-sm md:text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Next Step
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomizationPage; 