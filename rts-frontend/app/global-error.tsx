"use client"

import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={cn("dark", "h-full", geistSans.variable, geistMono.variable, outfit.variable)}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-8 p-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="h-12 w-12 text-rose-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Critical Error</h1>
            <p className="text-lg text-zinc-400 max-w-lg">
              A critical application error occurred. The application state could not be recovered automatically.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => reset()}
              size="lg"
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              Try to Recover
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </div>
          {error.digest && (
            <p className="text-xs text-zinc-600 font-mono mt-8">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
