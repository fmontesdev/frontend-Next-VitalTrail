import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <div className="flex space-x-3">
            <div className="w-3 h-3 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
);

export default LoadingSpinner;
