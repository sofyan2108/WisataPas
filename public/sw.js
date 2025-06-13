const CACHE_NAME = "wisatapas-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.bundle.js",
  "/manifest.json",
  "/PWA/icons/favicon-196.png",
  "/PWA/icons/apple-icon-180.png",
  "/PWA/icons/manifest-icon-192.maskable.png",
  "/PWA/icons/manifest-icon-512.maskable.png",
  // Tambahkan asset statis lain (misal CSS, gambar, dll) jika diperlukan.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, kembalikan response dari cache.
      if (response) {
         return response;
      }
      // Jika tidak ada, fetch dari network.
      return fetch(event.request).then((res) => {
         // (Opsional) Simpan hasil fetch ke cache untuk penggunaan offline berikutnya.
         // Misal, jika request adalah GET dan bukan POST, PUT, dll.
         if (event.request.method === "GET") {
            caches.open(CACHE_NAME).then((cache) => {
               cache.put(event.request, res.clone());
            });
         }
         return res;
      }).catch(() => {
         // Jika fetch gagal (misal, offline), kembalikan offline fallback (misal, offline.html).
         // Misal, jika request adalah halaman (HTML), kembalikan offline.html.
         if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
         }
         // Jika bukan halaman, kembalikan fallback (misal, gambar offline).
         return caches.match("/PWA/icons/offline.png");
      });
    })
  );
}); 