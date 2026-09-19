"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ThreeScene } from "@/components/three-scene"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.")
      return
    }

    setIsLoading(true)
    
    try {
      // Mock signup process since we might not have a signup endpoint yet
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // On success, redirect to signin
      router.push("/auth/signin")
    } catch (err) {
      setError("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen w-full bg-zinc-950 overflow-hidden">
      {/* Left Pane - Space Image */}
      <div className="hidden lg:flex relative w-1/2 h-full items-center justify-center overflow-hidden">
        <Image 
          src="/space-bg.jpg" 
          alt="Deep Space Galaxy" 
          fill
          className="object-cover"
          priority
        />
        {/* Overlays for blending and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-950/50 to-zinc-950 z-10" />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />
        
        <div className="relative z-20 flex flex-col items-start justify-end h-full p-16 w-full text-white">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-10 w-10 text-blue-400" />
              <span className="text-3xl font-bold tracking-tight">RTS</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 max-w-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              AI-Powered Regression Test Selector
            </h2>
            <p className="text-lg text-zinc-300 max-w-md mt-4">
              Join us to optimize your CI pipeline by running only the tests that matter. 
              Accelerate deployment with intelligent, space-age analysis.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="relative flex w-full lg:w-1/2 h-full items-center justify-center">
        {/* Subtle 3D background behind the form for extra premium feel */}
        <div className="absolute inset-0 z-0 opacity-40">
           <ThreeScene variant="login" />
        </div>
        {/* Gradient mask so the 3D scene fades into the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-zinc-950/90 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-zinc-950/70 z-0 pointer-events-none backdrop-blur-[2px]" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md px-4 sm:px-8 relative z-10"
        >
          <div className="glass-panel rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl overflow-hidden relative">
            {/* Top glow accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8 lg:hidden">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4"
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-gradient-hero">Join RTS</h1>
                <p className="text-zinc-400 mt-2 text-center text-sm">
                  Create an account to get started
                </p>
              </div>

              <div className="hidden lg:flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Sign Up</h1>
                <p className="text-zinc-400 mt-2 text-center text-sm">
                  Create an account to access the dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-300">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="admin" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-700/50 text-white h-11 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-700/50 text-white h-11 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-700/50 text-white h-11 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 transition-all group mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center text-sm text-zinc-400">
                  Already have an account?{" "}
                  <a href="/auth/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
                  </a>
                </div>
              </form>
            </div>
            
            <div className="bg-zinc-900/80 p-4 border-t border-zinc-800/50 text-center">
              <p className="text-xs text-zinc-500">
                Enterprise Grade AI Testing • v1.0.0
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
