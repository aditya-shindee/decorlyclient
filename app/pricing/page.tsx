'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShineBorder } from '@/components/ui/shine-border';
import { toast } from 'sonner';

// Create a client component that uses useSearchParams
function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [creditAmount, setCreditAmount] = useState(500);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Capture ref parameter from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefUrl(ref);
    }
  }, [searchParams]);

  // Calculate derived values
  const cost = (creditAmount / 100) * 1;
  const images = Math.floor((creditAmount / 100) * 10);
  const spaces = Math.floor((creditAmount / 100) * 7);

  // Preset values
  const presets = [100, 500, 1000];

  // Handle preset button clicks
  const handlePresetClick = (amount: number) => {
    setCreditAmount(amount);
  };

  // Handle +/- buttons
  const handleIncrement = () => {
    setCreditAmount(prev => prev + 100);
  };

  const handleDecrement = () => {
    setCreditAmount(prev => Math.max(100, prev - 100));
  };

  // Check if current amount matches a preset
  const getActivePreset = () => {
    return presets.includes(creditAmount) ? creditAmount : null;
  };

  // Handle free plan
  const handleContinueFree = () => {
    router.push('/studio');
  };

  // Handle purchase
  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success toast
      toast.success(`Payment successful! You've purchased ${creditAmount.toLocaleString()} credits.`, {
        duration: 5000,
        position: 'top-right',
      });
      
      // Redirect back to ref URL or studio
      setTimeout(() => {
        router.push(refUrl || '/studio');
      }, 1500);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-2 sm:p-2 items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl mx-auto w-full md:h-full shadow-xl border border-gray-100 relative z-10 items-center justify-center overflow-hidden">
        <div className="w-full max-w-10xl px-4 py-8 items-center justify-center"> {/* py-10 to py-8 */}
          <header className="text-center mb-8"> {/* mb-10 to mb-8 */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
              Buy credits
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Get started with AI design. Pick a credit bundle and create beautiful rooms.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start"> {/* gap-8 to gap-6 */}
            <div className="bg-white rounded-2xl p-4 flex flex-col border-2 border-slate-300 h-full"> {/* p-6 to p-4 */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-slate-800">Free</h2>
                <div className="mt-4"> {/* mt-6 to mt-4 */}
                  <span className="text-5xl font-extrabold text-slate-900">$0</span>
                </div>
                <ul className="mt-6 space-y-3 text-base"> {/* mt-8 to mt-6, space-y-4 to space-y-3 */}
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-emerald-500 mr-3" />
                    <span className="text-slate-700">1 space</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-emerald-500 mr-3" />
                    <span className="text-slate-700">1 Image generation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-emerald-500 mr-3" />
                    <span className="text-slate-700">Watermark</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-emerald-500 mr-3" />
                    <span className="text-slate-700">Unlimited auto select</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6"> {/* mt-8 to mt-6 */}
                <button
                  className="w-full bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-colors duration-300 text-base"
                  onClick={() => window.location.href = "/studio"}
                >
                  Continue for free
                </button>
              </div>
            </div>
            <ShineBorder color={["#8338EC", "#8338EC", "#8338EC", "#8338EC", "#8338EC"]} borderRadius={16} borderWidth={2} className="h-full">
              <div className="relative bg-white rounded-2xl p-4 flex flex-col h-full"> {/* p-6 to p-4 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8338EC] text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                  POPULAR
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-slate-800">Pay As You Go</h2>
                  <p className="mt-1 text-slate-500 text-base">Buy credits as per your requirement.</p> {/* mt-2 to mt-1 */}
                  <div className="mt-4 bg-slate-100/70 p-4 rounded-xl"> {/* mt-6 to mt-4, p-6 to p-4 */}
                    <label className="block text-sm font-medium text-slate-700 text-center">
                      Choose your credit bundle
                    </label>
                    <div className="mt-3 grid grid-cols-3 gap-1"> {/* gap-1.5 to gap-1 */}
                      {presets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => handlePresetClick(preset)}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                            getActivePreset() === preset
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {preset.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleDecrement}
                          disabled={creditAmount <= 100}
                          className="w-12 h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-center font-semibold text-gray-900">
                          {creditAmount.toLocaleString()} credits
                        </div>
                        
                        <button
                          onClick={handleIncrement}
                          className="w-12 h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-lg mt-4">
                      <p className="text-sm text-gray-600 mb-2">You can generate approximately</p>
                      <p className="font-semibold text-purple-700 text-lg">
                        {spaces} Spaces or {images} Images
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-slate-600 text-sm font-medium">Total Cost</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${cost.toFixed(2)}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm"> {/* mt-4 to mt-3, space-y-3 to space-y-2, text-base to text-sm */}
                    <li className="flex items-center">
                      <Check className="h-6 w-6 text-indigo-500 mr-3" />
                      <span className="text-slate-700">No watermark</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-6 w-6 text-indigo-500 mr-3" />
                      <span className="text-slate-700">High quality image generation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-6 w-6 text-indigo-500 mr-3" />
                      <span className="text-slate-700">Dedicated Email Support</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4"> {/* mt-6 to mt-4 */}
                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Purchase Credits (coming soon)'
                    )}
                  </Button>
                </div>
              </div>
            </ShineBorder>
          </div>
          <div className="w-full text-center mt-6"> {/* mt-6 to mt-4 */}
            <div className="text-center text-sm text-gray-500 w-full max-w-2xl mx-auto whitespace-normal">
              Need enterprise solutions? &nbsp;
              <a
                href="https://mail.google.com/mail/?view=cm&to=admin@example.com"
                target="_blank"
                className="text-black underline text-sm hover:text-blue-700"
              >
                 Contact our team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}