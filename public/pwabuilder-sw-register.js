// 仅在支持服务工作器的浏览器中注册
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('服务工作器注册成功:', registration.scope);
            })
            .catch((error) => {
                console.log('服务工作器注册失败:', error);
            });
    });
}