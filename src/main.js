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

document.addEventListener('DOMContentLoaded', () => {
  const key = (window.config && window.config.key)  '...';
  const keyEl = document.getElementById('overlay-key');
  if (keyEl) keyEl.textContent = key;

  const pill = document.getElementById('overlay-text');
  const btn = document.getElementById('copy-ca');

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Copied';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1200);
      }
    } catch {
      // fallback — выделим текст
      if (window.getSelection && keyEl) {
        const range = document.createRange();
        range.selectNodeContents(keyEl);
        const sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
      }
      alert('Copy failed. Please copy manually.');
    }
  }

  if (btn && keyEl) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copy(keyEl.textContent  '');
    });
  }
  if (pill && keyEl) {
    pill.addEventListener('click', () => copy(keyEl.textContent || ''));
    pill.title = 'Click to copy CA';
  }
});