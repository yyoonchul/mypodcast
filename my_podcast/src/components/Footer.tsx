import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-gray-600">
          © 2024 My Podcast. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 