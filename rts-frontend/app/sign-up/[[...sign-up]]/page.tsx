import { SignUp } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
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
        <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay z-10" />
        
        <div className="relative z-20 flex flex-col items-start justify-end h-full p-16 w-full text-white">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-purple-400" />
            <span className="text-3xl font-bold tracking-tight">RTS</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 max-w-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            Join the Future of Testing
          </h2>
          <p className="text-lg text-zinc-300 max-w-md mt-4">
            Create your account and start optimizing your CI pipeline with 
            AI-powered regression test selection.
          </p>
        </div>
      </div>

      {/* Right Pane - Clerk Sign Up */}
      <div className="relative flex w-full lg:w-1/2 h-full items-center justify-center">
        <div className="absolute inset-0 bg-zinc-950/70 z-0 pointer-events-none" />
        <div className="relative z-10">
          <SignUp 
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
                formFieldInput: "bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all",
                footerActionText: "text-zinc-400",
                footerActionLink: "text-purple-400 hover:text-purple-300 font-medium transition-colors",
                formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium border-0 shadow-lg shadow-purple-900/20 transition-all",
                identityPreviewText: "text-zinc-300",
                identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
