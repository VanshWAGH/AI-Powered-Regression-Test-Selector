"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getMergeRequest, generateRecommendation } from "@/lib/api"
import { MergeRequest, TestRecommendation } from "@/lib/types"
import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { GitMerge, GitBranch, User, Clock, CheckCircle2, Copy, Zap, BarChart3, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"

export default function MergeRequestDetail() {
  const params = useParams()
  const mrId = params.id as string
  
  const [mr, setMr] = useState<MergeRequest | null>(null)
  const [recommendation, setRecommendation] = useState<TestRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const mrData = await getMergeRequest(mrId)
        setMr(mrData)
        
        // Auto-load recommendation if it exists (for mock purposes, we'll try to generate it immediately to show the UI)
        try {
          const recData = await generateRecommendation(mrId)
          setRecommendation(recData)
        } catch (e) {
          console.log("No recommendation exists yet")
        }
      } catch (error) {
        console.error("Failed to load MR details", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [mrId])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const data = await generateRecommendation(mrId)
      setRecommendation(data)
    } catch (error) {
      console.error("Failed to generate", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 pb-10">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!mr) return <div>MR not found</div>

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title={mr.title} 
        description={`Merge Request !${mr.gitlabIid}`}
        gradient="blue"
        breadcrumbs={[
          { label: "Merge Requests", href: "/merge-requests" },
          { label: `!${mr.gitlabIid}` }
        ]}
        actions={
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={() => window.open(mr.webUrl, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on GitLab
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* MR Details Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-500 mb-1">State</p>
                <StatusBadge status={mr.state} />
              </div>
              
              <div>
                <p className="text-sm text-zinc-500 mb-1">Author</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300 font-medium">{mr.authorUsername}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">Branch Configuration</p>
                <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                    <GitBranch className="h-4 w-4 text-blue-400" />
                    <span className="font-mono text-xs">{mr.sourceBranch}</span>
                  </div>
                  <div className="pl-2 border-l-2 border-zinc-800 ml-2 mb-2">
                    <div className="h-4 w-px bg-zinc-700" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <GitBranch className="h-4 w-4 text-purple-400" />
                    <span className="font-mono text-xs font-medium text-white">{mr.targetBranch}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-1">Last Updated</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">
                    {formatDistanceToNow(new Date(mr.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recommendation Engine Area */}
        <div className="md:col-span-2">
          {!recommendation ? (
            <GlassCard className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-500/20">
              <Zap className="h-16 w-16 text-blue-500 mb-6 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">AI Test Recommendation</h3>
              <p className="text-zinc-400 max-w-md mb-8">
                Generate a targeted subset of tests that cover the changes in this merge request. Save CI time without sacrificing safety.
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-8"
              >
                {isGenerating ? "Analyzing Code Changes..." : "Generate Recommendation"}
              </Button>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {/* Recommendation Summary */}
              <GlassCard variant="cyan" className="p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Zap className="h-32 w-32" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  Recommendation Ready
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Selected Tests</p>
                    <p className="text-2xl font-bold text-white">
                      {recommendation.recommendedCount} <span className="text-sm text-zinc-500 font-normal">/ {recommendation.totalTestsConsidered}</span>
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Time Reduction</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {recommendation.estimatedTimeReductionPct.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-blue-400">High</p>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Maven Selector</p>
                    <p className="text-xs text-zinc-500 font-mono line-clamp-1 max-w-[300px]">
                      -Dtest={recommendation.rankedTests.filter(t => t.recommended).map(t => t.className).join(',')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 bg-zinc-800 border-zinc-700">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </GlassCard>

              {/* Ranked Tests List */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Ranked Tests Explanation
                  </h3>
                </div>

                <div className="space-y-4">
                  {recommendation.rankedTests.slice(0, 5).map((test, index) => (
                    <div key={index} className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {test.recommended ? (
                              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-zinc-600" />
                            )}
                            <span className="font-medium text-zinc-100">{test.className}</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-mono ml-4">{test.methodName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white mb-1">{(test.score * 100).toFixed(0)}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Score</p>
                        </div>
                      </div>
                      
                      {/* Signal Breakdown Chart (Mini) */}
                      <div className="p-4 bg-zinc-950/50 h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(test.signalBreakdown).map(([name, val]) => ({ name, value: val * 100 }))} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} fill="#a1a1aa" width={100} />
                            <Tooltip 
                              cursor={{fill: 'transparent'}}
                              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', fontSize: '12px' }}
                            />
                            <Bar dataKey="value" barSize={6} radius={[0, 4, 4, 0]}>
                              {Object.entries(test.signalBreakdown).map((_, i) => (
                                <Cell key={`cell-${i}`} fill={test.recommended ? '#8b5cf6' : '#52525b'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                  
                  {recommendation.rankedTests.length > 5 && (
                    <Button variant="ghost" className="w-full text-zinc-400 hover:text-white">
                      View all {recommendation.rankedTests.length} tests
                    </Button>
                  )}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
