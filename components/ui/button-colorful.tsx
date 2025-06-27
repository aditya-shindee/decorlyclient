import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: React.ReactNode;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-10 px-4 overflow-hidden",
                "bg-white hover:bg-[#8338EC]/10",
                "transition-all duration-200",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-[#8338EC]",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                {typeof label === 'string' ? (
                    <>
                        <span className="text-black font-semibold group-hover:text-black transition-colors">{label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-black group-hover:text-black transition-colors" />
                    </>
                ) : (
                    label
                )}
            </div>
        </Button>
    );
}