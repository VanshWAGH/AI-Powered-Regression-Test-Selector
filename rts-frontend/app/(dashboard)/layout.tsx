"use client"

import { Sidebar } from "@/components/sidebar"
import { useSession } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen w-full overflow-hidden mesh-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-20 glass-panel border-b border-zinc-800/50 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="outline" className="hidden md:flex bg-zinc-900/50 border-zinc-800 text-zinc-400 w-64 justify-start hover:bg-zinc-800 hover:text-zinc-300 rounded-full">
              <Search className="h-4 w-4 mr-2" />
              Search repositories, MRs...
              <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-zinc-800/50 rounded-full">
              <Bell className="h-5 w-5 text-zinc-400" />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 mx-auto max-w-7xl min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
