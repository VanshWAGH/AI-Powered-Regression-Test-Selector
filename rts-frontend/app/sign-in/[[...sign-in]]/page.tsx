import { SignIn } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
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
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-blue-400" />
            <span className="text-3xl font-bold tracking-tight">RTS</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 max-w-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            AI-Powered Regression Test Selector
          </h2>
          <p className="text-lg text-zinc-300 max-w-md mt-4">
            Optimize your CI pipeline by running only the tests that matter. 
            Accelerate deployment with intelligent, space-age analysis.
          </p>
        </div>
      </div>

      {/* Right Pane - Clerk Sign In */}
      <div className="relative flex w-full lg:w-1/2 h-full items-center justify-center">
        <div className="absolute inset-0 bg-zinc-950/70 z-0 pointer-events-none" />
        <div className="relative z-10">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-zinc-950/60 border border-zinc-800/50 shadow-2xl backdrop-blur-xl rounded-2xl",
                headerTitle: "text-white font-bold text-xl",
                headerSubtitle: "text-zinc-400",
                dividerLine: "bg-zinc-800",
                dividerText: "text-zinc-500",
                socialButtonsBlockButton: "bg-zinc-900/80 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldLabel: "text-zinc-300 font-medium",
                formFieldInput: "bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all",
                footerActionText: "text-zinc-400",
                footerActionLink: "text-blue-400 hover:text-blue-300 font-medium transition-colors",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium border-0 shadow-lg shadow-blue-900/20 transition-all",
                identityPreviewText: "text-zinc-300",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
