"use client"

import { PageHeader } from "@/components/ui/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { Save, User, Server, Bell, Palette } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Settings" 
        description="Manage your account, API configurations, and application preferences."
        gradient="purple"
      />

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Server className="w-4 h-4 mr-2" />
            API & Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <GlassCard className="p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">User Profile</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl text-white font-bold">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <Button variant="outline" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800">
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={session?.user?.name || ""} className="bg-zinc-900/50 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={session?.user?.email || ""} className="bg-zinc-900/50 border-zinc-800" readOnly />
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="api">
          <GlassCard className="p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Backend Configuration</h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-400">API Connection</h4>
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input defaultValue={API_BASE_URL} className="bg-zinc-900/50 border-zinc-800 font-mono text-sm text-zinc-300" />
                  <p className="text-xs text-zinc-500">The endpoint where the Spring Boot RTS backend is running.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-400">Global Webhook Secret</h4>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="rts-super-secret-webhook-key-12345" readOnly className="bg-zinc-900/50 border-zinc-800 font-mono text-sm text-zinc-300" />
                    <Button variant="outline" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 shrink-0">
                      Generate New
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500">Used to verify payloads incoming from GitLab.</p>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Configurations
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notifications">
          <GlassCard className="p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">Missed Failure Alerts</Label>
                  <p className="text-sm text-zinc-500">Receive an email immediately if RTS excludes a test that actually failed.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">Weekly Analytics Report</Label>
                  <p className="text-sm text-zinc-500">A summary of time saved and recall metrics sent every Monday.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">New Merge Requests</Label>
                  <p className="text-sm text-zinc-500">Browser notifications when a new MR is ingested.</p>
                </div>
                <Switch />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="appearance">
          <GlassCard className="p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Theme Settings</h3>
            <p className="text-sm text-zinc-400 mb-6">The RTS Dashboard is currently optimized for Dark Mode.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-blue-500 rounded-xl p-4 bg-zinc-950 flex flex-col items-center justify-center cursor-pointer">
                <div className="h-20 w-full bg-zinc-900 rounded-md mb-3 flex items-center justify-center border border-zinc-800">
                  <span className="text-zinc-500 font-semibold">Dark</span>
                </div>
                <span className="font-medium text-white">Sleek Dark (Active)</span>
              </div>
              <div className="border-2 border-zinc-800 rounded-xl p-4 bg-zinc-950 flex flex-col items-center justify-center cursor-not-allowed opacity-50">
                <div className="h-20 w-full bg-zinc-100 rounded-md mb-3 flex items-center justify-center border border-zinc-300">
                  <span className="text-zinc-400 font-semibold">Light</span>
                </div>
                <span className="font-medium text-zinc-500">Light Mode (Coming Soon)</span>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
