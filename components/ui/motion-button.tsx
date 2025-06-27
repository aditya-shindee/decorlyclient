'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonHover, buttonTap } from '@/lib/animations';
import Link from 'next/link';

interface MotionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
}

export function MotionButton({
  href,
  children,
  className,
  variant = 'default',
}: MotionButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 py-2 px-4";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    gradient: "bg-gradient-to-r from-[#FB5607] via-[#FF006E] to-[#8338EC] text-white"
  };
  
  return (
    <motion.div
      whileHover={buttonHover}
      whileTap={buttonTap}
      className="inline-block"
    >
      <Link 
        href={href}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}