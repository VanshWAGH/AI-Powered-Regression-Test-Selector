import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "cyan" | "blue" | "purple" | "emerald"
  glowOnHover?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glowOnHover = true, children, ...props }, ref) => {
    
    const glowClass = {
      default: "hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
      cyan: "hover:glass-glow-cyan",
      blue: "hover:glass-glow-blue",
      purple: "hover:glass-glow-purple",
      emerald: "hover:glass-glow-emerald",
    }[variant]

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "glass-card rounded-xl overflow-hidden transition-all duration-300",
          glowOnHover && glowClass,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = "GlassCard"
