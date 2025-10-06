(function () {
  function getReducedMotion() {
    try { return localStorage.getItem('reducedMotion') === 'true'; } catch { return false; }
  }
  function setReducedMotionPref(val) {
    try { localStorage.setItem('reducedMotion', val ? 'true' : 'false'); } catch {}
    if (window.setReducedMotion) window.setReducedMotion(val);
  }
  function setReducedMotion(val) {
    try {
      if (val) document.documentElement.setAttribute('data-reduced-motion', 'true'); else document.documentElement.removeAttribute('data-reduced-motion');

      document.querySelectorAll('.site-brand').forEach(el => {
        if (val) {
          el.style.setProperty('animation', 'none', 'important');
        } else {
          el.style.removeProperty('animation');
          el.style.animation = '';
        }
      });
    } catch {}
  }
  window.setReducedMotion = setReducedMotion;

  function openSettings() {
    const current = getReducedMotion();
    const html = `
        <div style="display:flex; align-items:center; gap:.5rem; font-size:1.25rem; font-weight:600;">
          <i class="fa-solid fa-gear fa-spin" style="color: var(--accent, #4f90ff);"></i>
          <span>Settings</span>
        </div>
        <label style="display:flex; align-items:center; gap:.5rem; cursor:pointer;">
            <input id="rm-toggle" type="checkbox" ${current ? 'checked' : ''} />
            <p>Reduced motion</p><br>
            <span><small>Stops the background stars and avatar decorations on the Discord section</small></span>
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
