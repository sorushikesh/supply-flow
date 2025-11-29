import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs hover:shadow-glow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:shadow-glow-purple",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: " border [border-color:var(--badge-outline)] shadow-xs hover:border-primary/50",
        neon: "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-glow-sm",
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
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
