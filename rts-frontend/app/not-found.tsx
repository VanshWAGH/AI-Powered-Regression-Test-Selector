import { Button } from "@/components/ui/button"
import { Home, Compass } from "lucide-react"
import Link from "next/link"
import { ThreeScene } from "@/components/three-scene"

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <ThreeScene variant="login" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-zinc-950/90 z-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg p-8 glass-panel rounded-3xl mx-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
          <Compass className="h-10 w-10 text-blue-500 animate-spin-slow" />
        </div>
        <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-zinc-300">Lost in Deep Space</h2>
        <p className="text-zinc-400">
          The page or resource you're looking for doesn't exist, has been moved, or you don't have access to it.
        </p>
        <Link href="/dashboard" className="mt-8">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
            <Home className="mr-2 h-5 w-5" />
            Return to Mission Control
          </Button>
        </Link>
      </div>
    </div>
  )
}
