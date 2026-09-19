"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { getMergeRequests } from "@/lib/api"
import { MergeRequest } from "@/lib/types"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { GitMerge, Search, Filter, ArrowRight, GitBranch, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function MergeRequestsPage() {
  const [mergeRequests, setMergeRequests] = useState<MergeRequest[]>([])
  const [filteredMRs, setFilteredMRs] = useState<MergeRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadMRs() {
      setIsLoading(true)
      try {
        const data = await getMergeRequests()
        setMergeRequests(data)
        setFilteredMRs(data)
      } catch (error) {
        console.error("Failed to load merge requests", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMRs()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMRs(mergeRequests)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredMRs(
        mergeRequests.filter(
          (mr) =>
            mr.title.toLowerCase().includes(query) ||
            mr.authorUsername.toLowerCase().includes(query) ||
            mr.sourceBranch.toLowerCase().includes(query) ||
            mr.gitlabIid.toString().includes(query)
        )
      )
    }
  }, [searchQuery, mergeRequests])

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Merge Requests" 
        description="Track active merge requests and their AI-powered test recommendations."
        gradient="blue"
      />

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search by title, author, branch..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900/50 border-zinc-700/50 w-full focus:border-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="bg-zinc-900/50 border-zinc-700 w-full md:w-auto hover:bg-zinc-800">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </GlassCard>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : filteredMRs.length === 0 ? (
        <EmptyState
          icon={GitMerge}
          title="No merge requests found"
          description={searchQuery ? "No merge requests match your search criteria." : "No merge requests have been ingested yet. They will appear here when webhooks trigger."}
        />
      ) : (
        <GlassCard className="overflow-hidden p-0 border border-zinc-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Merge Request</th>
                  <th className="px-6 py-4 font-medium">State</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Branches</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Updated</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMRs.map((mr, index) => (
                  <motion.tr 
                    key={mr.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/merge-requests/${mr.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {mr.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          !{mr.gitlabIid}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={mr.state} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                          {mr.authorUsername.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-zinc-300">{mr.authorUsername}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <GitBranch className="h-3 w-3 text-zinc-500" />
                          <span className="truncate max-w-[150px]">{mr.sourceBranch}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-4">
                          <ArrowRight className="h-3 w-3 text-zinc-600" />
                          <span className="truncate max-w-[150px] font-medium text-zinc-300">{mr.targetBranch}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(mr.updatedAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
                        View Details
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
