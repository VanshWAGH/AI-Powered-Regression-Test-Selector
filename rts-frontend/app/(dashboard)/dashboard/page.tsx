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
import { getAggregateStats } from "@/lib/api"
import { AggregateStats } from "@/lib/types"
import { CardSkeleton } from "@/components/ui/loading-skeleton"

// Mock data for charts
const recallTrendData = Array.from({ length: 14 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  recall: 90 + Math.random() * 10,
}))

const reductionData = [
  { name: 'MR-142', reduction: 75, saved: 45 },
  { name: 'MR-141', reduction: 62, saved: 32 },
  { name: 'MR-140', reduction: 85, saved: 60 },
  { name: 'MR-139', reduction: 55, saved: 25 },
  { name: 'MR-138', reduction: 70, saved: 40 },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<AggregateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch stats for all repos (mocking a global id or just using the first mock repo id)
        const data = await getAggregateStats('550e8400-e29b-41d4-a716-446655440001')
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats", error)
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
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
              <AreaChart data={recallTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 100]} />
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
              <BarChart data={reductionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="reduction" radius={[4, 4, 0, 0]}>
                  {reductionData.map((entry, index) => (
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
