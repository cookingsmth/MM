const getKey = () => {
    try {
        
        if (typeof config === 'object' && config && typeof config.key === 'string' && config.key.trim()) {
            return config.key.trim();
        }
    } catch (_) { /* ignore */ }
    return '...';
};

document.addEventListener('DOMContentLoaded', () => {
  
  (function setupVh() {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    let resizeTimer = null;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(setVh, 120); });
    window.addEventListener('orientationchange', () => setVh());
  })();

  const key = (window.config && window.config.key) || '...';
  const keyEl = document.getElementById('overlay-key');
  if (keyEl) keyEl.textContent = key;

  const pill = document.getElementById('overlay-text');
  const btn = document.getElementById('copy-ca');

  async function copy(text) {
    if (!text) return;
    try {
      
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const successful = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!successful) throw new Error('execCommand copy failed');
      }

      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Copied';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1200);
      }
    } catch (err) {
      
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
      copy(keyEl.textContent || '');
    });
  }
  if (pill && keyEl) {
    pill.addEventListener('click', () => copy(keyEl.textContent || ''));
    pill.title = 'Click to copy CA';
  }

  
  const video = document.getElementById('main-video');
  const soundBtn = document.getElementById('sound-toggle');
  if (video && soundBtn) {
    
    const updateSoundUI = (hint) => {
      const muted = !!video.muted;
      soundBtn.textContent = muted ? '🔇' : '🔊';
      soundBtn.setAttribute('aria-pressed', String(!muted));
      soundBtn.title = muted ? 'Unmute' : 'Mute';
      if (hint) {
        const old = soundBtn.textContent;
        soundBtn.textContent = hint;
        setTimeout(() => { soundBtn.textContent = muted ? '🔇' : '🔊'; }, 900);
      }
    };

    
    video.muted = true; 
    const playOverlay = document.getElementById('play-overlay');
    video.play().then(() => {
      
      if (playOverlay) playOverlay.style.display = 'none';
    }).catch(() => {
      
      console.warn('Autoplay blocked or play failed on load');
      if (playOverlay) playOverlay.style.display = 'flex';
    });

    
    if (playOverlay) {
      video.addEventListener('playing', () => { playOverlay.style.display = 'none'; });
      playOverlay.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        
        try {
          video.muted = false;
          await video.play();
          playOverlay.style.display = 'none';
          updateSoundUI();
          return;
        } catch (err) {
          console.warn('Play with sound blocked; falling back to muted play', err);
        }
        
        try {
          video.muted = true;
          await video.play();
          playOverlay.style.display = 'none';
          updateSoundUI();
        } catch (err2) {
          console.error('Play failed entirely', err2);
        }
      });
      
      playOverlay.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); playOverlay.click(); }
      });
    }

    
    updateSoundUI();

    soundBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (video.muted) {
        
        video.muted = false;
        try {
          await video.play();
        } catch (err) {
          
          console.warn('Play with sound blocked:', err);
          video.muted = true;
          updateSoundUI('Click to enable');
          return;
        }
      } else {
        video.muted = true;
      }
      updateSoundUI();
    });
  }
});