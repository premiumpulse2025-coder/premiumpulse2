import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — shared by all variants
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold",
    "transition-all duration-200 cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/30",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    // Subtle glass inner highlight on all buttons
    "relative overflow-hidden",
    "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid primary — dark with frosted sheen
        default:
          "bg-primary/90 backdrop-blur-sm text-primary-foreground " +
          "shadow-[0_4px_16px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.15)_inset] " +
          "hover:bg-primary hover:shadow-[0_8px_24px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.2)_inset] " +
          "hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",

        // Destructive — red glass
        destructive:
          "bg-destructive/85 backdrop-blur-sm text-white " +
          "shadow-[0_4px_16px_rgba(220,38,38,0.25),0_1px_0_rgba(255,255,255,0.15)_inset] " +
          "hover:bg-destructive hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] " +
          "hover:-translate-y-0.5 active:translate-y-0 " +
          "focus-visible:ring-destructive/30",

        // Outline — frosted white glass
        outline:
          "bg-white/60 backdrop-blur-md border border-white/70 text-foreground " +
          "shadow-[0_2px_12px_rgba(109,40,217,0.08),0_1px_0_rgba(255,255,255,0.95)_inset] " +
          "hover:bg-white/85 hover:border-violet-200/80 hover:text-violet-700 " +
          "hover:shadow-[0_6px_20px_rgba(109,40,217,0.12),0_1px_0_rgba(255,255,255,0.95)_inset] " +
          "hover:-translate-y-0.5 active:translate-y-0",

        // Secondary — soft glass tint
        secondary:
          "bg-white/45 backdrop-blur-sm border border-white/50 text-secondary-foreground " +
          "shadow-[0_2px_8px_rgba(109,40,217,0.06),0_1px_0_rgba(255,255,255,0.85)_inset] " +
          "hover:bg-white/70 hover:shadow-[0_4px_14px_rgba(109,40,217,0.10)] " +
          "hover:-translate-y-0.5 active:translate-y-0",

        // Ghost — glass on hover only
        ghost:
          "bg-transparent hover:bg-white/50 hover:backdrop-blur-sm " +
          "hover:border hover:border-white/60 " +
          "hover:shadow-[0_2px_12px_rgba(109,40,217,0.07)] " +
          "hover:text-accent-foreground",

        // Link — no glass
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm:      "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg:      "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon:    "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
