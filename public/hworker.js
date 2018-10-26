const CACHE_NAME = "cache-v1";
const assetToCache = [
    "index.html",
    "assets/vendor/bootstrap/css/bootstrap.min.css",
    "assets/css/style.css",
    "assets/vendor/jquery/js/jquery-2.1.0.min.js",
    "assets/vendor/jquery/js/popper.js",
    "assets/vendor/bootstrap/js/bootstrap.min.js",
    "assets/js/my.js",
    "/hoodie/client.js"
];
self.addEventListener("install", function(event) {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(assetToCache);
        })
        .catch(console.error)
    );
  });
  
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
        if (response) {
            return response;
        }
        return fetch(event.request);
        })
    );
});