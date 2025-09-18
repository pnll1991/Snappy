"use client"

import { useEffect, useState } from "react"
import { apiCache } from "@/lib/api-cache"

interface PerformanceStats {
  cacheHits: number
  cacheMisses: number
  totalRequests: number
  averageLoadTime: number
  memoryUsage: number
  localStorageUsage: number
  serviceWorkerStatus: string
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    averageLoadTime: 0,
    memoryUsage: 0,
    localStorageUsage: 0,
    serviceWorkerStatus: "Not Available",
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return

    const updateStats = async () => {
      const apiStats = apiCache.getStats()

      // Check localStorage usage
      let localStorageSize = 0
      if (typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage).filter((key) => key.startsWith("snappy-"))
          localStorageSize = keys.length
        } catch (error) {
          // localStorage not available
        }
      }

      // Check Service Worker status
      let swStatus = "Not Available"
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            swStatus = registration.active ? "Active" : "Installing"
          } else {
            swStatus = "Not Registered"
          }
        } catch (error) {
          swStatus = "Error"
        }
      }

      setStats({
        cacheHits: apiStats.entries.filter((e) => !e.hasError).length,
        cacheMisses: apiStats.entries.filter((e) => e.hasError).length,
        totalRequests: apiStats.cacheSize + apiStats.pendingRequests,
        averageLoadTime: apiStats.entries.reduce((acc, e) => acc + e.age, 0) / apiStats.entries.length || 0,
        memoryUsage: apiStats.cacheSize,
        localStorageUsage: localStorageSize,
        serviceWorkerStatus: swStatus,
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 5000)

    // Show/hide with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isVisible])

  if (process.env.NODE_ENV !== "development" || !isVisible) {
    return null
  }

  const hitRate = stats.totalRequests > 0 ? (stats.cacheHits / stats.totalRequests) * 100 : 0

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Cache Performance</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="space-y-1">
        <div>Hit Rate: {hitRate.toFixed(1)}%</div>
        <div>API Cache: {stats.cacheHits} hits</div>
        <div>Memory: {stats.memoryUsage} entries</div>
        <div>LocalStorage: {stats.localStorageUsage} items</div>
        <div>
          SW Status:{" "}
          <span className={stats.serviceWorkerStatus === "Active" ? "text-green-400" : "text-yellow-400"}>
            {stats.serviceWorkerStatus}
          </span>
        </div>
        <div>Avg Load: {(stats.averageLoadTime / 1000).toFixed(2)}s</div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        <div>Ctrl+Shift+P to toggle</div>
        {stats.serviceWorkerStatus !== "Active" && (
          <div className="text-yellow-400 text-xs mt-1">SW disabled in preview</div>
        )}
      </div>
    </div>
  )
}
