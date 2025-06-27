"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000", // Default color, will be overridden by props in usage
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`, // Ensure this is used by the ::before pseudo-element's padding
        } as React.CSSProperties
      }
      className={cn(
        "relative grid w-full bg-white p-3 text-black dark:bg-black dark:text-white", // Removed h-full, place-items-center
        "rounded-[var(--border-radius)]",
        className, // Allows overriding defaults like p-3 and bg-white
      )}
    >
      <div // This div hosts the ::before pseudo-element for the shine effect.
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--shine-pulse-duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${
              color instanceof Array ? color.join(",") : color
            },transparent,transparent)`,
          } as React.CSSProperties
        }
        className={cn(
          "col-start-1 row-start-1 w-full h-full",
          `before:bg-shine-size before:absolute before:inset-0 before:size-full before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:[background-image:var(--background-radial-gradient)] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:var(--mask-linear-gradient)] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`,
          "before:rounded-[var(--border-radius)]" 
        )}
      ></div>
      <div className="relative z-[1] col-start-1 row-start-1 w-full h-full">{children}</div>
    </div>
  );
}

export { ShineBorder };
