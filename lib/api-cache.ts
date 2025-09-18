"use client"

import React from "react"

interface CacheOptions {
  ttl?: number
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  isValidating: boolean
  error?: Error
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private pendingRequests = new Map<string, Promise<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly DEDUPING_INTERVAL = 2000 // 2 seconds

  constructor() {
    if (typeof window !== "undefined") {
      // Revalidate on focus
      window.addEventListener("focus", () => {
        this.revalidateAll()
      })

      // Revalidate on reconnect
      window.addEventListener("online", () => {
        this.revalidateAll()
      })
    }
  }

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<{ data: T | null; error?: Error; isValidating: boolean }> {
    const { ttl = this.DEFAULT_TTL, dedupingInterval = this.DEDUPING_INTERVAL } = options

    const cached = this.cache.get(key)
    const now = Date.now()

    // Return cached data if fresh
    if (cached && now - cached.timestamp < ttl && !cached.error) {
      return {
        data: cached.data,
        isValidating: cached.isValidating,
      }
    }

    // Check for pending request (deduping)
    const pendingRequest = this.pendingRequests.get(key)
    if (pendingRequest && cached && now - cached.timestamp < dedupingInterval) {
      try {
        const data = await pendingRequest
        return { data, isValidating: false }
      } catch (error) {
        return {
          data: cached.data || null,
          error: error as Error,
          isValidating: false,
        }
      }
    }

    // Mark as validating
    if (cached) {
      cached.isValidating = true
      this.cache.set(key, cached)
    }

    // Create new request
    const request = this.fetchAndCache(key, fetcher, ttl)
    this.pendingRequests.set(key, request)

    try {
      const data = await request
      return { data, isValidating: false }
    } catch (error) {
      return {
        data: cached?.data || null,
        error: error as Error,
        isValidating: false,
      }
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  private async fetchAndCache<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    try {
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        isValidating: false,
      })
      return data
    } catch (error) {
      const cached = this.cache.get(key)
      this.cache.set(key, {
        data: cached?.data,
        timestamp: cached?.timestamp || Date.now(),
        isValidating: false,
        error: error as Error,
      })
      throw error
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key)
    this.pendingRequests.delete(key)
  }

  revalidate<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    this.invalidate(key)
    return this.fetchAndCache(key, fetcher, this.DEFAULT_TTL)
  }

  private revalidateAll(): void {
    // Only revalidate stale entries
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.DEFAULT_TTL) {
        // Mark for revalidation on next access
        entry.timestamp = 0
      }
    }
  }

  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        hasError: !!entry.error,
        isValidating: entry.isValidating,
      })),
    }
  }
}

export const apiCache = new ApiCache()

// Helper hook for React components
export function useCachedApi<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions) {
  const [state, setState] = React.useState<{
    data: T | null
    error?: Error
    isValidating: boolean
  }>({
    data: null,
    isValidating: true,
  })

  React.useEffect(() => {
    let mounted = true

    apiCache.get(key, fetcher, options).then((result) => {
      if (mounted) {
        setState(result)
      }
    })

    return () => {
      mounted = false
    }
  }, [key])

  const mutate = React.useCallback(
    (newData?: T) => {
      if (newData) {
        apiCache.cache.set(key, {
          data: newData,
          timestamp: Date.now(),
          isValidating: false,
        })
        setState((prev) => ({ ...prev, data: newData }))
      } else {
        apiCache.revalidate(key, fetcher).then((data) => {
          setState((prev) => ({ ...prev, data, isValidating: false }))
        })
      }
    },
    [key, fetcher],
  )

  return { ...state, mutate }
}
