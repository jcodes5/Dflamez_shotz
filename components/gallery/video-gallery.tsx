"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  category: string
  description?: string
}

interface VideoGalleryProps {
  videos: VideoItem[]
  selectedCategory: string
}

export function VideoGallery({ videos, selectedCategory }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  const filteredVideos =
    selectedCategory === "all" ? videos : videos.filter((video) => video.category === selectedCategory)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-primary text-primary-foreground rounded-full p-4"
                >
                  <Play className="h-8 w-8 ml-1" />
                </motion.div>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              {video.description && <p className="text-sm text-muted-foreground mt-1">{video.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                muted={isMuted}
                className="w-full h-full rounded-lg"
              />

              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/50 hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setSelectedVideo(null)}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                {selectedVideo.description && <p className="text-sm opacity-80 mt-1">{selectedVideo.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
