self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
});
self.addEventListener("fetch", function (event) {
    event.respondWith(checkResponse(event.request).catch(function () {
        console.log("Fetch from cache successful!")
        return returnFromCache(event.request);
    }));
    console.log("Fetch successful!")
    event.waitUntil(addToCache(event.request));
});
self.addEventListener("sync", (event) => {
    console.log(event);
    if (event.tag === "test-tag-from-devtools") {
        console.log("Sync successful!")
        event.waitUntil(checkResponse(event.request).catch(function () {
            console.log("Fetch from cache successful!")
            return returnFromCache(event.request);
        }));
    }
});
self.addEventListener('push', function (event) {
    if (event && event.data) {
        var data = {
            message: event.data.text(),
            method: "pushMessage"
        }
        if (data.method == "pushMessage") {
            console.log("Push notification sent");
            event.waitUntil(self.registration.showNotification("Sun Shine Ecomm", {
                body: data.message
            }))
        }
    }
})
var filesToCache = [
    '/',
    '/images/gallery1.png',
    '/images/gallery2.png',
    '/images/gallery3.png',
    '/images/gallery4.png',
    '/images/gallery5.png',
    '/images/gallery6.png',
];
var preLoad = async function () {
    const cache = await caches.open("pwa");
    return await cache.addAll(filesToCache);
};
var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject();
            }
        }, reject);
    });
};
var addToCache = async function (request) {
    const cache = await caches.open("offline");
    const response = await fetch(request);
    return await cache.put(request, response);
};
var returnFromCache = async function (request) {
    const cache = await caches.open("pwa");
    const matching = await cache.match(request);
    if (!matching || matching.status == 404) {
        return cache.match("offline.html");
    } else {
        return matching;
    }
};