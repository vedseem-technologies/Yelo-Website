import React from 'react';

const SectionWrapper = ({ children, className = '', id }) => {
  return (
    <section id={id} className={`w-full max-w-7xl mx-auto px-4 py-12 md:py-20 ${className}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
