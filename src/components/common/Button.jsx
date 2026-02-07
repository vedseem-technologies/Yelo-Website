import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const baseStyles = 'px-6 py-2.5 rounded-full font-medium transition-all duration-300 active:scale-95';
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white',
    white: 'bg-white text-black hover:bg-gray-100',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
