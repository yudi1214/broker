"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimeSelectorProps {
  onSelectTime: (seconds: number) => void
  selectedTime: number
  disabled?: boolean
}

export function TimeSelector({ onSelectTime, selectedTime, disabled = false }: TimeSelectorProps) {
  const [open, setOpen] = useState(false)

  const quickTimes = [
    { label: "30s", value: 30 },
    { label: "1m", value: 60 },
    { label: "5m", value: 300 },
    { label: "15m", value: 900 },
  ]

  const turboTimes = [
    { label: "5s", value: 5 },
    { label: "10s", value: 10 },
    { label: "15s", value: 15 },
    { label: "30s", value: 30 },
  ]

  const classicTimes = [
    { label: "1m", value: 60 },
    { label: "5m", value: 300 },
    { label: "15m", value: 900 },
    { label: "1h", value: 3600 },
  ]

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h`
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-background hover:bg-muted/30 transition-colors text-foreground"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">Tempo: {formatTime(selectedTime)}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Tabs defaultValue="quick">
          <div className="border-b px-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick" className="text-sm font-medium">
                Rápido
              </TabsTrigger>
              <TabsTrigger value="turbo" className="text-sm font-medium">
                Turbo
              </TabsTrigger>
              <TabsTrigger value="classic" className="text-sm font-medium">
                Clássico
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="quick" className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {quickTimes.map((time) => (
                <Button
                  key={time.value}
                  variant={selectedTime === time.value ? "default" : "outline"}
                  className={cn(
                    "transition-all text-foreground font-medium",
                    selectedTime === time.value && "border-primary shadow-sm bg-primary text-primary-foreground",
                  )}
                  onClick={() => {
                    onSelectTime(time.value)
                    setOpen(false)
                  }}
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="turbo" className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {turboTimes.map((time) => (
                <Button
                  key={time.value}
                  variant={selectedTime === time.value ? "default" : "outline"}
                  className={cn(
                    "transition-all text-foreground font-medium",
                    selectedTime === time.value && "border-primary shadow-sm bg-primary text-primary-foreground",
                  )}
                  onClick={() => {
                    onSelectTime(time.value)
                    setOpen(false)
                  }}
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classic" className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {classicTimes.map((time) => (
                <Button
                  key={time.value}
                  variant={selectedTime === time.value ? "default" : "outline"}
                  className={cn(
                    "transition-all text-foreground font-medium",
                    selectedTime === time.value && "border-primary shadow-sm bg-primary text-primary-foreground",
                  )}
                  onClick={() => {
                    onSelectTime(time.value)
                    setOpen(false)
                  }}
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
