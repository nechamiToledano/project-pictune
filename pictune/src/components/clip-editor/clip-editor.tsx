"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PreviewPanel from "./preview-panel"
import MediaSelector from "./media-selector"
import TextEditor from "./text-editor"
import EffectsPanel from "./effects-panel"
import SongSelector from "./song-selector"
import Background from "../Background"
import { fetchMusicFileUrl, MusicFile } from "@/store/slices/musicFilesSlice"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { Word } from "@/store/slices/wordsSlice"

type TextAlign = 'left' | 'center' | 'right' | undefined

export interface ClipSettings {
  words: Array<Word>
  textPosition: string
  animation: string
  fontSize: number
  textColor: string
  fontFamily: string
  textShadow: boolean
  textAlign: TextAlign
  textStyles: { bold: boolean; italic: boolean; underline: boolean }
  backgroundColor: string
  backgroundOpacity: number
  showBackground: boolean
  borderRadius: number
  padding: number
  letterSpacing: number
  lineHeight: number
  transitions: string
  videoQuality: string
  videoFormat: string
  framerate: number
  audioFadeIn: number
  audioFadeOut: number
  autoSync: boolean
  colorMatch: boolean
  beatDetection: boolean
  autoSubtitles: boolean
}

const defaultSettings: ClipSettings = {
  words: [],
  textPosition: "center",
  animation: "fade",
  fontSize: 24,
  textColor: "#ffffff",
  fontFamily: "sans-serif",
  textShadow: true,
  textAlign: "center",
  textStyles: { bold: false, italic: false, underline: false },
  backgroundColor: "rgba(0,0,0,0.5)",
  backgroundOpacity: 50,
  showBackground: true,
  borderRadius: 8,
  padding: 8,
  letterSpacing: 0,
  lineHeight: 1.2,
  transitions: "smooth",
  videoQuality: "high",
  videoFormat: "mp4",
  framerate: 30,
  audioFadeIn: 0.5,
  audioFadeOut: 0.5,
  autoSync: false,
  colorMatch: false,
  beatDetection: false,
  autoSubtitles: false,
}

export default function ClipEditor() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("media")
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(3.0)
  const [selectedSong, setSelectedSong] = useState<MusicFile | null>(null)
  const [settings, setSettings] = useState<ClipSettings>(defaultSettings)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>();
  const words = useSelector((state: RootState) => state.words)

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateNestedSetting = (key: string, nestedKey: string, value: any) => {
    setSettings((prev) => {
      const parentObj = prev[key as keyof ClipSettings]
      if (typeof parentObj === "object" && parentObj !== null && !Array.isArray(parentObj)) {
        return {
          ...prev,
          [key]: {
            ...parentObj,
            [nestedKey]: value,
          },
        }
      }
      return prev
    })
  }

  const createClip = async () => {
    console.log('create clip')
    if (!selectedSong) {
      alert("Please select a song first.");
      return;
    }
  
    const formData = new FormData();
  
    const { words: _, ...restSettings } = settings;
    const fullSettings = {
      ...restSettings,
      words,
    };
  
    formData.append("settings", JSON.stringify(fullSettings));
  
    const url = await dispatch(fetchMusicFileUrl(selectedSong.id)).unwrap();
    formData.append("songUrl", String(url));
  
    mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });
  
    setIsCreating(true);
  console.log('123');
  
    try {
      // שליחת יצירת המשימה
      const response = await axios.post("https://pictune-python.onrender.com/create-clip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('1234ז');
  
      const taskId = response.data.task_id;
      console.log("Task ID:", taskId);
  
      // Polling לבדיקה אם המשימה הסתיימה
      const checkStatus = async (): Promise<void> => {
        try {
          const statusResponse = await axios.get(`https://pictune-python.onrender.com/clip-status/${taskId}`);
          const statusData = statusResponse.data;
  
          if (statusData.status === "done") {
            const fullVideoUrl = `https://pictune-python.onrender.com${statusData.video_url}`;
            setVideoUrl(fullVideoUrl);
            alert("Clip created successfully!");
            setIsCreating(false);
            
          } else if (statusData.status === "error") {
            alert("Error creating clip: " + statusData.message);
            setIsCreating(false);
          } else {
            // עדיין לא מוכן - מחכים ושולחים שוב בקשה
            setTimeout(checkStatus, 2000);
          }
        } catch (err: any) {
          alert("Error checking status: " + (err.response?.data?.message || err.message));
          setIsCreating(false);
        }
      };
  
      // מתחילים לבדוק סטטוס
      await checkStatus();
  
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.message || error.message));
      setIsCreating(false);
    }
  };
  

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white " dir="ltr" >
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
              <Edit2 className="h-6 w-6" /> Song2Clip Editor
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs border-gray-700 hover:bg-white/10"
              >
                {previewMode ? "Edit" : "Preview"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!videoUrl ? (
              <PreviewPanel
                mediaFiles={mediaFiles}
                isVideo={isVideo}
                previewMode={previewMode}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                duration={duration}
                setDuration={setDuration}
                settings={settings}
                updateSetting={updateSetting}
                selectedSong={selectedSong}
              />
            ) : (
              <div className="mt-6 bg-gray-900/30 backdrop-blur-md border-gray-800/50 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-800/50">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Download className="h-5 w-5 mr-2 text-green-400" />
                    Created Clip Preview
                  </h2>
                </div>
                <div className="aspect-video bg-black">
                    <video controls src={videoUrl} className="w-full h-full" autoPlay={false} />
                </div>
              </div>
            )}
          </div>


          <div className="lg:col-span-1">
            <div className="bg-gray-900/30 backdrop-blur-md border-gray-800/50 rounded-xl shadow-xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-800/50 w-full grid grid-cols-3">
                  <TabsTrigger
                    value="media"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20"
                  >
                    Media
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20"
                  >
                    Text
                  </TabsTrigger>
                  <TabsTrigger
                    value="effects"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20"
                  >
                    Effects
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="media" className="p-4">
                  {mediaFiles.length === 0 && !selectedSong ? (
                    <SongSelector onSelectSong={setSelectedSong} selectedSong={selectedSong} />
                  ) : null}

                  <MediaSelector
                    mediaFiles={mediaFiles}
                    setMediaFiles={setMediaFiles}
                    isVideo={isVideo}
                    setIsVideo={setIsVideo}
                    selectedSong={selectedSong}
                    setSelectedSong={setSelectedSong}
                  />
                </TabsContent>

                <TabsContent value="text" className="p-4">
                  <TextEditor
                    settings={settings}
                    updateSetting={updateSetting}
                    updateNestedSetting={updateNestedSetting}
                  />
                </TabsContent>

                <TabsContent value="effects" className="p-4">
                  <EffectsPanel settings={settings} updateSetting={updateSetting} />
                </TabsContent>
              </Tabs>

              <div className="p-4 border-t border-gray-800/50">
                <Button
                  onClick={createClip}
                  className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Clip...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" /> Create Clip
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
