(() => {
    const API = 'https://api.lanyard.rest/v1/users/972907501127344179'
    //const API = 'https://bagel.exerinity.dev/getdata?only=discord'; // visit this yourself and remove the "only" parameter. it also returns my latest bluesky posts, but i stopped using that app

    const $ = (id) => document.getElementById(id);
    const esc = (s = '') => s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    const linkify = (t = '') => esc(t).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    const dizel = {
        status: $('status'),
        activity: $('activity'),
        playing: $('playing'),
        avatar: $('dc-avatar'),
        deco: $('dc-avatar-deco'),
        name: $('dc-name'),
        handle: $('dc-handle'),
    };

    const REFRESH_MS = 10000;
    let nextrefresh = Date.now() + REFRESH_MS;
    let basel = '<div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>';
    let isload = false;
    let lastRendered = '';
    let rafId = 0;
    let refreshtime = 0;
    let dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;

    const tuneAvatarOverlay = () => {
        try {
            const av = dizel.avatar;
            const deco = dizel.deco;
            if (!av || !deco) return;
            const wrap = av.parentElement;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            const scale = 1.05;
            wrap.style.width = w + 'px';
            wrap.style.height = h + 'px';
            av.style.width = w + 'px';
            av.style.height = h + 'px';
            deco.style.width = w + 'px';
            deco.style.height = h + 'px';
            deco.style.left = '50%';
            deco.style.top = '50%';
            deco.style.setProperty('--deco-scale', scale);
        } catch { }
    };

    const renderit = () => {
        if (!dizel.status) return;
        let display = basel;
        if (isload) {
            display = `${basel} · <div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>`;
        } else {
            const msLeft = nextrefresh - Date.now();
            const secs = Math.max(0, Math.ceil(msLeft / 1000));
            display = `${basel}${secs > 0 ? ` · ${secs}` : ' · <div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>'}`;
        }

        

        if (display !== lastRendered) {
            dizel.status.innerHTML = display;
            lastRendered = display;
        }
    };

    const tick = () => {
        renderit();
        rafId = requestAnimationFrame(tick);
    };
    if (dizel.status) tick();

    const diz = (status) => {
        if (!dizel.status) return;
        const map = {
            online: { label: 'online', cls: 'online' },
            idle: { label: 'idle', cls: 'idle' },
            dnd: { label: 'do not disturb', cls: 'dnd' },
            offline: { label: 'offline', cls: 'offline' },
        };
        const m = map[status] || map.offline;
        dizel.status.classList.remove('online', 'idle', 'dnd', 'offline');
        dizel.status.classList.add(m.cls);
        basel = m.label;
        renderit();
    };

    const sh = (el, hidden) => {
        if (el) el.classList.toggle('hidden', hidden);
    };

    const cusa = (activity) => {
        if (!dizel.activity || !activity) return;
        try {
            dizel.activity.innerHTML = '';
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
            dizel.activity.appendChild(frag);
            sh(dizel.activity, false);
        } catch { }
    };

    const avu = (id, hash) => {
        if (!id || !hash) return '';
        const ext = hash.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=128`;
    };

    const uds = (dc) => {
        if (!dc) return;
        const data = dc.data || {};

        diz(data.discord_status);

        const u = data.discord_user || {};
        const name = (u.global_name || u.username || '').toString();
        const handle = u.username ? `@${u.username}` : '';
        const av = avu(u.id, u.avatar);
        if (dizel.name) dizel.name.innerHTML = name || '<div class="spinner" style="width:1em;height:1em;display:inline-block;vertical-align:middle;"></div>';
        if (dizel.handle) dizel.handle.innerHTML = handle;
        if (dizel.avatar && av) dizel.avatar.src = av;
        try {
            const decoData = u.avatar_decoration_data;
            if (dizel.deco) {
                if (decoData && decoData.asset) {
                    const decoUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decoData.asset}.png?size=4096&passthrough=true`;
                    if (dizel.deco.src !== decoUrl) dizel.deco.src = decoUrl;
                    sh(dizel.deco, false);
                } else {
                    sh(dizel.deco, true);
                }
            }
        } catch {}
        if (dizel.avatar) {
            if (dizel.avatar.complete) requestAnimationFrame(tuneAvatarOverlay);
            else dizel.avatar.addEventListener('load', () => requestAnimationFrame(tuneAvatarOverlay), { once: true });
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
                if (listening.state) artist = listening.state.replace(/^by\s*/i, '');
                const service = listening.name || 'music';
                let main = '';
                if (track) main = track;
                else if (listening.state && !/^by\s*/i.test(listening.state)) main = listening.state;
                lisl = main ? `Listening to ${main}${artist ? ` by ${artist}` : ''} on ${service}` : `Listening on ${service}`;
            }
        }

        let act = null;
        if (Array.isArray(data.activities)) act = data.activities.find((a) => a.type === 4);

        if (dizel.activity) {
            if (lisl) {
                dizel.activity.innerHTML = lisl;
                sh(dizel.activity, false);
            } else if (act && (act.state || act.emoji)) {
                cusa(act);
            } else {
                sh(dizel.activity, true);
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
        if (dizel.playing) {
            if (plal) {
                dizel.playing.innerHTML = plal;
                sh(dizel.playing, false);
            } else {
                sh(dizel.playing, true);
            }
        }
    };

    const load = async () => {
        isload = true;
        renderit();
        try {
            const res = await fetch(API, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            let dcBlock = null;
            if (json && json.discord && json.discord.data) {
                dcBlock = json.discord;
            } else if (json && json.data) {
                dcBlock = { data: json.data, success: json.success };
            }
            if (dcBlock) uds(dcBlock);
        } catch (err) {
            console.error(err);
        } finally {
            isload = false;
            nextrefresh = Date.now() + REFRESH_MS;
            renderit();
            if (refreshtime) clearTimeout(refreshtime);
            const delay = Math.max(0, nextrefresh - Date.now());
            refreshtime = setTimeout(load, delay);
        }
    };

    const start = () => {
        const hds = dizel.status || dizel.activity || dizel.playing || dizel.avatar || dizel.name || dizel.handle;
        if (!hds) return;
        load();
        requestAnimationFrame(tuneAvatarOverlay);
        window.addEventListener('resize', () => requestAnimationFrame(tuneAvatarOverlay));
        setInterval(() => {
            const ndpr = window.devicePixelRatio || 1;
            if (ndpr !== dpr) {
                dpr = ndpr;
                requestAnimationFrame(tuneAvatarOverlay);
            }
        }, 600);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
