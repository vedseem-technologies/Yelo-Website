import React from 'react';
import SectionWrapper from '../common/SectionWrapper';
import Button from '../common/Button';

const CampaignHero = ({ campaign }) => {
  const { 
    title, 
    subtitle, 
    bannerImage, 
    themeColor, 
    heroOverlayOpacity = 0.7,
    titleAlignment = 'left' 
  } = campaign;

  return (
    <div 
      className="relative w-full min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: themeColor || '#f3f4f6' }}
    >
      <div className="absolute inset-0 z-0">
        {bannerImage && (
          <img 
            src={bannerImage} 
            alt={title} 
            className="w-full h-full object-cover"
            style={{ opacity: 1 - heroOverlayOpacity }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <SectionWrapper className={`relative z-10 text-white ${titleAlignment === 'center' ? 'text-center mx-auto' : ''}`}>
        <div className={titleAlignment === 'center' ? 'mx-auto max-w-5xl' : 'max-w-4xl'}>
          <h1 className="text-6xl md:text-[10rem] font-bold mb-8 tracking-tighter leading-[0.8] animate-fade-in-up">
            {title}
          </h1>
          <p className="text-2xl md:text-4xl text-white/80 font-light max-w-3xl leading-snug">
            {subtitle}
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default CampaignHero;
