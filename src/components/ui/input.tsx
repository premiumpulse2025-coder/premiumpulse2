import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Glass base
        "bg-white/60 backdrop-blur-md",
        "border border-white/60",
        "shadow-[0_2px_12px_rgba(109,40,217,0.07),0_1px_0_rgba(255,255,255,0.9)_inset]",
        // Layout & typography
        "file:text-foreground placeholder:text-muted-foreground/70",
        "selection:bg-primary selection:text-primary-foreground",
        "flex h-9 w-full min-w-0 rounded-xl px-3 py-1 text-base",
        "transition-all duration-200 outline-none",
        // File input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        // Focus — brighter glass + violet glow ring
        "focus-visible:bg-white/85 focus-visible:border-violet-300/70",
        "focus-visible:ring-[3px] focus-visible:ring-violet-400/20",
        "focus-visible:shadow-[0_0_0_3px_rgba(139,92,246,0.12),0_4px_16px_rgba(109,40,217,0.10)]",
        // Validation
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
