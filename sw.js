
const CACHE = "tisha-birthday-v2";
const APP = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/01_tisha_childhood.png",
  "./assets/02_tisha_today.png",
  "./assets/03_tisha_smile.jpg",
  "./assets/04_tisha_candid.jpg",
  "./assets/05_tisha_sky.jpg",
  "./assets/06_tisha_sky2.jpg",
  "./assets/07_us_together.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Videos are cached only after they have been played/loaded once.
  // This avoids making the first install unnecessarily heavy.
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && (req.url.includes("/assets/08_") || req.url.includes("/assets/09_") || req.url.includes("/assets/10_"))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
