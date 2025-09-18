"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")) {
      console.log("[SW] Service Worker disabled in v0 preview environment")
      return
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw")
        .then((registration) => {
          console.log("[SW] Service Worker registered successfully:", registration)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New content available, notify user
                  if (confirm("Nueva versión disponible. ¿Recargar la página?")) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.warn(
            "[SW] Service Worker registration failed (this is normal in preview environments):",
            error.message,
          )
        })

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_UPDATED") {
          console.log("[SW] Cache updated:", event.data.url)
        }
      })
    }
  }, [])

  return null
}
