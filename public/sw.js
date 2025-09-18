const CACHE_NAME = "snappy-coaching-v1"
const STATIC_CACHE = "snappy-static-v1"
const API_CACHE = "snappy-api-v1"
const IMAGE_CACHE = "snappy-images-v1"

// Assets to cache immediately
const STATIC_ASSETS = ["/", "/manifest.json", "/logo-snappy.png", "/uai-logo-white.png", "/snappy-logo.png"]

// API endpoints to cache
const API_ENDPOINTS = ["/api/courses", "/api/teachers", "/admin/actions"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)), self.skipWaiting()]),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE &&
                cacheName !== API_CACHE &&
                cacheName !== IMAGE_CACHE
              ) {
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      self.clients.claim(),
    ]),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/api/") || API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request))
  } else if (request.destination === "image") {
    // Images - Cache first with network fallback
    event.respondWith(handleImageRequest(request))
  } else if (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff")
  ) {
    // Static assets - Cache first
    event.respondWith(handleStaticRequest(request))
  } else {
    // HTML pages - Network first with cache fallback
    event.respondWith(handlePageRequest(request))
  }
})

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE)

  try {
    // Try network first
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response
    return new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)

  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache the image
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Return placeholder image for failed requests
    return new Response("", { status: 404 })
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)

  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    // Fetch from network and cache
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    return new Response("", { status: 404 })
  }
}

async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Snappy Coaching - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>Sin conexión</h1>
            <p>Por favor, verifica tu conexión a internet e intenta nuevamente.</p>
          </div>
        </body>
      </html>
    `,
      {
        status: 503,
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Retry failed API requests when back online
  console.log("[SW] Background sync triggered")
}
