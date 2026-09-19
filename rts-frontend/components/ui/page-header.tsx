import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
  gradient?: "cyan" | "blue" | "purple" | "emerald" | "hero"
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions, 
  className,
  gradient = "cyan"
}: PageHeaderProps) {
  
  const gradientClass = `text-gradient-${gradient}`

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8", className)}>
      <div className="flex flex-col gap-2">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 text-sm text-zinc-500 mb-1">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <div key={item.label} className="flex items-center">
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-zinc-300 transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-zinc-300 font-medium" : ""}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="h-4 w-4 mx-1" />}
                </div>
              )
            })}
          </nav>
        )}
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tight mb-2", gradientClass)}>
            {title}
          </h1>
          {description && (
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      {actions && (
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {actions}
        </motion.div>
      )}
    </div>
  )
}
