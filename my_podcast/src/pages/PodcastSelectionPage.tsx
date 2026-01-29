import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { podcastTypes } from '../utils/constants';

const PodcastSelectionPage: FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');

  const handleSelection = (typeId: string): void => {
    if (podcastTypes.find(t => t.id === typeId)?.comingSoon) return;
    setSelectedType(typeId);
  };

  const handleNext = (): void => {
    if (selectedType) {
      navigate('/customization', { state: { podcastType: selectedType } });
    }
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
              Choose Your Podcast Type
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Select one podcast type to customize your experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {podcastTypes.map((type) => (
              <div
                key={type.id}
                className={`group relative bg-white rounded-xl p-3 md:p-6 cursor-pointer transition-all duration-200 ${
                  selectedType === type.id
                    ? 'ring-2 ring-indigo-500 shadow-xl'
                    : 'hover:shadow-lg'
                } ${type.comingSoon ? 'opacity-50' : ''}`}
                onClick={() => handleSelection(type.id)}
              >
                <div className="text-2xl md:text-4xl mb-2 md:mb-4 text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                  {type.icon}
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-gray-900">{type.title}</h3>
                <p className="text-xs md:text-base text-gray-600 mb-2 md:mb-4">{type.description}</p>
                {type.comingSoon && (
                  <span className="inline-block bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                    Coming Soon
                  </span>
                )}
                {selectedType === type.id && (
                  <div className="absolute top-2 md:top-4 right-2 md:right-4">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-12 text-center">
            <button
              onClick={handleNext}
              disabled={!selectedType}
              className={`inline-flex items-center px-4 md:px-8 py-2 md:py-4 rounded-full text-sm md:text-lg font-medium transition-all duration-200 ${
                selectedType
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
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

export default PodcastSelectionPage; 