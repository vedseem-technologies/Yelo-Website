import React from 'react';
import SectionWrapper from '../common/SectionWrapper';

const CampaignBanner = ({ text, bgColor = '#000', textColor = '#fff' }) => {
  return (
    <div style={{ backgroundColor: bgColor, color: textColor }} className="py-12 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee">
        <span className="text-4xl md:text-6xl font-black uppercase mx-4">{text}</span>
        <span className="text-4xl md:text-6xl font-black uppercase mx-4">{text}</span>
        <span className="text-4xl md:text-6xl font-black uppercase mx-4">{text}</span>
        <span className="text-4xl md:text-6xl font-black uppercase mx-4">{text}</span>
      </div>
    </div>
  );
};

export default CampaignBanner;
