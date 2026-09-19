"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, GitMerge, Settings, Activity, FolderGit2, LogOut, ChevronDown } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/repositories", icon: FolderGit2 },
  { name: "Merge Requests", href: "/merge-requests", icon: GitMerge },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative flex h-full flex-col glass-panel border-r-0 border-r-zinc-800/50 shadow-2xl z-20"
    >
      {/* Logo & Title */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
        <Link href="/dashboard" className="flex items-center gap-3 relative z-10 w-full group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <span className="text-white font-bold text-xl tracking-tighter">R</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400"
              >
                RTS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.name} href={item.href}>
              <div className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 px-4 py-6 h-12 transition-all relative z-10 rounded-xl",
                    isActive
                      ? "text-blue-400 hover:text-blue-300 hover:bg-transparent"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 group-hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]")} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-base whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </Link>
          )
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-zinc-800/50">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full h-14 items-center justify-start gap-3 px-2 hover:bg-zinc-800/50 rounded-xl outline-none transition-colors">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start overflow-hidden flex-1"
                >
                  <span className="text-sm font-medium text-zinc-200 truncate w-full text-left">
                    {session?.user?.name || "Admin User"}
                  </span>
                  <span className="text-xs text-zinc-500 truncate w-full text-left">
                    {session?.user?.email || "admin@rts.local"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {!isCollapsed && <ChevronDown className="h-4 w-4 text-zinc-500 ml-auto" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-panel border-zinc-800">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              className="text-rose-400 focus:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
