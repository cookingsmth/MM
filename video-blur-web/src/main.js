// Reads the key from global `config` if available, otherwise falls back.
const getKey = () => {
    try {
        // config may be injected by src/config.js or config.example.js
        if (typeof config === 'object' && config && typeof config.key === 'string' && config.key.trim()) {
            return config.key.trim();
        }
    } catch (_) { /* ignore */ }
    return '...';
};

document.addEventListener('DOMContentLoaded', () => {
    const keySpan = document.getElementById('overlay-key');
    if (keySpan) keySpan.textContent = getKey();

    // If assets/video/video.mp4 does not exist, the alternate <source> will be used.
    // Nothing else required here; the <video> tag handles fallback sources.
});