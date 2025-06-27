'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// NOTE: Ensure you have these ImageComparison components in your project
// as they were part of the initial code you provided.
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '@/components/image-comparison';

// TYPE DEFINITIONS FOR THE "HOW IT WORKS" SECTION
interface Step {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface StepContentProps {
  title: string;
  description: string;
  isActive: boolean;
}

interface StepVisualProps {
  imageUrl: string;
  isActive: boolean;
}

// DATA FOR THE "HOW IT WORKS" SECTION
const stepsData: Step[] = [
  {
    id: 1,
    title: 'Choose Your Style & Preferences',
    description:
      'Select room type, Snap a photo of your space(optional), then you choose your vibe: modern minimalist, cozy bohemian, sleek Scandinavian, or whatever speaks to your soul. and any other instruction',
    // Replace with your actual image path
    imageUrl: 'https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//hiw1.png',
  },
  {
    id: 2,
    title: 'Recommendations that Meets Your Wishlist',
    description:
      'Watch our AI work its magic, curating the perfect furniture and decor that fits your style and space like a glove. Shop handpicked recommendations and see every piece styled to perfection in your actual room.',
    // Replace with your actual image path
    imageUrl: 'https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//selectprod.png',
  },
  {
    id: 3,
    title: 'See It, Love It, Live It',
    description:
      'Get a stunning, photorealistic preview of your transformed space with every chosen piece in place. No guesswork, no regrets—just your dream room, ready to become reality.',
    // Replace with your actual image path
    imageUrl: 'https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//imagegen.png',
  },
];

// Reusable Sub-components for the "How It Works" Section
const StepContent: React.FC<StepContentProps> = ({ title, description, isActive }) => (
  <div
    className={`space-y-4 transition-opacity duration-500 ${
      isActive ? 'opacity-100' : 'opacity-40'
    }`}
  >
    <h3 className="text-3xl font-bold text-slate-800 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
    <p className="text-sm text-gray-400 italic">*short description can be added here.</p>
  </div>
);

const StepVisual: React.FC<StepVisualProps> = ({ imageUrl, isActive }) => (
  <div
    className={`relative transition-all duration-700 ease-in-out ${
      isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
    }`}
  >
    <img
      src={imageUrl}
      alt="Feature visual"
      className="w-full h-auto rounded-lg object-cover shadow-lg"
    />
  </div>
);

const HowItWorksSection: React.FC<{ id: string }> = ({ id }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Type assertion to let TypeScript know about dataset
            const stepId = parseInt((entry.target as HTMLElement).dataset.stepId!, 10);
            setActiveStep(stepId);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when element is at viewport center
        threshold: 0,
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const progressHeight =
    stepsData.length > 1
      ? `${((activeStep - 1) / (stepsData.length - 1)) * 100}%`
      : '0%';

  return (
    <section id={id} className="py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        
        
        {/* Subtle Particles */}
        {/* <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-35 animate-bounce"></div>
        <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-indigo-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-purple-300 rounded-full opacity-25 animate-ping"></div> */}
      </div>

      <svg className="absolute w-0 h-0">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Take a look at how we it is done
          </h2>
        </div>

        <div className="relative">
          {/* Vertical Line - Hidden on mobile, visible on desktop */}
          <div className="absolute left-1/2 -ml-px w-0.5 bg-slate-200 hidden lg:block" style={{ top: '10px', bottom: '60px' }}>
            <div
              className="absolute top-0 left-0 w-full bg-purple-500 transition-all duration-500 ease-out"
              style={{ height: progressHeight }}
            ></div>
          </div>

          <div className="relative space-y-32">
            {stepsData.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-step-id={step.id}
                className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
              >
                {/* Step Number Circle - Hidden on mobile, visible on desktop */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                      activeStep >= step.id
                        ? 'bg-white border-purple-500 text-purple-500 shadow-lg'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.id}
                  </div>
                </div>

                {/* Visual Column (alternates order) */}
                <div className={`lg:col-start-${index % 2 === 0 ? 1 : 2}`}>
                  <StepVisual imageUrl={step.imageUrl} isActive={activeStep === step.id} />
                </div>
                
                {/* Text Column (alternates order and text alignment) */}
                <div className={`lg:row-start-1 lg:col-start-${index % 2 === 0 ? 2 : 1} ${index % 2 !== 0 ? 'lg:text-right' : ''}`}>
                  <StepContent
                    title={step.title}
                    description={step.description}
                    isActive={activeStep === step.id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;