import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Apple-like glass buttons: blur, subtle border, inner highlight, soft shadow
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-300 ease-out transform-gpu will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-60 select-none rounded-lg relative overflow-hidden group hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] dark:before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] before:transition-transform before:duration-700 hover:before:translate-x-full",
  {
    variants: {
      variant: {
        glass:
          "backdrop-blur-xl bg-white/30 dark:bg-neutral-900/30 border border-white/30 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.12),_inset_0_1px_0_rgba(255,255,255,0.6)] text-foreground hover:bg-white/40 dark:hover:bg-neutral-900/40 active:bg-white/45 dark:active:bg-neutral-900/45 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18),_inset_0_1px_0_rgba(255,255,255,0.6)]",
        "glass-outline":
          "backdrop-blur-xl bg-white/15 dark:bg-neutral-900/15 border border-white/35 dark:border-white/10 text-foreground shadow-[0_4px_18px_rgba(0,0,0,0.08)] hover:bg-white/25 dark:hover:bg-neutral-900/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.14)]",
        default: "bg-primary text-white shadow hover:bg-primary/90 hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline underline-offset-4 hover:opacity-90 hover:no-underline",
      },
      size: {
        sm: "h-10 min-h-[44px] px-4 text-sm leading-5 rounded-md",
        default: "h-12 min-h-[48px] px-6 text-base leading-6 rounded-lg",
        lg: "h-12 min-h-[48px] px-6 text-base leading-6 rounded-lg",
        xl: "h-12 min-h-[48px] px-8 text-base leading-6 rounded-lg",
        icon: "h-12 w-12 min-w-[48px] min-h-[48px] rounded-lg",
        "icon-lg": "h-12 w-12 min-w-[48px] min-h-[48px] rounded-lg",
        "icon-xl": "h-12 w-12 min-w-[48px] min-h-[48px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
