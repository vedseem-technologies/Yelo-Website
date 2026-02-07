import React from 'react';
import SectionWrapper from '../common/SectionWrapper';
import CampaignProductCard from './CampaignProductCard';

const CampaignProducts = ({ products = [], themeColor, layout = 'row' }) => {
  if (!products || products.length === 0) return (
    <SectionWrapper className="text-center py-20">
      <p className="text-gray-500 italic">No products available for this collection yet.</p>
    </SectionWrapper>
  );

  if (layout === 'grid') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <CampaignProductCard 
              key={product._id || product.id} 
              product={product} 
              themeColor={themeColor} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 overflow-hidden">
      <div className="flex gap-8 px-4 md:px-[calc((100vw-1280px)/2)] overflow-x-auto pb-12 no-scrollbar scroll-smooth">
        {products.map((product) => (
          <div key={product._id || product.id} className="flex-shrink-0 w-[280px] md:w-[350px]">
            <CampaignProductCard 
              product={product} 
              themeColor={themeColor} 
            />
          </div>
        ))}
        {/* Spacer for horizontal scroll end */}
        <div className="flex-shrink-0 w-2 md:w-8" />
      </div>
    </div>
  );
};

export default CampaignProducts;
