const CACHE_NAME = "schedify-shell-v2",
  CORE_ASSETS = [
    "./",
    "./index.html",
    "./assets/css/styles.css",
    "./assets/js/app.js",
    "./manifest.webmanifest",
    "./manifest-dark.webmanifest",
    "./assets/icons/icon-light.svg",
    "./assets/icons/icon-dark.svg",
    "./assets/icons/icon-mask.svg",
  ];
(self.addEventListener("install", (e) => {
  (e.waitUntil(caches.open(CACHE_NAME).then((e) => e.addAll(CORE_ASSETS))),
    self.skipWaiting());
}),
  self.addEventListener("activate", (e) => {
    (e.waitUntil(
      caches
        .keys()
        .then((e) =>
          Promise.all(
            e.filter((e) => e !== CACHE_NAME).map((e) => caches.delete(e)),
          ),
        ),
    ),
      self.clients.claim());
  }),
  self.addEventListener("fetch", (e) => {
    const { request: t } = e;
    "GET" === t.method &&
      e.respondWith(
        caches.match(t).then(
          (e) =>
            e ||
            fetch(t).then((e) => {
              if (e && 200 === e.status) {
                const s = e.clone();
                caches.open(CACHE_NAME).then((e) => e.put(t, s));
              }
              return e;
            }),
        ),
      );
  }));
