export class CacheManager {
  private static readonly CACHE_PREFIX = "snappy-coaching-"
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly API_CACHE_TTL = 10 * 60 * 1000 // 10 minutes
  private static readonly STATIC_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

  // Memory cache for frequently accessed data
  private static memoryCache = new Map<string, { data: any; expires: number }>()

  static async get<T>(key: string, fallback?: () => Promise<T>, ttl: number = this.DEFAULT_TTL): Promise<T | null> {
    const cacheKey = this.CACHE_PREFIX + key

    // Check memory cache first
    const memoryItem = this.memoryCache.get(cacheKey)
    if (memoryItem && memoryItem.expires > Date.now()) {
      return memoryItem.data
    }

    // Check localStorage
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data, expires } = JSON.parse(cached)
          if (expires > Date.now()) {
            // Update memory cache
            this.memoryCache.set(cacheKey, { data, expires })
            return data
          } else {
            // Remove expired item
            localStorage.removeItem(cacheKey)
          }
        }
      } catch (error) {
        console.warn("[Cache] Error reading from localStorage:", error)
      }
    }

    // If no cache hit and fallback provided, fetch and cache
    if (fallback) {
      try {
        const data = await fallback()
        this.set(key, data, ttl)
        return data
      } catch (error) {
        console.error("[Cache] Error in fallback function:", error)
        return null
      }
    }

    return null
  }

  static set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const cacheKey = this.CACHE_PREFIX + key
    const expires = Date.now() + ttl
    const cacheItem = { data, expires }

    // Set in memory cache
    this.memoryCache.set(cacheKey, cacheItem)

    // Set in localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem))
      } catch (error) {
        console.warn("[Cache] Error writing to localStorage:", error)
        // If localStorage is full, clear old items
        this.clearExpired()
      }
    }
  }

  static remove(key: string): void {
    const cacheKey = this.CACHE_PREFIX + key
    this.memoryCache.delete(cacheKey)
    if (typeof window !== "undefined") {
      localStorage.removeItem(cacheKey)
    }
  }

  static clear(): void {
    this.memoryCache.clear()
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.CACHE_PREFIX))
      keys.forEach((key) => localStorage.removeItem(key))
    }
  }

  static clearExpired(): void {
    const now = Date.now()

    // Clear expired memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expires <= now) {
        this.memoryCache.delete(key)
      }
    }

    // Clear expired localStorage
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.CACHE_PREFIX))
      keys.forEach((key) => {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const { expires } = JSON.parse(cached)
            if (expires <= now) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key)
        }
      })
    }
  }

  // Specialized cache methods
  static async getCourses() {
    return this.get("courses", undefined, this.API_CACHE_TTL)
  }

  static setCourses(courses: any[]) {
    this.set("courses", courses, this.API_CACHE_TTL)
  }

  static async getTeachers() {
    return this.get("teachers", undefined, this.API_CACHE_TTL)
  }

  static setTeachers(teachers: any[]) {
    this.set("teachers", teachers, this.API_CACHE_TTL)
  }

  static async getStaticContent(key: string) {
    return this.get(`static-${key}`, undefined, this.STATIC_CACHE_TTL)
  }

  static setStaticContent(key: string, content: any) {
    this.set(`static-${key}`, content, this.STATIC_CACHE_TTL)
  }
}

// Auto-cleanup expired cache every 30 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      CacheManager.clearExpired()
    },
    30 * 60 * 1000,
  )
}
