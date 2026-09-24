"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
        <AlertCircle className="h-10 w-10 text-rose-500" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-white tracking-tight">Something went wrong!</h2>
        <p className="text-zinc-400">
          We encountered an unexpected error while rendering this page. The issue has been logged.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
