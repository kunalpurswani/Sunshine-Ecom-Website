if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Serviceworker.js')
        .then((reg) => console.log('Registration successful, scope is: ' + reg))
        .catch((err) => console.log('Service worker registration failed,error: ' + err));
}