console.log('single-scrollie.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    window.postMessage({
        type: 'LOAD_PLAYER',
        payload: {
            contentHeight: document.documentElement.clientHeight
        }
    }, '*');
});