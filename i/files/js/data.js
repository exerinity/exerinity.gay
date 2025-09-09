(() => {
    console.log('ready to fetch data...');
    const API = 'https://api.exerinity.com/getdata';

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
        console.log('updating status display...');
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
        console.log('toggling visibility...');
        if (el) el.classList.toggle('hidden', hidden);
    };

    const cusa = (activity) => {
        console.log('updating custom status...');
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
        console.log('getting avatar url...');
        if (!id || !hash) return '';
        const ext = hash.startsWith('a_') ? 'gif' : 'png';
        console.log(`avatar id: ${id}, hash: ${hash}, ext: ${ext}`);
        return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=128`;
    };

    const uds = (dc) => {
        console.log('updating discord presence...');
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

    const pu = (uri) => {
        console.log('processing bluesky uri...');
        try {
            const parts = uri.split('/');
            const key = parts[parts.length - 1];
            const id = uri.split('/')[2].replace('at://', '');
            return `https://bsky.app/profile/${id}/post/${key}`;
        } catch { return 'https://bsky.app'; }
    };

    const ri = (em) => {
        console.log('rendering images...');
        const xs = em?.images || [];
        if (!xs.length) return '';
        return `<div class="bsky-images">${xs.map(x => {
            const f = x.fullsize || x.thumb;
            const t = x.thumb || x.fullsize;
            const a = esc(x.alt || '');
            return `<a href="${f}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${t}" alt="${a}"></a>`;
        }).join('')}</div>`;
    };

    const rv = (em) => {
        console.log('rendering video...');
        if (!em) return '';
        const pl = em.playlist;
        const th = em.thumbnail;
        if (!pl) return '';
        const vid = `video-${Math.random().toString(36).slice(2, 11)}`;

        setTimeout(() => {
            const video = document.getElementById(vid);
            if (!video) return;
            if (video.canPlayType && video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = pl;
            } else if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
                const hls = new window.Hls();
                hls.loadSource(pl);
                hls.attachMedia(video);
            } else {
                video.innerHTML = `<p><i class="fa-solid fa-arrow-up-right-from-square"></i> your browser may not support HLS playback - <a href="${pl}" target="_blank" rel="noopener noreferrer">open video on bluesky</a>?</p>`;
            }
        }, 0);

        return `<div class="bsky-video">
			<video id="${vid}" controls preload="metadata" ${th ? `poster="${th}"` : ''}></video>
		</div>`;
    };

    const ree = (em) => {
        console.log('rendering embed...');
        if (!em) return '';
        const t = em.$type || '';
        if (t.endsWith('embed.images#view')) return ri(em);
        if (t.endsWith('embed.video#view')) return rv(em);
        if (t.endsWith('embed.recordWithMedia#view')) {
            return ree(em.media) || ree(em.record);
        }
        if (t.endsWith('embed.record#view')) {
            const rec = em.record;
            const by = rec?.author?.handle ? `@${esc(rec.author.handle)}` : '';
            const text = rec?.value?.text ? esc(rec.value.text).slice(0, 200) : '';
            const u = rec?.uri ? pu(rec.uri) : 'https://bsky.app';
            return `<a class="bsky-quote" href="${u}" target="_blank" rel="noopener noreferrer">quoted post ${by}${text ? `: ${text}` : ''}</a>`;
        }
        return '';
    };

    const rep = (item) => {
        console.log('building post html...');
        const post = item?.post;
        if (!post) return '<p class="bsky-error">Nothing!</p>';
        const rec = post.record || {};
        const raw = linkify(rec.text || '');
        const why = item.reason && item.reason.$type && item.reason.$type.includes('#reasonRepost') ? item.reason : null;
        const from = why ? (post.author?.handle ? `reposted from @${esc(post.author.handle)}` : 'reposted') : '';
        const url = pu(post.uri);

        let ems = '';
        if (post.embed) ems = ree(post.embed);

        return `
			<article class="bsky-item">
				${from ? `<div class="bsky-repost">${from}</div>` : ''}
				${raw ? `<p class="bsky-text">${raw}</p>` : ''}
				${ems}
				<div class="bsky-footer"><a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> open</a></div>
			</article>
		`;
    };

    const rpr = (p) => {
        console.log('rendering profile...');
        const av = p?.avatar || '';
        const nm = p?.displayName || p?.handle || 'Bluesky';
        const at = p?.handle ? `@${p.handle}` : '';
        const href = p?.handle ? `https://bsky.app/profile/${p.handle}` : 'https://bsky.app';
        return `
			<div class="bsky-profile-card">
				${av ? `<img class="bsky-avatar" src="${av}" alt="${esc(nm)}" loading="lazy">` : ''}
				<div class="bsky-ident">
					<div class="bsky-name">${esc(nm)}</div>
					${at ? `<div class="bsky-handle"><a href="${href}" target="_blank" rel="noopener noreferrer">${esc(at)}</a></div>` : ''}
				</div>
			</div>
		`;
    };

    let curr = null;

    const ub = (bs) => {
        const ppl = $('bsky-profile');
        const pol = $('bsky-post');
        if (!ppl && !pol) return;

        try {
            if (ppl) ppl.innerHTML = rpr(bs?.profile || {});
            const item = bs?.feed?.feed?.[0] || null;

            if (item && curr && item.post && curr.post && item.post.uri === curr.post.uri) {
                console.log('no new post...');
                return;
            }

            if (pol) pol.innerHTML = '<p class="loading"><div class="spinner"></div></p>';

            if (pol) {
                if (item) {
                    pol.innerHTML = rep(item);
                    console.log('rendering post');
                    curr = item;
                    try { if (typeof twittermoji === 'function') twittermoji(); } catch { }
                } else {
                    pol.innerHTML = '<p class="bsky-empty">nothing!</p>';
                }
            }
        } catch (e) {
            console.error(e);
            if (ppl) ppl.innerHTML = '<p class="bsky-error">nothing!</p>';
            if (pol) pol.innerHTML = '';
        }
    };

    const load = async () => {
        console.log('loading data...');
        isload = true;
        renderit();
        try {
            const res = await fetch(API, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            if (json.discord) uds(json.discord);
            if (json.bluesky) ub(json.bluesky);
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
        console.log('starting application...');
        const hds = dizel.status || dizel.activity || dizel.playing || dizel.avatar || dizel.name || dizel.handle;
        const hbs = $('bsky-profile') || $('bsky-post');
        if (!hds && !hbs) return;
        load();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

