import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        CONNECTED: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        PENDING: "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse-glow",
        FAILED: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        DISCONNECTED: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
        OPENED: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        MERGED: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        CLOSED: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
      },
    },
    defaultVariants: {
      status: "DISCONNECTED",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status: "CONNECTED" | "PENDING" | "FAILED" | "DISCONNECTED" | "OPENED" | "MERGED" | "CLOSED"
  showDot?: boolean
}

export function StatusBadge({ className, status, showDot = true, ...props }: StatusBadgeProps) {
  
  const dotColor = {
    CONNECTED: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    PENDING: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    FAILED: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    DISCONNECTED: "bg-zinc-400",
    OPENED: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    MERGED: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
    CLOSED: "bg-zinc-400",
  }[status]

  return (
    <div className={cn(badgeVariants({ status }), className)} {...props}>
      {showDot && (
        <span className="mr-1.5 flex h-1.5 w-1.5 relative">
          {status === 'PENDING' && (
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColor)}></span>
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColor)}></span>
        </span>
      )}
      {status}
    </div>
  )
}
