"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { getEvaluations, getAggregateStats } from "@/lib/api"
import { RecommendationEvaluation, AggregateStats } from "@/lib/types"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid, Legend, ComposedChart, Line
} from "recharts"
import { format } from "date-fns"
import { Activity, ShieldAlert, Zap, Clock, AlertTriangle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [evaluations, setEvaluations] = useState<RecommendationEvaluation[]>([])
  const [stats, setStats] = useState<AggregateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const repoId = '550e8400-e29b-41d4-a716-446655440001'
        const [evalsData, statsData] = await Promise.all([
          getEvaluations(repoId),
          getAggregateStats(repoId)
        ])
        
        // Sort ascending by date for charts
        setEvaluations([...evalsData].sort((a, b) => 
          new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime()
        ))
        setStats(statsData)
      } catch (error) {
        console.error("Failed to load analytics data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Prepare chart data
  const chartData = evaluations.map(e => ({
    date: format(new Date(e.evaluatedAt), 'MMM dd'),
    recall: e.recallPct || 0,
    precision: e.precisionPct || 0,
    reduction: e.timeSavedPct || 0,
    totalTests: e.totalTests,
    selectedTests: e.selectedTests,
    missed: e.missedFailures
  }))

  const missedEvals = evaluations.filter(e => e.missedFailures > 0)

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Analytics & Evaluation" 
        description="Deep dive into recommendation engine performance and safety metrics."
        gradient="emerald"
        actions={
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Top KPIs */}
      <div className="grid gap-6 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <GlassCard variant="emerald" className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-medium text-zinc-400">Avg Recall</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats?.avgRecallPct || 0} decimals={1} suffix="%" />
              </div>
            </GlassCard>

            <GlassCard variant="cyan" className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                <h3 className="text-sm font-medium text-zinc-400">Avg Reduction</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats?.avgTimeSavedPct || 0} decimals={1} suffix="%" />
              </div>
            </GlassCard>

            <GlassCard variant="blue" className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-medium text-zinc-400">Total Evals</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats?.evaluationCount || 0} />
              </div>
            </GlassCard>

            <GlassCard variant={missedEvals.length > 0 ? "default" : "emerald"} className={`p-5 flex flex-col justify-between ${missedEvals.length > 0 ? 'border-rose-500/30' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-5 w-5 ${missedEvals.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
                <h3 className="text-sm font-medium text-zinc-400">Missed Failures</h3>
              </div>
              <div className={`text-3xl font-bold ${missedEvals.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                <AnimatedCounter value={missedEvals.length} />
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recall & Reduction Over Time */}
        <GlassCard className="p-6 md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Recall vs Reduction</h3>
            <p className="text-sm text-zinc-400">Balancing safety (recall) with performance gains (reduction).</p>
          </div>
          <div className="h-[350px] w-full">
            {!isLoading && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRecallGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '14px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Area yAxisId="left" type="monotone" name="Recall %" dataKey="recall" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorRecallGrad)" />
                  <Line yAxisId="right" type="monotone" name="Reduction %" dataKey="reduction" stroke="#38bdf8" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Test Volume Breakdown */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Test Volume Per Run</h3>
            <p className="text-sm text-zinc-400">Selected tests vs Total suite size.</p>
          </div>
          <div className="h-[300px] w-full">
            {!isLoading && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar name="Selected Tests" dataKey="selectedTests" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                  <Bar name="Skipped Tests" dataKey={(d) => d.totalTests - d.selectedTests} stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Missed Failures Alert */}
        <GlassCard className={`p-6 flex flex-col ${missedEvals.length > 0 ? 'border-rose-500/30 bg-rose-950/10' : ''}`}>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className={`h-6 w-6 ${missedEvals.length > 0 ? 'text-rose-500' : 'text-zinc-500'}`} />
            <h3 className="text-lg font-semibold text-white">Missed Failure Incidents</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {missedEvals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
                <ShieldAlert className="h-12 w-12 text-emerald-500/50 mb-3" />
                <p>No missed failures in the selected period.</p>
                <p className="text-sm">The model is operating safely.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missedEvals.map((evalRecord, idx) => (
                  <div key={idx} className="bg-zinc-900/80 rounded-lg p-4 border border-rose-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-zinc-400">Eval: {evalRecord.id.split('-')[0]}</span>
                      <span className="text-xs text-zinc-500">{format(new Date(evalRecord.evaluatedAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="text-rose-400 font-medium">
                      {evalRecord.missedFailures} test(s) failed in full suite but were excluded by RTS.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
