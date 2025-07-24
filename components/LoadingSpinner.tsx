import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-stone-50">
      <div className="w-16 h-16 border-4 border-lime-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};
