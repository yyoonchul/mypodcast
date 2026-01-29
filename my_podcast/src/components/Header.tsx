import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-indigo-600">My Podcast</h1>
      </div>
    </header>
  );
};

export default Header; 