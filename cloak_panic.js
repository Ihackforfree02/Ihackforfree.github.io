// cloak_panic.js
(function(){
  const LS = {
    CLOAK: 'settings_cloak_choice',
    PANIC_KEY: 'settings_panic_key',
    PANIC_URL: 'settings_panic_url'
  };

  const CLOAK_INFO = {
    classroom: { title: 'Google Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.ico' },
    gmail:     { title: 'Gmail',           icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
    docs:      { title: 'Google Docs',     icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
    slides:    { title: 'Google Slides',   icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico' }
  };

  // store original title & favicon so "None" can restore (if needed)
  const originalTitle = document.title || '';
  const originalFaviconHref = (function(){
    const l = document.querySelector("link[rel~='icon']");
    return l ? l.href : null;
  })();

  function setFavicon(href) {
    if (!href) return;
    const hrefWithStamp = href + '?v=' + Date.now();
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = hrefWithStamp;
    let shortcut = document.querySelector("link[rel='shortcut icon']");
    if (!shortcut) {
      shortcut = document.createElement('link');
      shortcut.rel = 'shortcut icon';
      document.head.appendChild(shortcut);
    }
    shortcut.href = hrefWithStamp;
  }

  function applyCloak(choice) {
    if (!choice || !CLOAK_INFO[choice]) {
      // restore original if available
      if (originalTitle) document.title = originalTitle;
      if (originalFaviconHref) setFavicon(originalFaviconHref);
      return;
    }
    const info = CLOAK_INFO[choice];
    document.title = info.title;
    setFavicon(info.icon);
  }

  // apply saved cloak
  try {
    const savedCloak = localStorage.getItem(LS.CLOAK);
    if (savedCloak) applyCloak(savedCloak);
  } catch (err) { /* localStorage may throw in some contexts */ }

  // panic key behavior
  try {
    const savedPanicKey = localStorage.getItem(LS.PANIC_KEY);
    const savedPanicUrl = localStorage.getItem(LS.PANIC_URL);
    if (savedPanicKey && savedPanicUrl) {
      window.addEventListener('keydown', function(e){
        // ignore typing in inputs
        const active = document.activeElement;
        const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (typing) return;

        try {
          if (e.key && e.key.toLowerCase() === savedPanicKey.toLowerCase()) {
            window.location.href = savedPanicUrl;
          }
        } catch (err) { /* ignore */ }
      }, true);
    }
  } catch (err) { /* ignore localStorage errors */ }
})();
