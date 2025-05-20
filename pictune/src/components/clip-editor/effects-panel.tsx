"use client"

import { useState } from "react"
import { Settings, ChevronDown, Sliders, Wand2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

// Add TypeScript interfaces at the top of the file
interface EffectsPanelProps {
  settings: any
  updateSetting: (key: string, value: any) => void
}

const animations = [
  { label: "Fade", value: "fade" },
  { label: "Slide", value: "slide" },
  { label: "Zoom", value: "zoom" },
  { label: "Bounce", value: "bounce" },
  { label: "Pulse", value: "pulse" },
  { label: "None", value: "none" },
]

const transitions = [
  { label: "Smooth", value: "smooth" },
  { label: "Sharp", value: "sharp" },
  { label: "Elastic", value: "elastic" },
  { label: "None", value: "none" },
]

const videoQualities = [
  { label: "Low (480p)", value: "low" },
  { label: "Medium (720p)", value: "medium" },
  { label: "High (1080p)", value: "high" },
  { label: "Ultra (4K)", value: "ultra" },
]

const videoFormats = [
  { label: "MP4", value: "mp4" },
  { label: "WebM", value: "webm" },
  { label: "GIF", value: "gif" },
]

export default function EffectsPanel({ settings, updateSetting }: EffectsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="animation">אנימציית טקסט</Label>
        <Select value={settings.animation} onValueChange={(value) => updateSetting("animation", value)}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
            <SelectValue placeholder="בחר אנימציה" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {animations.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transitions">מעברים בין מילים</Label>
        <Select value={settings.transitions} onValueChange={(value) => updateSetting("transitions", value)}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
            <SelectValue placeholder="בחר סוג מעבר" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {transitions.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="video-settings" className="border-gray-800/50">
          <AccordionTrigger className="hover:bg-gray-800/30 px-3 py-2 rounded-md">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>הגדרות וידאו</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-quality">איכות וידאו</Label>
              <Select value={settings.videoQuality} onValueChange={(value) => updateSetting("videoQuality", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                  <SelectValue placeholder="בחר איכות" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {videoQualities.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-format">פורמט וידאו</Label>
              <Select value={settings.videoFormat} onValueChange={(value) => updateSetting("videoFormat", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                  <SelectValue placeholder="בחר פורמט" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {videoFormats.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="framerate" className="flex justify-between">
                <span>קצב פריימים</span>
                <span className="text-gray-400">{settings.framerate} FPS</span>
              </Label>
              <Slider
                id="framerate"
                min={15}
                max={60}
                step={1}
                value={[settings.framerate]}
                onValueChange={(value) => updateSetting("framerate", value[0])}
                className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="audio-settings" className="border-gray-800/50">
          <AccordionTrigger className="hover:bg-gray-800/30 px-3 py-2 rounded-md">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 10v3a5 5 0 0 0 5 5h3v-3a5 5 0 0 0-5-5H2Z" />
                <path d="M14 6v3a5 5 0 0 0 5 5h3v-3a5 5 0 0 0-5-5h-3Z" />
                <path d="M8 14v3a5 5 0 0 0 5 5h3v-3a5 5 0 0 0-5-5H8Z" />
              </svg>
              <span>הגדרות אודיו</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-fade-in" className="flex justify-between">
                <span>פייד אין</span>
                <span className="text-gray-400">{settings.audioFadeIn}s</span>
              </Label>
              <Slider
                id="audio-fade-in"
                min={0}
                max={3}
                step={0.1}
                value={[settings.audioFadeIn]}
                onValueChange={(value) => updateSetting("audioFadeIn", value[0])}
                className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio-fade-out" className="flex justify-between">
                <span>פייד אאוט</span>
                <span className="text-gray-400">{settings.audioFadeOut}s</span>
              </Label>
              <Slider
                id="audio-fade-out"
                min={0}
                max={3}
                step={0.1}
                value={[settings.audioFadeOut]}
                onValueChange={(value) => updateSetting("audioFadeOut", value[0])}
                className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button
          variant="outline"
          className="w-full bg-gradient-to-r from-red-600/10 to-blue-600/10 hover:from-red-600/20 hover:to-blue-600/20 border-gray-700/50"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Wand2 className="h-4 w-4 ml-2" />
          אפקטים מתקדמים
          <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-2 pb-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/50">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync">סנכרון אוטומטי למוזיקה</Label>
            <Switch
              id="auto-sync"
              checked={settings.autoSync}
              onCheckedChange={(checked) => updateSetting("autoSync", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="color-match">התאמת צבעים לתמונה</Label>
            <Switch
              id="color-match"
              checked={settings.colorMatch}
              onCheckedChange={(checked) => updateSetting("colorMatch", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="beat-detection">זיהוי קצב</Label>
            <Switch
              id="beat-detection"
              checked={settings.beatDetection}
              onCheckedChange={(checked) => updateSetting("beatDetection", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-subtitles">כתוביות אוטומטיות</Label>
            <Switch
              id="auto-subtitles"
              checked={settings.autoSubtitles}
              onCheckedChange={(checked) => updateSetting("autoSubtitles", checked)}
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gradient-to-r from-red-400 to-blue-400" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">הגדרות מתקדמות</h4>
                  <p className="text-xs text-gray-400">אפקטים נוספים, מעברים ועוד</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>יהיה זמין בקרוב</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
