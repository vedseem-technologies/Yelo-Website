import React from 'react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-10 ${className}`}>
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
