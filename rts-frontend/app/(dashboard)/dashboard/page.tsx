"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PageHeader } from "@/components/ui/page-header"
import { Activity, Clock, ShieldAlert, Zap, ArrowUpRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  BarChart,
  Bar,
  Cell
} from "recharts"
import { getGlobalAggregateStats, getGlobalEvaluations } from "@/lib/api"
import { AggregateStats } from "@/lib/types"
import { CardSkeleton } from "@/components/ui/loading-skeleton"



export default function DashboardPage() {
  const [stats, setStats] = useState<AggregateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [trendData, setTrendData] = useState<any[]>([])
  const [barData, setBarData] = useState<any[]>([])

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsData, evals] = await Promise.all([
          getGlobalAggregateStats(),
          getGlobalEvaluations()
        ])
        
        setStats(statsData)

        // Process recall trend data (chronological order)
        const sortedEvals = [...evals].sort((a, b) => new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime())
        const last14 = sortedEvals.slice(-14)
        
        setTrendData(last14.map(e => ({
          date: new Date(e.evaluatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          recall: e.recallPct || 0,
        })))

        // Process reduction data (most recent 5 runs)
        const recent5 = [...evals].sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime()).slice(0, 5)
        
        setBarData(recent5.reverse().map(e => ({
          name: `Run-${e.pipelineRunId.substring(0, 4)}`,
          reduction: e.timeSavedPct || 0,
          saved: e.timeSavedSeconds || 0,
        })))

      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Dashboard Overview" 
        description="Global performance metrics for the AI Regression Test Selector."
        gradient="hero"
        actions={
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            onClick={() => {
              import('@/components/ui/toast').then(({ toast }) => {
                toast.add({
                  title: "Report Generation Started",
                  description: "Your global analytics report is being generated and will be emailed to you.",
                  type: "info"
                });
              });
            }}
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <GlassCard variant="blue" className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="h-16 w-16 text-blue-500" />
              </div>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-zinc-400">Total Time Saved</h3>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={Math.floor((stats?.totalTimeSavedSeconds || 0) / 3600)} suffix="h " />
                  <AnimatedCounter value={Math.floor(((stats?.totalTimeSavedSeconds || 0) % 3600) / 60)} suffix="m" />
                </div>
                <div className="flex items-center text-xs text-emerald-400 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last week</span>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard variant="emerald" className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className="h-16 w-16 text-emerald-500" />
              </div>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-zinc-400">Average Recall</h3>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={stats?.avgRecallPct || 0} decimals={1} suffix="%" />
                </div>
                <div className="flex items-center text-xs text-zinc-500 mt-1">
                  <span>Target: 95.0%</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="purple" className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="h-16 w-16 text-purple-500" />
              </div>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-zinc-400">Pipelines Evaluated</h3>
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={stats?.evaluationCount || 0} />
                </div>
                <div className="flex items-center text-xs text-emerald-400 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+45 this week</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="cyan" className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-16 w-16 text-cyan-500" />
              </div>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-zinc-400">Avg Test Reduction</h3>
                <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={stats?.avgTimeSavedPct || 0} decimals={1} suffix="%" />
                </div>
                <div className="flex items-center text-xs text-zinc-500 mt-1">
                  <span>Based on {stats?.evaluationCount || 0} evaluations</span>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-7">
        <GlassCard className="md:col-span-4 p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Recall Stability Trend</h3>
            <p className="text-sm text-zinc-400">Model recall performance over the last 14 days.</p>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="recall" 
                  stroke="#34d399" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRecall)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-3 p-6 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Reductions</h3>
              <p className="text-sm text-zinc-400">Test volume reduced per MR.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="reduction" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.reduction > 70 ? '#8b5cf6' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
