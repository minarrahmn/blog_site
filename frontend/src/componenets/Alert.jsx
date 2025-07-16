import React, { useEffect } from 'react';

const Alert = ({ type = '', text = '', onClose, duration = 4000 }) => {
  // Don't render anything if no text is given
  if (!text) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const alertClass =
    type === 'success'
      ? 'bg-green-100 text-green-700'
      : type === 'error'
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-200 text-gray-800';

  return (
    <div className={`relative mb-4 p-3 text-sm rounded transition duration-300 ease-in-out ${alertClass}`}>
      {text}
      <button
        onClick={onClose}
        className="absolute top-1 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
