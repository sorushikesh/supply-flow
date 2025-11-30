import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative overflow-hidden" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs hover:shadow-md hover:shadow-primary/30",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs hover:shadow-md hover:shadow-destructive/30",
        outline: " border [border-color:var(--badge-outline)] shadow-xs hover:border-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), "transition-all duration-300 hover:scale-105 group", className)} {...props}>
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 overflow-hidden rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1s_ease-in-out]" />
      </span>
      <span className="relative z-10">{props.children}</span>
    </div>
  );
}

export { Badge, badgeVariants }
