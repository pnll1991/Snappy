export const CACHE_INFO = {
  features: {
    memoryCache: true,
    localStorageCache: true,
    imageCache: true,
    apiCache: true,
    serviceWorker: false, // Disabled in v0 preview environment
  },

  performance: {
    memoryTTL: "5-10 minutes",
    localStorageTTL: "24 hours for static content",
    imageCacheTTL: "24 hours",
    maxImageCache: 50,
    autoCleanup: "30 minutes interval",
  },

  deployment: {
    serviceWorkerSupport: "Available when deployed to production",
    offlineSupport: "Partial (localStorage cache only in preview)",
    fullOfflineSupport: "Available in production with Service Worker",
  },
}

export function getCacheStatus() {
  const status = {
    memoryCache: typeof window !== "undefined",
    localStorage: typeof window !== "undefined" && "localStorage" in window,
    serviceWorker: typeof window !== "undefined" && "serviceWorker" in navigator,
    intersectionObserver: typeof window !== "undefined" && "IntersectionObserver" in window,
  }

  return status
}
