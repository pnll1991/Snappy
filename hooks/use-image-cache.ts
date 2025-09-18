"use client"

import { useState, useEffect, useRef } from "react"

interface UseImageCacheOptions {
  lazy?: boolean
  placeholder?: string
  fallback?: string
  quality?: number
}

export function useImageCache(src: string, options: UseImageCacheOptions = {}) {
  const { lazy = true, placeholder, fallback, quality = 75 } = options
  const [imageSrc, setImageSrc] = useState<string>(placeholder || "")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!src) return

    // Check if image is already cached
    const cachedImage = getCachedImage(src)
    if (cachedImage) {
      setImageSrc(cachedImage)
      setIsLoading(false)
      return
    }

    if (lazy && "IntersectionObserver" in window) {
      // Lazy loading with Intersection Observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(src)
              observerRef.current?.disconnect()
            }
          })
        },
        { rootMargin: "50px" },
      )

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current)
      }
    } else {
      // Load immediately
      loadImage(src)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [src, lazy])

  const loadImage = async (imageSrc: string) => {
    try {
      setIsLoading(true)
      setHasError(false)

      // Create optimized image URL
      const optimizedSrc = getOptimizedImageUrl(imageSrc, quality)

      // Preload image
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = optimizedSrc
      })

      // Cache the loaded image
      cacheImage(imageSrc, optimizedSrc)
      setImageSrc(optimizedSrc)
    } catch (error) {
      console.warn("[ImageCache] Failed to load image:", imageSrc, error)
      setHasError(true)
      if (fallback) {
        setImageSrc(fallback)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    src: imageSrc,
    isLoading,
    hasError,
    ref: imgRef,
  }
}

// Image cache utilities
const IMAGE_CACHE_KEY = "snappy-image-cache"
const MAX_CACHE_SIZE = 50 // Maximum number of cached images

function getCachedImage(src: string): string | null {
  if (typeof window === "undefined") return null

  try {
    const cache = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || "{}")
    const cached = cache[src]

    if (cached && cached.expires > Date.now()) {
      return cached.url
    }
  } catch (error) {
    console.warn("[ImageCache] Error reading cache:", error)
  }

  return null
}

function cacheImage(originalSrc: string, optimizedSrc: string): void {
  if (typeof window === "undefined") return

  try {
    const cache = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || "{}")

    // Remove oldest entries if cache is full
    const entries = Object.entries(cache)
    if (entries.length >= MAX_CACHE_SIZE) {
      entries
        .sort(([, a], [, b]) => (a as any).timestamp - (b as any).timestamp)
        .slice(0, entries.length - MAX_CACHE_SIZE + 1)
        .forEach(([key]) => delete cache[key])
    }

    cache[originalSrc] = {
      url: optimizedSrc,
      timestamp: Date.now(),
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn("[ImageCache] Error writing cache:", error)
  }
}

function getOptimizedImageUrl(src: string, quality: number): string {
  // If it's already a placeholder or external URL, return as-is
  if (src.includes("placeholder.svg") || src.startsWith("http")) {
    return src
  }

  // For local images, we could add optimization parameters
  // This would work with Next.js Image Optimization API
  if (src.startsWith("/")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=800&q=${quality}`
  }

  return src
}

// Preload critical images
export function preloadImages(urls: string[]): void {
  if (typeof window === "undefined") return

  urls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = url
    document.head.appendChild(link)
  })
}
