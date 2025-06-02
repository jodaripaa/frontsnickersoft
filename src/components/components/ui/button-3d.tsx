"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button3dVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-[0_6px_0_0_#2563eb] hover:shadow-[0_4px_0_0_#2563eb] active:shadow-[0_0_0_0_#2563eb]",
        destructive:
          "bg-red-600 text-white shadow-[0_6px_0_0_#dc2626] hover:shadow-[0_4px_0_0_#dc2626] active:shadow-[0_0_0_0_#dc2626]",
        outline:
          "border border-input bg-background shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#e5e7eb] active:shadow-[0_0_0_0_#e5e7eb] hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-cyan-500 text-white shadow-[0_6px_0_0_#0891b2] hover:shadow-[0_4px_0_0_#0891b2] active:shadow-[0_0_0_0_#0891b2]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-emerald-500 text-white shadow-[0_6px_0_0_#059669] hover:shadow-[0_4px_0_0_#059669] active:shadow-[0_0_0_0_#059669]",
      },
      size: {
        default: "h-12 px-6 py-4",
        sm: "h-10 rounded-md px-4",
        lg: "h-14 rounded-md px-8",
        icon: "h-12 w-12",
      },
      shine: {
        true: "relative overflow-hidden",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shine: true,
    },
  },
)

export interface Button3dProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button3dVariants> {
  asChild?: boolean
}

const Button3d = React.forwardRef<HTMLButtonElement, Button3dProps>(
  ({ className, variant, size, shine, ...props }, ref) => {
    return (
      <button className={cn(button3dVariants({ variant, size, shine, className }))} ref={ref} {...props}>
        <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
        {shine && (
          <span className="absolute inset-0 z-0 translate-x-[-100%] transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[1.5s] group-hover:translate-x-[100%]"></span>
        )}
      </button>
    )
  },
)
Button3d.displayName = "Button3d"

export { Button3d, button3dVariants }
