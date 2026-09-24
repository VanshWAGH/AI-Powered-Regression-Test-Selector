import { Button } from "@/components/ui/button"
import { Shield, Zap, Clock, ArrowRight, GitMerge, Activity, Code2 } from "lucide-react"
import Link from "next/link"
import { ThreeScene } from "@/components/three-scene"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col overflow-hidden selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950 z-0" />
      <div className="absolute inset-0 z-0 opacity-40">
        <ThreeScene variant="dashboard" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5 bg-zinc-950/50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            RTS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center mt-20 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse-glow" />
          RTS 1.0 is now live for enterprise
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-zinc-400 animate-fade-in-up animation-delay-100">
          Ship Faster. Test Smarter. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Never Break the Build.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 animate-fade-in-up animation-delay-200">
          AI-Powered Regression Test Selection that analyzes your code changes and runs only the tests that matter. Cut CI/CD pipeline times by up to 70% without sacrificing safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-300">
          <Link href="/auth/signup">
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/25 group">
              Start Optimizing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 text-white backdrop-blur-sm">
              View Live Demo
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-32 animate-fade-in-up animation-delay-400">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AST Code Analysis</h3>
            <p className="text-zinc-400 text-sm">
              Deep inspection of Java source code diffs to pinpoint exactly which methods and classes were modified.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glass-glow-purple">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Heuristics</h3>
            <p className="text-zinc-400 text-sm">
              Combines code impact, historical failure rates, and coverage data to rank tests by risk probability.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Massive Time Savings</h3>
            <p className="text-zinc-400 text-sm">
              Reduce a 45-minute test suite down to 5 minutes for minor PRs, saving thousands of compute hours.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-zinc-500 text-sm bg-zinc-950/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} RTS - AI-Powered Regression Test Selector. All rights reserved.</p>
      </footer>
    </div>
  )
}
