'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductCard({ id, image_url, title, price, link, isSelected = false, onSelect }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect({ id, title, image_url });
    }
  };

  return (
    <>
      <div className={`relative w-[220px] bg-white rounded-xl shadow-sm hover:shadow-sm transition-all duration-500 hover:scale-[1.00] overflow-hidden group cursor-pointer ${
        isSelected ? 'border-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-2 border-gray-100'
      }`}>
        
        {/* Image Section - Minimal padding for maximum image space */}
        <div className="w-full h-52 bg-white flex  items-center justify-center relative overflow-hidden">
          <img 
            src={image_url} 
            alt={title} 
            className="w-full h-56 object-contain transition-transform duration-500 group-hover:scale-100"
          />
          
          {/* Select Button */}
          <button
            onClick={handleSelectClick}
            className={`absolute top-2 left-3 z-30 rounded-md p-1 opacity-70 hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-300'
            }`}
            aria-label={isSelected ? "Deselect product" : "Select product"}
          >
            {isSelected ? (
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            ) : (
              <div className="w-3.5 h-3.5"></div>
            )}
          </button>
          
          {/* Expand Icon */}
          <button
            onClick={handleExpandClick}
            className="absolute top-2 right-2 z-30 bg-white/60 hover:bg-white/90 rounded-full p-1.5 opacity-70 hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="View larger image"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>

        {/* Content Section - More compact */}
        <div className="p-3 pt-2.5">
          <h3 className="text-xs font-medium text-gray-800 text-center mb-2 leading-tight h-8 flex items-center justify-center overflow-hidden">
            <span className="line-clamp-2 px-0.5">{title}</span>
          </h3>
          
          <div className="flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-900 bg-black bg-clip-text text-transparent">₹{price}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Modal Image Container */}
            <div 
              className="relative bg-transparent rounded-lg p-4 max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - positioned inside image area */}
              <button 
                onClick={handleModalClose} 
                className="absolute top-4 right-6 z-60 bg-black/50 hover:bg-black/70 rounded-full p-1 text-white transition-colors" 
                aria-label="Close modal"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>


              {/* Image */}
              <img
                src={image_url}
                alt={title}
                className="max-w-full max-h-full object-contain rounded"
                style={{ maxHeight: 'calc(90vh - 2rem)' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}