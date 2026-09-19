"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { getRepository, getMergeRequests, getAggregateStats } from "@/lib/api"
import { Repository, MergeRequest, AggregateStats } from "@/lib/types"
import { Skeleton, TableSkeleton } from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { FolderGit2, GitMerge, Settings, ShieldCheck, RefreshCw, BarChart, ArrowRight, GitBranch } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import Link from "next/link"
import { motion } from "framer-motion"

export default function RepositoryDetailPage() {
  const params = useParams()
  const repoId = params.id as string
  
  const [repo, setRepo] = useState<Repository | null>(null)
  const [mrs, setMrs] = useState<MergeRequest[]>([])
  const [stats, setStats] = useState<AggregateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [repoData, mrsData, statsData] = await Promise.all([
          getRepository(repoId),
          getMergeRequests(repoId),
          getAggregateStats(repoId)
        ])
        setRepo(repoData)
        setMrs(mrsData.slice(0, 5)) // Show only recent 5
        setStats(statsData)
      } catch (error) {
        console.error("Failed to load repository details", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [repoId])

  if (isLoading) {
    return (
      <div className="space-y-8 pb-10">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96 md:col-span-1" />
        </div>
      </div>
    )
  }

  if (!repo) return <div>Repository not found</div>

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title={repo.name} 
        description={repo.gitlabProjectPath || repo.gitlabBaseUrl}
        gradient="purple"
        breadcrumbs={[
          { label: "Repositories", href: "/repositories" },
          { label: repo.name }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Validate
            </Button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid gap-6 md:grid-cols-4">
        <GlassCard variant="purple" className="p-5">
          <p className="text-sm font-medium text-zinc-400 mb-2">Connection Status</p>
          <div className="flex items-center justify-between">
            <StatusBadge status={repo.connectionStatus} />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          {repo.lastSyncedAt && (
            <p className="text-xs text-zinc-500 mt-3">
              Last synced: {formatDistanceToNow(new Date(repo.lastSyncedAt), { addSuffix: true })}
            </p>
          )}
        </GlassCard>

        <GlassCard variant="cyan" className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="h-4 w-4 text-cyan-500" />
            <p className="text-sm font-medium text-zinc-400">Total Evaluations</p>
          </div>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter value={stats?.evaluationCount || 0} />
          </p>
        </GlassCard>

        <GlassCard variant="emerald" className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-medium text-zinc-400">Avg Recall</p>
          </div>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter value={stats?.avgRecallPct || 0} decimals={1} suffix="%" />
          </p>
        </GlassCard>

        <GlassCard variant="blue" className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <FolderGit2 className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-medium text-zinc-400">Build System</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400">
              {repo.buildSystem}
            </span>
            <span className="px-3 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300">
              {repo.testFramework}
            </span>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent MRs */}
        <GlassCard className="md:col-span-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-blue-400" />
                Recent Merge Requests
              </h3>
              <p className="text-sm text-zinc-400">Latest activity generating RTS recommendations.</p>
            </div>
            <Link href={`/merge-requests?repositoryId=${repoId}`}>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {mrs.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                No merge requests found for this repository.
              </div>
            ) : (
              mrs.map((mr, index) => (
                <Link href={`/merge-requests/${mr.id}`} key={mr.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
                        {mr.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>!{mr.gitlabIid}</span>
                        <span>•</span>
                        <span>{mr.authorUsername}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(mr.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <StatusBadge status={mr.state} />
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </GlassCard>

        {/* Configuration Summary */}
        <GlassCard className="md:col-span-1 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <GitBranch className="h-5 w-5 text-zinc-400" />
            GitLab Details
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Project ID</p>
              <p className="text-sm text-zinc-300 font-mono bg-zinc-900 p-2 rounded border border-zinc-800">
                {repo.gitlabProjectId}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Base URL</p>
              <a href={repo.gitlabBaseUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
                {repo.gitlabBaseUrl}
              </a>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Default Branch</p>
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-xs font-mono text-zinc-300">
                {repo.defaultBranch}
              </span>
            </div>
            <div className="pt-4 border-t border-zinc-800/50 mt-4">
              <p className="text-xs text-zinc-500 mb-2">Registration Date</p>
              <p className="text-sm text-zinc-300">
                {new Date(repo.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
