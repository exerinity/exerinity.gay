(() => {
  const USER_ID = '972907501127344179';
  const API = `https://api.lanyard.rest/v1/users/${USER_ID}`;

  const els = {
    status: document.getElementById('status'),
    activity: document.getElementById('activity'),
    playing: document.getElementById('playing'),
    avatar: document.getElementById('dc-avatar'),
    name: document.getElementById('dc-name'),
    handle: document.getElementById('dc-handle'),
  };

  const REFRESH_MS = 10000;
  let nextrefresh = Date.now() + REFRESH_MS;
  let basel = '<div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>';
  let isrefresh = false;
  let lastRendered = '';
  let rafId = 0;
  let refreshtime = 0;

  const renderStatus = () => {
    if (!els.status) return;
    let display = basel;

    if (isrefresh) {
      display = `${basel} · <div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>`;
    } else {
      const msLeft = nextrefresh - Date.now();
      const secs = Math.max(0, Math.ceil(msLeft / 1000));
      display = `${basel}${secs > 0 ? ` · ${secs}` : ' · <div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>'}`;
    }

    if (display !== lastRendered) {
      els.status.innerHTML = display;
      lastRendered = display;
    }
  };

  const tick = () => {
    renderStatus();
    rafId = requestAnimationFrame(tick);
  };

  if (!els.status) return;
  tick();

  const sets = (status) => {
    const map = {
      online: { label: 'online', cls: 'online', bracket: false },
      idle: { label: 'idle', cls: 'idle', bracket: false },
      dnd: { label: 'do not disturb', cls: 'dnd', bracket: false },
      offline: { label: 'offline', cls: 'offline', bracket: false },
    };
    const m = map[status] || map.offline;
    els.status.classList.remove('online', 'idle', 'dnd', 'offline');
    els.status.classList.add(m.cls);
    basel = m.bracket ? `${m.label}` : m.label;
    renderStatus();
  };

  const seth = (el, hidden) => {
    if (!el) return;
    el.classList.toggle('hidden', hidden);
  };

  const custo = (activity) => {
    if (!els.activity || !activity) return;
    try {
      els.activity.innerHTML = '';
      const frag = document.createDocumentFragment();

      const e = activity.emoji;
      if (e) {
        if (e.id) {
          const ext = e.animated ? 'gif' : 'png';
          const img = document.createElement('img');
          img.src = `https://cdn.discordapp.com/emojis/${e.id}.${ext}?size=24&quality=lossless`;
          img.alt = e.name || 'emoji';
          img.width = 16;
          img.height = 16;
          img.style.verticalAlign = 'text-bottom';
          img.style.marginRight = '4px';
          frag.appendChild(img);
        } else if (e.name) {
          frag.appendChild(document.createTextNode(`${e.name} `));
        }
      }

      const state = activity.state || '';
      if (state) frag.appendChild(document.createTextNode(state));

      els.activity.appendChild(frag);
      seth(els.activity, false);
    } catch (_) {
      // no
    }
  };

  const avatarUrl = (id, hash) => {
    if (!id || !hash) return '';
    const ext = hash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=128`;
  };

  const update = async () => {
    isrefresh = true;
    renderStatus();
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch presence');
      const json = await res.json();
      const data = json.data;

      sets(data.discord_status);

      const u = data.discord_user || {};
      const name = (u.global_name || u.username || '').toString();
      const handle = u.username ? `@${u.username}` : '';
      const av = avatarUrl(u.id, u.avatar);

      if (els.name) els.name.innerHTML = name || '<div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>';
      if (els.handle) els.handle.innerHTML = handle;
      if (els.avatar) {
        if (av) {
          els.avatar.src = av;
          els.avatar.alt = name || 'Discord avatar';
        }
      }

      let lisl = '';
      if (data.spotify) {
        const song = data.spotify.song;
        const artist = data.spotify.artist;
        lisl = `Listening to ${song}${artist ? ` by ${artist}` : ''} on Spotify`;
      } else if (Array.isArray(data.activities)) {
        const listening = data.activities.find((a) => a.type === 2);
        if (listening) {
          const track = listening.details || '';
          let artist = '';
          if (listening.state) {
            artist = listening.state.replace(/^by\s*/i, '');
          }
          const service = listening.name || 'music';
          let main = '';
          if (track) main = track;
          else if (listening.state && !/^by\s*/i.test(listening.state)) main = listening.state;

          if (main) lisl = `Listening to ${main}${artist ? ` by ${artist}` : ''} on ${service}`;
          else lisl = `Listening on ${service}`;
        }
      }

      let customAct = null;
      if (Array.isArray(data.activities)) {
        customAct = data.activities.find((a) => a.type === 4);
      }

      if (els.activity) {
        if (lisl) {
          els.activity.innerHTML = lisl;
          seth(els.activity, false);
        } else if (customAct && (customAct.state || customAct.emoji)) {
          custo(customAct);
        } else {
          seth(els.activity, true);
        }
      }

      let plal = '';
      if (Array.isArray(data.activities)) {
        const playing = data.activities.find((a) => a.type === 0);
        if (playing) {
          const game = playing.name || playing.details || '';
          if (game) plal = `Playing ${game}`;
        }
      }
      if (els.playing) {
        if (plal) {
          els.playing.innerHTML = plal;
          seth(els.playing, false);
        } else {
          seth(els.playing, true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      isrefresh = false;
      nextrefresh = Date.now() + REFRESH_MS;
      renderStatus();
      if (refreshtime) clearTimeout(refreshtime);
      const delay = Math.max(0, nextrefresh - Date.now());
      refreshtime = setTimeout(update, delay);
    }
  };

  update();
})();

