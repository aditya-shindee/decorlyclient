import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "@/lib/animations";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  required = false,
}: FormSectionProps) {
  return (
    <motion.div
      variants={slideUp}
      className={cn("mb-8", className)}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            {title}
            {required && <span className="text-[#FF006E] ml-1">*</span>}
          </h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </motion.div>
  );
}