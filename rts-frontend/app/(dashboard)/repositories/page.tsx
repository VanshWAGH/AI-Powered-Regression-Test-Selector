"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { getRepositories } from "@/lib/api"
import { Repository } from "@/lib/types"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { FolderGit2, Plus, RefreshCw, Trash2, ShieldCheck, MoreVertical, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { AddRepositoryDialog } from "@/components/add-repository-dialog"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  useEffect(() => {
    loadRepositories()
  }, [])

  async function loadRepositories() {
    setIsLoading(true)
    try {
      const data = await getRepositories()
      setRepositories(data)
    } catch (error) {
      console.error("Failed to load repositories", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRepositoryAdded = (newRepo: Repository) => {
    setRepositories(prev => [newRepo, ...prev])
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Repositories" 
        description="Manage connected GitLab repositories and their analysis status."
        gradient="purple"
        actions={
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900/80 p-1 rounded-lg border border-zinc-800 hidden md:flex">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-400"}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-400"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : repositories.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No repositories connected"
          description="Connect your first GitLab repository to start generating AI-powered test recommendations."
          action={{
            label: "Add Repository",
            icon: Plus,
            onClick: () => setIsAddDialogOpen(true)
          }}
        />
      ) : (
        <motion.div 
          layout
          className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AnimatePresence>
            {repositories.map((repo, index) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard 
                  variant="purple" 
                  className={`p-0 overflow-visible group cursor-pointer h-full flex flex-col ${viewMode === 'list' ? 'flex-row items-center p-4' : ''}`}
                  onClick={() => router.push(`/repositories/${repo.id}`)}
                >
                  <div className={`p-6 flex-1 flex flex-col ${viewMode === 'list' ? 'flex-row items-center justify-between w-full p-2' : ''}`}>
                    <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/3' : 'mb-4'}`}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                          <FolderGit2 className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                            {repo.name}
                          </h3>
                          <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                            {repo.gitlabProjectPath || repo.gitlabBaseUrl}
                          </p>
                        </div>
                      </div>
                      
                      {viewMode === 'grid' && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 -mr-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-panel border-zinc-800 w-48">
                              <DropdownMenuItem className="cursor-pointer">
                                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-400" />
                                Validate Connection
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <RefreshCw className="h-4 w-4 mr-2 text-blue-400" />
                                Sync Metadata
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Repository
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'w-1/3 justify-center' : 'mb-6'}`}>
                      <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300">
                        {repo.buildSystem}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300">
                        {repo.defaultBranch}
                      </span>
                    </div>

                    <div className={`mt-auto flex items-center justify-between ${viewMode === 'list' ? 'w-1/3 justify-end gap-6' : ''}`}>
                      <StatusBadge status={repo.connectionStatus} />
                      <span className="text-xs text-zinc-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {repo.lastSyncedAt ? formatDistanceToNow(new Date(repo.lastSyncedAt), { addSuffix: true }) : 'Never'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AddRepositoryDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSuccess={handleRepositoryAdded}
      />
    </div>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
