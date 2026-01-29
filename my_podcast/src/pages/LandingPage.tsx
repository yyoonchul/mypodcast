import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Turn Your Commute into a Power Hour
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Stay ahead with personalized news & career insights,
              delivered as daily podcasts designed for your commute.
            </p>
            <button 
              onClick={() => navigate('/podcast-selection')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Real-time News" 
              description="Get the latest news updates delivered in real-time."
              icon="lightning"
            />
            <FeatureCard 
              title="Career Insights" 
              description="Expert insights to support your career growth."
              icon="briefcase"
            />
            <FeatureCard 
              title="Custom Settings" 
              description="Customize content based on your interests."
              icon="settings"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage; 