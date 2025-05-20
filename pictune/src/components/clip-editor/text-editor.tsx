"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Type, Layers, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import type { ClipSettings } from "./clip-editor"

interface TextEditorProps {
  settings: ClipSettings
  updateSetting: (key: string, value: any) => void
  updateNestedSetting: (key: string, nestedKey: string, value: any) => void
}

const fontFamilies = [
  { label: "Default", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Cursive", value: "cursive" },
  { label: "Fantasy", value: "fantasy" },
]

const textAlignments = [
  { icon: <AlignLeft className="h-4 w-4" />, value: "left" },
  { icon: <AlignCenter className="h-4 w-4" />, value: "center" },
  { icon: <AlignRight className="h-4 w-4" />, value: "right" },
]

export default function TextEditor({ settings, updateSetting, updateNestedSetting }: TextEditorProps) {
  const updateBackgroundColor = (opacity: number) => {
    const alpha = opacity / 100
    const rgbaColor = `rgba(0,0,0,${alpha})`
    updateSetting("backgroundColor", rgbaColor)
    updateSetting("backgroundOpacity", opacity)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="font" className="border-gray-800/50">
        <AccordionTrigger className="hover:bg-gray-800/30 px-3 py-2 rounded-md">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>גופן וסגנון</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family">סוג גופן</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => updateSetting("fontFamily", value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                <SelectValue placeholder="בחר גופן" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size" className="flex justify-between">
              <span>גודל פונט</span>
              <span className="text-gray-400">{settings.fontSize}px</span>
            </Label>
            <Slider
              id="font-size"
              min={10}
              max={72}
              step={1}
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting("fontSize", value[0])}
              className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter-spacing" className="flex justify-between">
              <span>מרווח אותיות</span>
              <span className="text-gray-400">{settings.letterSpacing}px</span>
            </Label>
            <Slider
              id="letter-spacing"
              min={-2}
              max={10}
              step={0.5}
              value={[settings.letterSpacing]}
              onValueChange={(value) => updateSetting("letterSpacing", value[0])}
              className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line-height" className="flex justify-between">
              <span>גובה שורה</span>
              <span className="text-gray-400">{settings.lineHeight.toFixed(1)}</span>
            </Label>
            <Slider
              id="line-height"
              min={0.8}
              max={2.5}
              step={0.1}
              value={[settings.lineHeight]}
              onValueChange={(value) => updateSetting("lineHeight", value[0])}
              className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-color">צבע טקסט</Label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-md border border-gray-700/50 overflow-hidden"
                style={{ backgroundColor: settings.textColor }}
              >
                <input
                  type="color"
                  id="text-color"
                  value={settings.textColor}
                  onChange={(e) => updateSetting("textColor", e.target.value)}
                  className="w-12 h-12 transform translate-x-[-2px] translate-y-[-2px] cursor-pointer"
                />
              </div>
              <Input
                value={settings.textColor}
                onChange={(e) => updateSetting("textColor", e.target.value)}
                className="bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={settings.textStyles.bold ? "default" : "outline"}
              size="sm"
              className={`${settings.textStyles.bold ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateNestedSetting("textStyles", "bold", !settings.textStyles.bold)}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={settings.textStyles.italic ? "default" : "outline"}
              size="sm"
              className={`${settings.textStyles.italic ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateNestedSetting("textStyles", "italic", !settings.textStyles.italic)}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={settings.textStyles.underline ? "default" : "outline"}
              size="sm"
              className={`${settings.textStyles.underline ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateNestedSetting("textStyles", "underline", !settings.textStyles.underline)}
            >
              <Underline className="h-4 w-4" />
            </Button>

            {textAlignments.map((align) => (
              <Button
                key={align.value}
                variant={settings.textAlign === align.value ? "default" : "outline"}
                size="sm"
                className={`${settings.textAlign === align.value ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
                onClick={() => updateSetting("textAlign", align.value)}
              >
                {align.icon}
              </Button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="background" className="border-gray-800/50">
        <AccordionTrigger className="hover:bg-gray-800/30 px-3 py-2 rounded-md">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>רקע טקסט</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-background">הצג רקע לטקסט</Label>
            <Switch
              id="show-background"
              checked={settings.showBackground}
              onCheckedChange={(checked) => updateSetting("showBackground", checked)}
            />
          </div>

          {settings.showBackground && (
            <>
              <div className="space-y-2">
                <Label htmlFor="background-opacity" className="flex justify-between">
                  <span>שקיפות רקע</span>
                  <span className="text-gray-400">{settings.backgroundOpacity}%</span>
                </Label>
                <Slider
                  id="background-opacity"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.backgroundOpacity]}
                  onValueChange={(value) => updateBackgroundColor(value[0])}
                  className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-radius" className="flex justify-between">
                  <span>עיגול פינות</span>
                  <span className="text-gray-400">{settings.borderRadius}px</span>
                </Label>
                <Slider
                  id="border-radius"
                  min={0}
                  max={30}
                  step={1}
                  value={[settings.borderRadius]}
                  onValueChange={(value) => updateSetting("borderRadius", value[0])}
                  className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="padding" className="flex justify-between">
                  <span>ריפוד</span>
                  <span className="text-gray-400">{settings.padding}px</span>
                </Label>
                <Slider
                  id="padding"
                  min={0}
                  max={30}
                  step={1}
                  value={[settings.padding]}
                  onValueChange={(value) => updateSetting("padding", value[0])}
                  className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-red-500 [&>span:first-child]:to-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="text-shadow">צל טקסט</Label>
            <Switch
              id="text-shadow"
              checked={settings.textShadow}
              onCheckedChange={(checked) => updateSetting("textShadow", checked)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="position" className="border-gray-800/50">
        <AccordionTrigger className="hover:bg-gray-800/30 px-3 py-2 rounded-md">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>מיקום טקסט</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={settings.textPosition === "top" ? "default" : "outline"}
              className={`flex flex-col items-center ${settings.textPosition === "top" ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateSetting("textPosition", "top")}
            >
              <div className="w-full h-10 relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/50"></div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-transparent"></div>
              </div>
              <span className="text-xs mt-1">Top</span>
            </Button>
            <Button
              variant={settings.textPosition === "center" ? "default" : "outline"}
              className={`flex flex-col items-center ${settings.textPosition === "center" ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateSetting("textPosition", "center")}
            >
              <div className="w-full h-10 relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-transparent"></div>
                <div className="absolute top-4 left-0 right-0 h-2 bg-white/50"></div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent"></div>
              </div>
              <span className="text-xs mt-1">Center</span>
            </Button>
            <Button
              variant={settings.textPosition === "bottom" ? "default" : "outline"}
              className={`flex flex-col items-center ${settings.textPosition === "bottom" ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800/50 border-gray-700/50"}`}
              onClick={() => updateSetting("textPosition", "bottom")}
            >
              <div className="w-full h-10 relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/50"></div>
              </div>
              <span className="text-xs mt-1">Bottom</span>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
