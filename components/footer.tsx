import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-16 px-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-100 opacity-15 animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-lg bg-indigo-100 opacity-20 animate-float-medium rotate-45"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 rounded-full bg-purple-200 opacity-25 animate-float-fast"></div>
        
        {/* Subtle Particles */}
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-2/3 left-2/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-35 animate-bounce"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="text-center space-y-8">
          {/* Logo */}
          <Link href="/" className="group inline-flex items-center justify-center" aria-label="decorly home">
            <div className="flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <div className="absolute h-6 w-6 border-2 border-[#1A202C] opacity-80"></div>
              <div className="absolute h-6 w-6 translate-x-1.5 translate-y-1.5 border-2 border-[#8338EC]"></div>
            </div>
            <span className="ml-4 mt-2 font-poppins text-xl font-semibold uppercase tracking-widest text-[#1A202C]">
              decorly
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-gray-600 text-lg font-light max-w-md mx-auto leading-relaxed">
            Craft your dream space with AI-powered interior design
          </p>

          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-8">
            <a href="#how-it-works" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">How It Works</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </a>
            
            <a href="#gallery" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">Gallery</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </a>
            
            <a href="/pricing" className="group relative text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium">
              <span className="relative z-10">Pricing</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </a>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center space-x-4 py-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 opacity-40"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-purple-300 to-transparent opacity-60"></div>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Decorly. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs">
              Made with ✨ for beautiful spaces
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(90deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
      `}</style>
    </footer>
  );
};

export default Footer; 