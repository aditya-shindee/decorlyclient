import React from "react";
import { cn } from "@/lib/utils";
import { COLOR_PREFERENCES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {COLOR_PREFERENCES.map((color) => (
        <motion.div
          key={color.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button
            type="button"
            onClick={() => onChange(color.value)}
            className={cn(
              "h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              value === color.value 
                ? "border-[#8338EC] ring-2 ring-[#8338EC]/20" 
                : "border-transparent hover:border-gray-200"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.label}
          >
            {value === color.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white"
              >
                <Check size={16} />
              </motion.div>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );
}