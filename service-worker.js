const CACHE_NAME = "dira-pwa-v1";
const SCOPE_URL = new URL(self.registration.scope);

const scopedUrl = (path = "") => new URL(path, SCOPE_URL).toString();

const APP_SHELL = [
  "",
  "index.html",
  "products.html",
  "catalogue.html",
  "manufacturers.html",
  "offline.html",
  "styles.css",
  "script.js",
  "assets/css/pwa-install.css",
  "assets/js/pwa-install.js",
  "manifest.webmanifest",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png"
].map(scopedUrl);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("dira-pwa-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const networkFirstNavigation = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (
      (await caches.match(request)) ||
      (await caches.match(scopedUrl("index.html"))) ||
      caches.match(scopedUrl("offline.html"))
    );
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) return cached;
  return (await update) || Response.error();
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (
    request.method !== "GET" ||
    requestUrl.origin !== SCOPE_URL.origin ||
    !requestUrl.pathname.startsWith(SCOPE_URL.pathname)
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  const shouldCacheAsset =
    ["style", "script", "font"].includes(request.destination) ||
    (request.destination === "image" &&
      (requestUrl.pathname.includes("/assets/icons/") ||
        requestUrl.pathname.includes("/assets/images/")));

  if (shouldCacheAsset) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
