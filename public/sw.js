const CACHE_NAME = 'cherry-v0.6.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/cherry.svg'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] 缓存失败:', error);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中 - 返回缓存的响应
        if (response) {
          console.log('[Service Worker] 从缓存返回:', event.request.url);
          return response;
        }

        // 缓存未命中 - 发起网络请求
        return fetch(event.request)
          .then((response) => {
            // 检查是否为有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应，因为响应是流，只能使用一次
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[Service Worker] 缓存新资源:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] 请求失败:', error);
            
            // 如果是 HTML 请求，返回离线页面
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // 返回错误
            throw error;
          });
      })
  );
});

// 监听消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});