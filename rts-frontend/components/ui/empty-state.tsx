import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center glass-panel rounded-xl min-h-[400px]", className)}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="h-24 w-24 rounded-full glass-card flex items-center justify-center relative z-10 border-blue-500/30">
          <Icon className="h-10 w-10 text-blue-400" strokeWidth={1.5} />
        </div>
      </motion.div>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-xl font-semibold text-zinc-100 mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-zinc-400 max-w-md mb-8"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button onClick={action.onClick} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
