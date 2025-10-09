(function () {
  function getReducedMotion() {
    try { return localStorage.getItem('reducedMotion') === 'true'; } catch { return false; }
  }
  function setReducedMotionPref(val) {
    try { localStorage.setItem('reducedMotion', val ? 'true' : 'false'); } catch {}
    if (window.setReducedMotion) window.setReducedMotion(val);
  }

  function openSettings() {
    const current = getReducedMotion();
    const html = `
        <label style="display:flex; align-items:center; gap:.5rem; cursor:pointer;">
            <input id="rm-toggle" type="checkbox" ${current ? 'checked' : ''} />
            <span>Stop stars</span>
        </label>
    `;
    try { msg(html, { titlebarText: 'exerinity.dev' }); } catch {}
    setTimeout(() => {
      const chk = document.getElementById('rm-toggle');
      if (chk) {
        chk.addEventListener('change', () => {
          setReducedMotionPref(chk.checked);
          try {
            const img = document.getElementById('dc-avatar-deco');
            if (img && img.src) {
              const url = new URL(img.src);
              if (url.hostname === 'cdn.discordapp.com') {
                const params = url.searchParams;
                if (chk.checked) params.set('passthrough', 'false'); else params.set('passthrough', 'true');
                url.search = params.toString();
                img.src = url.toString();
              }
            }
          } catch {}
        });
      }
    }, 0);
  }

  window.getReducedMotion = getReducedMotion;
  window.setReducedMotionPref = setReducedMotionPref;
  window.openSettings = openSettings;

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('settings-btn');
    if (btn) btn.addEventListener('click', openSettings);
    if (window.setReducedMotion) window.setReducedMotion(getReducedMotion());
  });
})();
