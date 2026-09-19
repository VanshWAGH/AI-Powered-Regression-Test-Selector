"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createRepository } from "@/lib/api"
import { BuildSystem, CreateRepositoryRequest, Repository } from "@/lib/types"
import { Loader2, Server, Key, GitBranch, CheckCircle2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AddRepositoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (repo: Repository) => void
}

export function AddRepositoryDialog({ open, onOpenChange, onSuccess }: AddRepositoryDialogProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<CreateRepositoryRequest>({
    name: "",
    gitlabBaseUrl: "https://gitlab.com",
    gitlabProjectId: 0,
    accessToken: "",
    buildSystem: "GRADLE",
  })

  const resetState = () => {
    setStep(1)
    setError("")
    setFormData({
      name: "",
      gitlabBaseUrl: "https://gitlab.com",
      gitlabProjectId: 0,
      accessToken: "",
      buildSystem: "GRADLE",
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(resetState, 300)
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const repo = await createRepository(formData)
      setStep(4) // Success step
      setTimeout(() => {
        onSuccess(repo)
        handleOpenChange(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to add repository")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-panel border-purple-500/20 p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 w-full bg-zinc-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-400" />
              Add Repository
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {step === 1 && "Basic project information"}
              {step === 2 && "GitLab authentication credentials"}
              {step === 3 && "Build system configuration"}
              {step === 4 && "Connecting to repository..."}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-[200px] relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input 
                      id="name"
                      placeholder="e.g. orders-service" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-zinc-900 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">GitLab Base URL</Label>
                    <Input 
                      id="url"
                      placeholder="https://gitlab.com" 
                      value={formData.gitlabBaseUrl}
                      onChange={(e) => setFormData({...formData, gitlabBaseUrl: e.target.value})}
                      className="bg-zinc-900 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectId">GitLab Project ID</Label>
                    <Input 
                      id="projectId"
                      type="number"
                      placeholder="123456" 
                      value={formData.gitlabProjectId || ""}
                      onChange={(e) => setFormData({...formData, gitlabProjectId: parseInt(e.target.value) || 0})}
                      className="bg-zinc-900 border-zinc-700"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="token" className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-purple-400" />
                      Access Token
                    </Label>
                    <Input 
                      id="token"
                      type="password"
                      placeholder="glpat-xxxxxxxxxxxxxxxxxxxx" 
                      value={formData.accessToken}
                      onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                      className="bg-zinc-900 border-zinc-700"
                    />
                    <p className="text-xs text-zinc-500">
                      Needs `api` or `read_repository` + `read_api` scopes. Stored securely.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 mb-4">
                      <GitBranch className="h-4 w-4 text-purple-400" />
                      Build System
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                          formData.buildSystem === 'GRADLE' 
                            ? 'border-purple-500 bg-purple-500/10 text-white' 
                            : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
                        }`}
                        onClick={() => setFormData({...formData, buildSystem: 'GRADLE'})}
                      >
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center">G</div>
                        <span className="font-semibold">Gradle</span>
                      </div>
                      <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                          formData.buildSystem === 'MAVEN' 
                            ? 'border-purple-500 bg-purple-500/10 text-white' 
                            : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
                        }`}
                        onClick={() => setFormData({...formData, buildSystem: 'MAVEN'})}
                      >
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center">M</div>
                        <span className="font-semibold">Maven</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-8 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Repository Added!</h3>
                  <p className="text-zinc-400">Successfully connected to {formData.name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 4 && (
            <DialogFooter className="mt-8 flex items-center justify-between sm:justify-between w-full">
              <Button 
                variant="ghost" 
                onClick={() => step > 1 ? setStep(step - 1) : handleOpenChange(false)}
                className="text-zinc-400"
              >
                {step > 1 ? "Back" : "Cancel"}
              </Button>
              
              <Button 
                onClick={() => {
                  if (step < 3) setStep(step + 1)
                  else handleSubmit()
                }}
                disabled={
                  (step === 1 && (!formData.name || !formData.gitlabBaseUrl || !formData.gitlabProjectId)) ||
                  (step === 2 && !formData.accessToken) ||
                  isLoading
                }
                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 3 ? "Connect" : "Next"}
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
