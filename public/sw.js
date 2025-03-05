// 服务工作器版本
const CACHE_VERSION = 'v1';
const CACHE_NAME = `wisdom-island-${CACHE_VERSION}`;

// 要缓存的资源
const urlsToCache = [
    '/',
    '/index.html',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/manifest.json'
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('已打开缓存');
            return cache.addAll(urlsToCache);
        })
        .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 获取事件 - 优先使用缓存，网络失败时回退到缓存
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // 缓存命中 - 返回响应
            if (response) {
                return response;
            }

            // 克隆请求，因为请求是流
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                (response) => {
                    // 检查响应是否有效
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // 克隆响应，因为响应是流
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // 将获取的响应添加到缓存
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            ).catch(() => {
                // 网络失败，尝试提供离线页面
                return caches.match('/');
            });
        })
    );
});