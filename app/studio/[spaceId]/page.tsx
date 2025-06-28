'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getSupabaseUserId } from "@/utils/get-supabase-user";
import { Coins, X, ChevronRight, ChevronLeft } from "lucide-react";
import axios from 'axios';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import '@/styles/scrollbar.css';

// Add interface for ProductCardProps
interface ProductCardProps {
  id: string;
  image_url: string;
  title: string;
  price: string;
  link: string;
  isSelected?: boolean;
  onSelect?: (product: { id: string; title: string; image_url: string }) => void;
}

// Add custom styles for text clamping
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

interface Space {
  id: string;
  room_type: string;
  room_image_url: string | null;
  theme: string | null;
  color_palette: string | null;
  additional_instructions: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// Add ImageWithOverlay component
const ImageWithOverlay = ({ imageUrl, coordinates, selectedProducts, productRecs, onError, onExpandClick }: { 
  imageUrl: string; 
  coordinates: Array<{ box_2d: { x: number; y: number; width: number; height: number }; id: string }>; 
  selectedProducts: Array<{ id: string; title: string; image_url: string; category: string }>;
  productRecs: any[];
  onError: () => void;
  onExpandClick: () => void;
}) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [clickedPointId, setClickedPointId] = useState<string | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const calculateCenterPoints = () => {
    if (!imageDimensions || !coordinates || coordinates.length === 0) return [];
    
    return coordinates.map((item) => {
      const coords = item.box_2d;
      const centerX = coords.x + coords.width / 2;
      const centerY = coords.y + coords.height / 2;
      
      return {
        id: item.id,
        x: centerX * 100, // Convert to percentage
        y: centerY * 100, // Convert to percentage
      };
    });
  };

  const getProductDetails = (pointId: string) => {
    return selectedProducts.find(product => product.id === pointId);
  };

  const getProductLink = (pointId: string) => {
    // Find the product link from productRecs
    for (const category of productRecs) {
      const product = category.products.find((prod: any) => prod.id === pointId);
      if (product) {
        return product.link;
      }
    }
    return null;
  };

  const handleDotClick = (pointId: string) => {
    // For mobile devices, toggle the clicked state
    setClickedPointId(clickedPointId === pointId ? null : pointId);
  };

  const handleCardClick = (pointId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const productLink = getProductLink(pointId);
    if (productLink) {
      window.open(productLink, '_blank');
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExpandClick();
  };

  const centerPoints = calculateCenterPoints();

  return (
    <>
      <div className="relative w-full h-full">
        <img 
          src={imageUrl} 
          alt="Generated room design" 
          className="w-full h-full object-cover rounded-lg"
          onLoad={handleImageLoad}
          onError={onError}
        />
        
        {/* Expand Button - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={handleExpandClick}
            className="p-2 rounded-full backdrop-blur-sm border transition-all duration-200 bg-black/70 border-black/70 text-white hover:bg-black/50"
            title="View larger image"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
        
        {/* Toggle Button */}
        <div className="absolute top-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOverlay(!showOverlay);
          }}
          className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
            showOverlay 
              ? 'bg-black/20 border-black/30 text-black hover:bg-black/30' 
              : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
          }`}
          title={showOverlay ? 'Hide product markers' : 'Show product markers'}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {showOverlay ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            )}
          </svg>
        </button>
      </div>

      {/* Overlay with enhanced blue dots */}
      {showOverlay && centerPoints.length > 0 && (
        <div className="absolute inset-0">
          {centerPoints.map((point, index) => {
            const productDetails = getProductDetails(point.id);
            
            if (!productDetails) {
              // If no product details found, show regular dot
              return (
                <div
                  key={point.id || index}
                  className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                  }}
                />
              );
            }

            const isClicked = clickedPointId === point.id;

            return (
              <HoverCard key={point.id || index} open={isClicked}>
                <HoverCardTrigger asChild>
                  <div
                    className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform duration-200"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                    onClick={() => handleDotClick(point.id)}
                  />
                </HoverCardTrigger>
                  <HoverCardContent 
                   className="w-48 h-48 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                   onClick={(e) => handleCardClick(point.id, e)}
                  >
                  <div className="space-y-2">
                    <div className="w-full">
                      <img
                        className="w-full h-28 object-cover rounded-t-lg"
                        src={productDetails.image_url}
                        alt={productDetails.title}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium leading-tight line-clamp-2">
                        {productDetails.title}
                      </p>
                      <p className="text-muted-foreground text-xs capitalize truncate">
                        {productDetails.category}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      )}
      
        {/* Click outside to close popup */}
        {clickedPointId && (
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setClickedPointId(null)}
          />
        )}
      </div>

    </>
  );
};

// Insert Tooltip component at the top (after styles)
const Tooltip = ({ children, show }: { children: React.ReactNode; show: boolean }) => (
  <div
    className={`absolute left-1/2 -translate-x-1/2 bottom-16 z-50 transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
    style={{ minWidth: 250 }}
  >
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 shadow-md text-center relative">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
    </div>
  </div>
);

export default function SpacePage() {
  const params = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [productRecs, setProductRecs] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; title: string; image_url: string; category: string }>>([]);
  const [showMissingProductsModal, setShowMissingProductsModal] = useState(false);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [missingCategories, setMissingCategories] = useState<string[]>([]);
  const [userCredits, setUserCredits] = useState(0);
  const [autoSelectLoading, setAutoSelectLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [scrollStates, setScrollStates] = useState<{ [key: string]: { canScrollLeft: boolean; canScrollRight: boolean } }>({});
  const [showRemoveCategoryModal, setShowRemoveCategoryModal] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState<string | null>(null);
  
  // Add ref to track if products have been fetched
  const hasFetchedProducts = useRef(false);

  // Determine if right section should be visible
  const shouldShowRightSection = isGeneratingImage || generatedImageUrl || imageError;

  // Compute if all categories have a selected product
  const allCategoriesSelected = productRecs.length > 0 && productRecs.every(cat =>
    selectedProducts.some(p => p.category === cat.category)
  );

  // Helper function to check scroll position and update button states
  const updateScrollState = (categoryKey: string) => {
    const container = scrollContainerRefs.current[categoryKey];
    if (!container) return;

    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;

    setScrollStates(prev => ({
      ...prev,
      [categoryKey]: { canScrollLeft, canScrollRight }
    }));
  };

  // Scroll functions
  const scrollLeft = (categoryKey: string) => {
    const container = scrollContainerRefs.current[categoryKey];
    if (container) {
      container.scrollBy({ left: -240, behavior: 'smooth' }); // 220px card width + 20px gap
    }
  };

  const scrollRight = (categoryKey: string) => {
    const container = scrollContainerRefs.current[categoryKey];
    if (container) {
      container.scrollBy({ left: 240, behavior: 'smooth' }); // 220px card width + 20px gap
    }
  };

  const handleProductSelect = async (product: { id: string; title: string; image_url: string }, category: string) => {
    const newSelectedProducts = await new Promise<Array<{ id: string; title: string; image_url: string; category: string }>>((resolve) => {
      setSelectedProducts(prevSelected => {
        // Remove any existing selection from this category
        const filteredSelected = prevSelected.filter(p => p.category !== category);
        
        // Check if this product is already selected
        const isCurrentlySelected = prevSelected.some(p => p.id === product.id && p.category === category);
        
        let newSelected;
        if (isCurrentlySelected) {
          // If already selected, remove it (deselect)
          newSelected = filteredSelected;
        } else {
          // If not selected, add it
          newSelected = [...filteredSelected, { ...product, category }];
        }
        
        resolve(newSelected);
        return newSelected;
      });
    });
  };

  const isProductSelected = (productId: string, category: string) => {
    return selectedProducts.some(p => p.id === productId && p.category === category);
  };

  const handleAutoSelect = async () => {
    setAutoSelectLoading(true);
    try {
      // Prepare product_json with only IDs from productRecs
      const productJson = productRecs.map(category => ({
        category: category.category,
        prod_ids: category.products.map((product: any) => ({ id: product.id }))
      }));

      const payload = {
        room_type: space!.room_type,
        room_theme: space!.theme,
        color_preference: space!.color_palette,
        additional_instruction: space!.additional_instructions,
        product_json: productJson,
        search_type: "catalog_product_recommendation",
        user_id: supabaseUserId,
        space_id: space!.id
      };

      // Call the API to create the job
      const response = await axios.post('/api/auto-select', payload);

      if (response.status === 200 && response.data.job_id) {
        // Start polling for job status
        pollAutoSelectJob(response.data.job_id);
      } else {
        throw new Error('Failed to create auto-select job');
      }
    } catch (error) {
      console.error('Error in auto select:', error);
      setAutoSelectLoading(false);
    }
  };

  const pollAutoSelectJob = async (jobId: string) => {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/job-status/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setAutoSelectLoading(false);

          if (data.result && data.result.status === 'success') {
            const responseData = data.result.response_data;
            // Map the response IDs back to full product info from productRecs
            const newSelectedProducts: Array<{ id: string; title: string; image_url: string; category: string }> = [];
            responseData.forEach((responseProduct: any) => {
              const productId = responseProduct.id;
              for (const categoryData of productRecs) {
                const fullProduct = categoryData.products.find((prod: any) => prod.id === productId);
                if (fullProduct) {
                  newSelectedProducts.push({
                    id: fullProduct.id,
                    title: fullProduct.title,
                    image_url: fullProduct.image_url,
                    category: categoryData.category
                  });
                  break;
                }
              }
            });
            setSelectedProducts(newSelectedProducts);
          }
          return;
        } else if (data.status === 'failed') {
          setAutoSelectLoading(false);
          console.error('Auto-select failed:', data.error_message);
          return;
        } else if (attempts >= maxAttempts) {
          setAutoSelectLoading(false);
          console.error('Auto-select timed out');
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 5000); // Poll every 5 seconds
      } catch (error) {
        setAutoSelectLoading(false);
        console.error('Error polling auto-select job status:', error);
      }
    };

    poll();
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCategoryToRemove(categoryName);
    setShowRemoveCategoryModal(true);
  };

  const confirmRemoveCategory = () => {
    if (!categoryToRemove) return;
    
    // Remove category from productRecs
    setProductRecs(prev => prev.filter(cat => cat.category !== categoryToRemove));
    
    // Remove any selected products from this category
    setSelectedProducts(prev => prev.filter(product => product.category !== categoryToRemove));
    
    // Close modal and reset state
    setShowRemoveCategoryModal(false);
    setCategoryToRemove(null);
  };

  const handleGenerateImage = async () => {
    // Check if at least one product is selected from each category
    const categoriesWithProducts = productRecs.map(cat => cat.category);
    const selectedCategories = Array.from(new Set(selectedProducts.map(p => p.category)));
    const missing = categoriesWithProducts.filter(cat => !selectedCategories.includes(cat));
    if (missing.length > 0) {
      setMissingCategories(missing);
      setShowMissingProductsModal(true);
      return;
    }

    try {
      const creditResponse = await fetch(`/api/get-credits?userId=${supabaseUserId}`);
      const data = await creditResponse.json();
      if (data.credits < 10) {
        setUserCredits(data.credits);
        setShowInsufficientCreditsModal(true);
        return;
      }

      setIsGeneratingImage(true);
      setGeneratedImageUrl(null);
      setImageError(null);

      const payload = {
        empty_room_image_url: space!.room_image_url,
        room_type: space!.room_type,
        user_id: supabaseUserId,
        space_id: space!.id,
        room_theme: space!.theme,
        color_preference: space!.color_palette,
        additional_instruction: space!.additional_instructions,
        product_json: selectedProducts,
        image_count: 1,
        coordinates_required: true
      };

      const imageResponse = await axios.post('/api/generate-image', payload);

      if (imageResponse.status === 200 && imageResponse.data.job_id) {
        pollGenerateImageJob(imageResponse.data.job_id);
      } else {
        setIsGeneratingImage(false);
        setImageError('Failed to start image generation. Please try again.');
      }
    } catch (error) {
      setIsGeneratingImage(false);
      setImageError('Failed to start image generation. Please try again.');
      console.error('Error generating image:', error);
    }
  };

  const pollGenerateImageJob = async (jobId: string) => {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/job-status/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setIsGeneratingImage(false);

          if (data.result && data.result.status === 'success') {
            const imageUrl = data.result.response_data.generated_image_url;
            const coordinate = data.result.response_data.coordinates;
            setGeneratedImageUrl(imageUrl);
            setCoordinates(coordinate);

            // Deduct credits after successful image generation
            try {
              const deductResponse = await fetch(`/api/deduct-credits?userId=${supabaseUserId}&amount=10`, {
                method: 'POST'
              });
              if (!deductResponse.ok) {
                console.error('Failed to deduct credits');
              } else {
                const deductData = await deductResponse.json();
                console.log('Credits deducted successfully:', deductData);
              }
            } catch (error) {
              console.error('Error deducting credits:', error);
            }

            // Insert a new row with current productRecs, selectedProducts, and generated image URL
            try {
              const { error: insertError } = await supabase
                .from('space_info')
                .insert({
                  space_id: space!.id,
                  user_id: supabaseUserId,
                  products: productRecs,
                  selected_products: selectedProducts,
                  generated_image_url: imageUrl,
                  coordinates: coordinate
                });

              if (insertError) {
                console.error('Error inserting new space_info record:', insertError);
              }
            } catch (err) {
              console.error('Error inserting new space_info record:', err);
            }
          } else {
            setImageError('Failed to generate image. Please try again.');
          }
          return;
        } else if (data.status === 'failed') {
          setIsGeneratingImage(false);
          setImageError(data.error_message || 'Image generation failed.');
          return;
        } else if (attempts >= maxAttempts) {
          setIsGeneratingImage(false);
          setImageError('Image generation timed out.');
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 5000); // Poll every 5 seconds
      } catch (error) {
        setIsGeneratingImage(false);
        setImageError('Failed to check image generation status.');
        console.error('Error polling generate image job status:', error);
      }
    };

    poll();
  };

  // Add this function to handle product search with polling
  const fetchProductsWithJob = async () => {
    if (!space || !supabaseUserId) return;
    
    setProductsLoading(true);
    
    try {
      // First check if we have existing data in space_info table
      const { data: existingData, error: fetchError } = await supabase
        .from('space_info')
        .select('*')
        .eq('space_id', space.id)
        .eq('user_id', supabaseUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!fetchError && existingData) {
        // We have existing data, use it
        console.log('Using existing data from space_info table');
        
        if (existingData.products && Array.isArray(existingData.products)) {
          setProductRecs(existingData.products);
        }
        
        if (existingData.selected_products && Array.isArray(existingData.selected_products)) {
          setSelectedProducts(existingData.selected_products);
        }
        
        if (existingData.generated_image_url) {
          setGeneratedImageUrl(existingData.generated_image_url);
        }

        if (existingData.coordinates) {
          setCoordinates(existingData.coordinates);
        }
        
        setProductsLoading(false);
        return;
      }

      // No existing data found, create product search job
      console.log('No existing data found, creating product search job');
      const payload = {
        empty_room_image_url: space.room_image_url,
        room_type: space.room_type,
        user_id: supabaseUserId,
        space_id: space.id,
        room_theme: space.theme,
        color_preference: space.color_palette,
        additional_instruction: space.additional_instructions,
      };
      
      const res = await axios.post('/api/product-search', payload);
      
      if (res.status === 200 && res.data.job_id) {
        // Start polling for product search job status
        pollProductSearchJob(res.data.job_id);
      } else {
        throw new Error('Failed to create product search job');
      }
      
    } catch (err) {
      console.error('Error creating product search job:', err);
      setProductsLoading(false);
      
      // Update space status to 'failed'
      const { error: updateError } = await supabase
        .from('spaces')
        .update({ status: 'failed' })
        .eq('id', space.id);
        
      if (updateError) {
        console.error('Error updating space status to failed:', updateError);
      }
    }
  };

  const pollProductSearchJob = async (jobId: string) => {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/job-status/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          // Job completed successfully
          setProductsLoading(false);
          
          if (data.result && data.result.status === 'success') {
            const productData = data.result.response_data.recommendations;
            setProductRecs(productData);

            // Deduct credits
            try {
              const deductResponse = await fetch(`/api/deduct-credits?userId=${supabaseUserId}&amount=15`, {
                method: 'POST'
              });
              
              if (!deductResponse.ok) {
                console.error('Failed to deduct credits');
              } else {
                const deductData = await deductResponse.json();
                console.log('Credits deducted successfully:', deductData);
              }
            } catch (error) {
              console.error('Error deducting credits:', error);
            }
            
            // Store the fetched data in space_info table
            const { error: insertError } = await supabase
              .from('space_info')
              .insert({
                space_id: space!.id,
                user_id: supabaseUserId,
                products: productData,
                selected_products: [],
                generated_image_url: null
              });
              
            if (insertError) {
              console.error('Error storing product data:', insertError);
            }

            // Update space status to 'completed'
            const { error: updateError } = await supabase
              .from('spaces')
              .update({ status: 'completed' })
              .eq('id', space!.id);
              
            if (updateError) {
              console.error('Error updating space status to completed:', updateError);
            }
          }
          
          return;
        } else if (data.status === 'failed') {
          // Job failed
          setProductsLoading(false);
          console.error('Product search failed:', data.error_message);
          
          // Update space status to 'failed'
          const { error: updateError } = await supabase
            .from('spaces')
            .update({ status: 'failed' })
            .eq('id', space!.id);
            
          if (updateError) {
            console.error('Error updating space status to failed:', updateError);
          }
          
          return;
        } else if (attempts >= maxAttempts) {
          // Timeout
          setProductsLoading(false);
          console.error('Product search timed out');
          
          // Update space status to 'failed'
          const { error: updateError } = await supabase
            .from('spaces')
            .update({ status: 'failed' })
            .eq('id', space!.id);
            
          if (updateError) {
            console.error('Error updating space status to failed:', updateError);
          }
          
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 5000); // Poll every 5 seconds
      } catch (error) {
        console.error('Error polling product search job status:', error);
        setProductsLoading(false);
      }
    };

    poll();
  };

  useEffect(() => {
    async function getUserId() {
      if (isLoaded && isSignedIn && user) {
        try {
          const userId = await getSupabaseUserId(user.id);
          setSupabaseUserId(userId);
        } catch (error) {
          console.error('Error getting Supabase user ID:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    }

    getUserId();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    async function fetchSpace() {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', params.spaceId)
          .single();

        if (error) throw error;
        setSpace(data);
      } catch (error) {
        console.error('Error fetching space:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpace();
  }, [params.spaceId, supabase]);

  useEffect(() => {
    if (!space || !supabaseUserId || hasFetchedProducts.current) return;
    
    hasFetchedProducts.current = true;
    fetchProductsWithJob();
    
    // Cleanup function to reset the ref when space ID changes
    return () => {
      hasFetchedProducts.current = false;
    };
  }, [space?.id, supabaseUserId]);

  // Initialize scroll states when productRecs change
  useEffect(() => {
    const timer = setTimeout(() => {
      productRecs.forEach(cat => {
        updateScrollState(cat.category);
      });
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [productRecs]);

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-center space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#8338EC] rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading space...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Space not found</h1>
          <p className="mt-2 text-gray-600">The space you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="relative bg-gray-100 p-2 sm:p-2 overflow-hidden"
      style={{ height: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Inject custom styles */}
      <style jsx>{styles}</style>
      
      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-lg w-full shadow-xl border border-gray-100 relative z-10 flex flex-col overflow-hidden"
        style={{ height: 'calc(100vh - 16px)' }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div 
          className="w-[99%] mx-auto flex-1 flex flex-col overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="flex flex-col md:flex-row md:items-stretch md:justify-between w-full flex-1 px-2 py-2 mt-2 mb-2 rounded-lg shadow-xs bg-gray-50 to-white border border-1 border-gray-200 backdrop-blur-md overflow-hidden"
          >
            
            {/* Left: Products Section (always 60%) */}
            <div 
              className={`flex flex-col overflow-hidden relative transition-all duration-100 ease-in-out ${productsLoading ? 'w-full' : 'w-full md:w-[58%]'}`}
            >
              {/* Moved Room Type and Theme here - to top left of this container */}
              <div className="w-fit px-3 py-1.5 mb-2 border border-gray-200 rounded-lg bg-white flex items-center gap-1 shadow-sm">
                <span className="text-sm text-slate-900 font-semibold px-1">
                  Room Type: {space.room_type.charAt(0).toUpperCase() + space.room_type.slice(1)}
                </span>
                {space.theme && (
                  <span className="hidden sm:inline text-xs text-gray-400">•</span>
                )}
                {space.theme && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 capitalize">
                    Theme: {space.theme}
                  </span>
                )}
              </div>
              {!productsLoading && (
                <div className="hidden md:block w-[95%] h-[2px] my-2 rounded-full bg-[linear-gradient(to_right,transparent_0%,#d1d5db_10%,#d1d5db_90%,transparent_100%)] animate-in fade-in-0 slide-in-from-bottom-5 duration-300" />
              )}
              <div className="flex-1 md:pr-2 overflow-y-auto min-h-0 cute-scrollbar">
                {productsLoading ? (
                  <motion.div 
                    className="flex items-center justify-center h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div 
                      className="text-center space-y-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="relative">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#8338EC] rounded-full animate-spin mx-auto"></div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Searching for products, that match your space...</p>
                    </motion.div>
                  </motion.div>
                ) : productRecs.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No products to recommend. Please click on admin to get help.</span>
                  </div>
                ) : (
                  <motion.div 
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {productRecs.map((cat: any, idx: number) => (
                      <motion.div 
                        key={cat.category + idx} 
                        className="w-full"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      >
                        <div className="p-1 max-w-full space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-1 text-sm border border-1 border-[#8338EC]/10 font-semibold text-[#8338EC] bg-[#8338EC]/10 rounded-lg">
                                {cat.category}
                              </span>
                              <button
                                onClick={() => handleRemoveCategory(cat.category)}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                                title={`Remove ${cat.category} category`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {idx === 0 && (
                              <button
                                onClick={handleAutoSelect}
                                disabled={autoSelectLoading}
                                className={`inline-flex items-center px-4 py-1 text-sm font-semibold rounded-2xl transition-colors duration-200 ${
                                  autoSelectLoading 
                                    ? 'bg-gray-400 text-white border border-gray-400' 
                                    : 'bg-black text-white border border-black hover:bg-gray-800'
                                }`}
                              >
                                {autoSelectLoading && (
                                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                                )}
                                {autoSelectLoading ? 'Auto Selecting...' : 'Let AI choose'}
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 border-l-2 border-[#8338EC] pl-2 ml-1">
                            {cat.reason}
                          </div>
                        </div>
                        <div className="relative group">
                          {/* Left scroll button */}
                          {scrollStates[cat.category]?.canScrollLeft && (
                            <button
                              onClick={() => scrollLeft(cat.category)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          
                          {/* Right scroll button */}
                          {scrollStates[cat.category]?.canScrollRight && (
                            <button
                              onClick={() => scrollRight(cat.category)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          
                          <div 
                            ref={el => { scrollContainerRefs.current[cat.category] = el; }}
                            className="flex flex-nowrap overflow-x-auto pb-3 pt-3 relative cute-scrollbar2 gap-x-4"
                            onScroll={() => updateScrollState(cat.category)}
                          >
                            {cat.products.map((prod: any, prodIdx: number) => (
                              <motion.div 
                                key={prod.id} 
                                className="min-w-[220px] max-w-[220px] flex-shrink-0 bg-white rounded-xl"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ 
                                  duration: 0.4, 
                                  delay: 0.4 + idx * 0.1 + prodIdx * 0.05,
                                  ease: "easeOut"
                                }}
                                whileHover={{ 
                                  y: -2,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <ProductCard
                                  id={prod.id}
                                  image_url={prod.image_url}
                                  title={prod.title}
                                  price={prod.price}
                                  link={prod.link}
                                  isSelected={isProductSelected(prod.id, cat.category)}
                                  onSelect={(product: { id: string; title: string; image_url: string }) => handleProductSelect(product, cat.category)}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Dotted separator line - show after each category except the last one */}
                        {idx < productRecs.length - 1 && (
                          <div className="w-full flex justify-center my-2">
                            <div className="w-[99%] border-t-2  border-dashed border-gray-300"></div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            {/* Vertical Divider - only show when not loading */}
            {!productsLoading && (
              <div className="hidden md:block h-[95%] w-[2px] mx-2 mt-6 rounded-full bg-[linear-gradient(to_bottom,transparent_0%,#d1d5db_10%,#d1d5db_90%,transparent_100%)] animate-in fade-in-0 slide-in-from-right-5 duration-300" />
            )}
            {/* Right: Image Section (always 40%) - only show when not loading */}
            {!productsLoading && (
              <motion.div 
                className="flex h-full flex-1 relative z-[1] flex-col p-4 md:w-[42%] w-full"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-2xl aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                      <AnimatePresence mode="wait">
                        {isGeneratingImage && !generatedImageUrl ? (
                          <motion.div
                            key="generating"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <div className="text-center">
                              <TextShimmerWave 
                                className="font-semibold text-lg tracking-wide [--base-color:#af87e6] [--base-gradient-color:#8338EC]"
                              >
                                Generating image...
                              </TextShimmerWave>
                            </div>
                            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                              This may take a few moments
                            </p>
                          </motion.div>
                        ) : imageError ? (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center text-red-500"
                          >
                            <X className="w-12 h-12 mx-auto mb-2 text-red-400" />
                            <p className="font-medium">{imageError}</p>
                          </motion.div>
                        ) : generatedImageUrl ? (
                          <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                          >
                            <ImageWithOverlay imageUrl={generatedImageUrl} coordinates={coordinates} selectedProducts={selectedProducts} productRecs={productRecs} onError={() => setImageError('Failed to load generated image')} onExpandClick={() => setIsImageModalOpen(true)} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="default"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src="https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//genimgplaceholder.png"
                                alt="Default room design"
                                className="w-full h-full object-cover rounded-lg"
                                onError={() => {
                                  console.warn('Default image failed to load');
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* Generate Image Button at bottom center */}
                  <motion.div 
                    className="relative flex flex-col items-center justify-end mt-6 mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Tooltip show={showTooltip && !allCategoriesSelected}>
                      Choose atleast one product from each category or click on 'Let AI choose' button
                    </Tooltip>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                    <RainbowButton
                      aria-disabled={!allCategoriesSelected}
                      tabIndex={!allCategoriesSelected ? -1 : 0}
                      className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-8 py-3 flex items-center gap-2 ${!allCategoriesSelected ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onMouseEnter={() => { if (!allCategoriesSelected) setShowTooltip(true); }}
                      onMouseLeave={() => setShowTooltip(false)}
                      onFocus={() => { if (!allCategoriesSelected) setShowTooltip(true); }}
                      onBlur={() => setShowTooltip(false)}
                      onClick={e => {
                        if (!allCategoriesSelected) {
                          setShowTooltip(true);
                          e.preventDefault();
                        } else {
                          handleGenerateImage();
                        }
                      }}
                    >
                      Generate Image
                      <Coins className="w-4 h-4 text-yellow-500 ml-4" />
                      <span className="font-bold text-white text-xs -mr-2">10</span>
                    </RainbowButton>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Missing Products Modal */}
      <AnimatePresence>
        {showMissingProductsModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Selection Required</h3>
              <button
                onClick={() => setShowMissingProductsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please select at least one product from the following categories of your choice:
            </p>
            <div className="space-y-2 mb-6">
              {missingCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-800 capitalize">{category}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowMissingProductsModal(false)}
              className="w-full"
            >
              Got it
            </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insufficient Credits Modal */}
      {showInsufficientCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insufficient Credits</h3>
              <button
                onClick={() => setShowInsufficientCreditsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-gray-600 mb-2">
                You need at least <span className="font-semibold">10 credits</span> to generate an image.
              </p>
              <p className="text-sm text-gray-500">
                Current balance: <span className="font-medium">{userCredits} credits</span>
              </p>
            </div>
            <div className="text-center">
              <Button 
                className="w-full bg-[#8338EC] hover:bg-[#7c3aed]"
                onClick={() => window.open(`mailto:aditya12081998@gmail.com?subject=Credit Request&body=Hello,%0D%0A%0D%0AI would like to request additional credits for my account.%0D%0A%0D%0AMy userid: ${supabaseUserId}.%0D%0A%0D%0AThank you.`, '_blank')}
              >
                Request Credits from Admin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && generatedImageUrl && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Modal Image Container */}
            <div 
              className="relative bg-transparent rounded-lg p-4 max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - positioned inside image area */}
              <button 
                onClick={() => setIsImageModalOpen(false)} 
                className="absolute top-6 right-6 z-[100000] bg-black/50 hover:bg-black/70 rounded-full p-1 text-white transition-colors" 
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
                src={generatedImageUrl}
                alt="Generated room design"
                className="max-w-full max-h-full object-contain rounded"
                style={{ maxHeight: 'calc(90vh - 2rem)' }}
              />
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showRemoveCategoryModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Remove Category</h3>
                <button
                  onClick={() => {
                    setShowRemoveCategoryModal(false);
                    setCategoryToRemove(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600 text-center mb-2">
                  Are you sure you want to remove the <span className="font-semibold capitalize">"{categoryToRemove}"</span> category?
                </p>
                <p className="text-sm text-gray-500 text-center">
                  This will remove all products in this category and any selections you've made.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRemoveCategoryModal(false);
                    setCategoryToRemove(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRemoveCategory}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
