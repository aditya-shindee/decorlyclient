'use client';
import Link from 'next/link';
import React from 'react';
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from '@/components/ui/image-comparison';
import HowItWorksSection from '@/components/how-it-works';
import GallerySection from '@/components/gallery';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-100 opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-lg bg-indigo-100 opacity-15 animate-float-medium rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-purple-200 opacity-25 animate-float-fast"></div>
        
        {/* Subtle Particles */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-35 animate-bounce"></div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer flex items-center justify-center overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/59cace5d72567411298dc94bd6e16c7612b07f48/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg"
              alt="Bolt Badge"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 mt-2">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center" aria-label="decorly home">
            <div className="flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <div className="absolute h-6 w-6 border-2 border-[#1A202C] opacity-80"></div>
              <div className="absolute h-6 w-6 translate-x-1.5 translate-y-1.5 border-2 border-[#8338EC]"></div>
            </div>
            <span className="ml-4 mt-2 font-poppins text-xl font-semibold uppercase tracking-widest text-[#1A202C]">
              decorly
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">How It Works</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 bg-purple-100/0 group-hover:bg-purple-100/10 rounded-lg -m-2 p-2 transition-all duration-300"></div>
            </a>
            
            <a href="#gallery" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">Gallery</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 bg-purple-100/0 group-hover:bg-purple-100/10 rounded-lg -m-2 p-2 transition-all duration-300"></div>
            </a>
            
            <a href="/pricing" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">Pricing</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
              <div className="absolute inset-0 bg-purple-100/0 group-hover:bg-purple-100/10 rounded-lg -m-2 p-2 transition-all duration-300"></div>
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/sign-in" className="group relative px-6 py-2 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-slate-800 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-indigo-200/40 backdrop-blur-sm">
              <span className="relative z-10 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-semibold">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/50 to-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16 pb-20 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              {/* Floating Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-100 shadow-sm animate-fade-in">
                <span className="text-purple-600 text-sm font-medium">✨ Do More Than Just Browsing Furniture</span>
              </div>

              <div className="relative space-y-6">
                {/* Decorative Background Blur */}
                <div
                  className="absolute -bottom-20 -right-20 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-subtle-glow"
                  style={{ animationDelay: '2s' }}
                  aria-hidden="true"
                ></div>

                <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  <span className="block font-serif font-light italic text-slate-600 tracking-wide">
                    Craft Your
                  </span>
                  
                  <span className="block font-Sans  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8338EC] to-[#E040FB] tracking-tighter my-2">
                    DREAM SPACE
                  </span>
                
                </h1>
                
                <div className="pt-4">
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Just upload a photo to begin the magic.
                    <br />
                    Your ideal room is only a click away. ✨
                  </p>
                </div>
              </div>
              

              {/* CTA Button */}
              <div className="flex items-center space-x-6">
                <Link href="/studio" className="group relative px-7 py-3.5 bg-gradient-to-br from-indigo-500/25 via-purple-500/25 to-pink-500/25 text-slate-800 rounded-2xl font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-indigo-200/40 backdrop-blur-sm">
                  <span className="relative z-10 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">Go to Studio</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/50 to-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </Link>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              {/* Main demo container */}
              <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 animate-fade-in-right">
                {/* Before/After Preview */}
                <div className="space-y-6">
                  {/* Image Comparison Slider */}
                  {(() => {
                    const beforeImg = 'https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//image1_resized.png';
                    const afterImg = 'https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//image2_resized.png';
                    return (
                      <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto">
                        <ImageComparison className="w-full h-full rounded-xl shadow overflow-hidden">
                          <ImageComparisonImage
                            src={beforeImg}
                            alt="Before Room"
                            position="left"
                          />
                          <ImageComparisonImage
                            src={afterImg}
                            alt="After Room"
                            position="right"
                          />
                          <ImageComparisonSlider className="bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full shadow-lg !w-0.5">
                            <div className="w-5 h-5 bg-white border-2 border-purple-500 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8"/></svg>
                            </div>
                          </ImageComparisonSlider>
                        </ImageComparison>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Floating furniture icons */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float-medium">
                <span className="text-purple-600">🪑</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float-slow">
                <span className="text-indigo-600">🌿</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <HowItWorksSection id="how-it-works" />
      <GallerySection id="gallery" />
      <Footer />
      {/* Custom styles */}
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
        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-delay {
          0%, 20% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay-2 {
          0%, 40% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 87%; }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 1s ease-out; }
        .animate-fade-in-delay-2 { animation: fade-in-delay-2 1.2s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
        .animate-progress { animation: progress 2s ease-out; }
      `}</style>
    </div>
  );
}