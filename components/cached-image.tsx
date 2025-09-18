"use client"

import { useImageCache, preloadImages } from "@/hooks/use-image-cache"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CachedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: string
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

export default function CachedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = "/placeholder.svg?height=400&width=400",
  fallback = "/placeholder.svg?height=400&width=400",
  onLoad,
  onError,
}: CachedImageProps) {
  const {
    src: imageSrc,
    isLoading,
    hasError,
    ref,
  } = useImageCache(src, {
    lazy: !priority,
    placeholder,
    fallback,
    quality,
  })

  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!isLoading && !hasError) {
      setImageLoaded(true)
      onLoad?.()
    }
    if (hasError) {
      onError?.()
    }
  }, [isLoading, hasError, onLoad, onError])

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      preloadImages([src])
    }
  }, [priority, src])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={imageSrc || placeholder}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-all duration-500 ease-out",
          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
          hasError && "grayscale",
          className,
        )}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => onError?.()}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Imagen no disponible</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Utility component for avatar images with specific optimizations
export function CachedAvatar({
  src,
  alt,
  size = 80,
  className,
  fallbackInitials,
}: {
  src: string
  alt: string
  size?: number
  className?: string
  fallbackInitials?: string
}) {
  return (
    <CachedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover", className)}
      quality={85}
      fallback={`/placeholder.svg?height=${size}&width=${size}&text=${encodeURIComponent(fallbackInitials || alt.substring(0, 2))}`}
    />
  )
}

// Utility component for course/content images
export function CachedContentImage({
  src,
  alt,
  aspectRatio = "aspect-video",
  className,
  priority = false,
}: {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative w-full", aspectRatio, className)}>
      <CachedImage
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        priority={priority}
        quality={80}
      />
    </div>
  )
}
