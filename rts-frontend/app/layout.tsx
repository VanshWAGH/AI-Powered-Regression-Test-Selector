import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RTS | AI-Powered Regression Test Selector",
    template: "%s | RTS Dashboard"
  },
  description: "Intelligent regression test selection for enterprise CI/CD pipelines.",
  keywords: ["RTS", "Regression Test Selector", "CI/CD", "Testing", "AI", "GitLab"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable)}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              card: "bg-zinc-950/60 border border-zinc-800/50 backdrop-blur-xl",
            }
          } as any}
        >
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}