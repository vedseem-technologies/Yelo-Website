'use client';

import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CampaignProductCard = ({ product, themeColor }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id || product.id, { 
      quantity: 1, 
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default'
    });
  };

  return (
    <div className="relative w-full group cursor-pointer transition-all duration-500">
      {/* Premium Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
        <img 
          src={product.image || product.displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover Overlays */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Action Icons */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
            style={{ color: themeColor }}
          >
            <ShoppingBag size={20} />
          </button>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform">
            <Eye size={20} style={{ color: themeColor }} />
          </button>
        </div>

        {/* Dynamic Badge */}
        {product.discount && (
          <div 
            className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            -{product.discount}% OFF
          </div>
        )}
      </div>

      {/* Elegant Typography */}
      <div className="mt-8 px-2 flex flex-col items-center text-center">
        <h3 
          className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          style={{ color: themeColor }}
        >
          {product.brand || 'The Edit'}
        </h3>
        <p className="text-xl md:text-2xl font-serif italic text-stone-900 line-clamp-1 mb-2">
          {product.name}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-stone-300 line-through text-sm">₹{product.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignProductCard;
