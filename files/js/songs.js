(function () {
    const box = document.getElementById('spotify-embed');
    const btn = document.getElementById('song-shuffle');
    const ano = document.getElementById('anotherone');
    const toggle = document.getElementById('platform-toggle');

    if (!box) return;

    const PLATFORMS = {
        spotify: {
            name: 'Spotify',
            icon: 'fa-brands fa-spotify',
            src: '/data/songs/spotify.json',
            embed: id => `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator`,
            height: '152'
        },
        tidal: {
            name: 'TIDAL',
            icon: 'fa-brands fa-tidal',
            src: '/data/songs/tidal.json',
            embed: id => `https://embed.tidal.com/tracks/${encodeURIComponent(id)}`,
            height: '180'
        }
    };

    let platform = (localStorage.getItem('songPlatform') || 'spotify');
    if (!(platform in PLATFORMS)) platform = 'spotify';

    let xs = [];
    let last = null;

    function applyToggleUI() {
        if (!toggle) return;
        const p = PLATFORMS[platform];
        toggle.title = p.name;
        toggle.setAttribute('aria-label', `Toggle music platform (currently ${p.name})`);
        toggle.setAttribute('data-platform', platform);
    }

    function pick() {
        if (!xs.length) return null;
        if (xs.length === 1) return xs[0];
        let id;
        do {
            id = xs[Math.floor(Math.random() * xs.length)];
        } while (id === last);
        return id;
    }

    function show(id) {
        if (!id) return;
        last = id;
        box.innerHTML = '';

        const wrap = document.createElement('div');
        wrap.className = 'spotify-embed-wrapper';

        const frame = document.createElement('iframe');
        const p = PLATFORMS[platform];
        frame.src = p.embed(id);
        frame.width = '100%';
        frame.height = p.height;
        frame.style.border = 'none';
        frame.style.borderRadius = '12px';
        frame.loading = 'lazy';
        frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media;');

        wrap.appendChild(frame);

        box.appendChild(wrap);
    }

    function go() {
        const id = pick();
        show(id);
    }

    function another() {
        ano.currentTime = 0;
        ano.play();
    }

    function loadSongs() {
        const p = PLATFORMS[platform];
        box.innerHTML = '<div class="spinner"></div>';
        return fetch(p.src, { cache: 'no-store' })
            .then(r => {
                if (!r.ok) throw new Error(r.status);
                return r.json();
            })
            .then(list => {
                if (!Array.isArray(list)) throw new Error('Invalid songs JSON');
                xs = list.filter(Boolean);
                go();
            })
            .catch(err => {
                console.error(err);
                box.innerHTML = '<p style="opacity:.8">nothing!</p>';
            });
    }

    if (btn) {
        btn.addEventListener('click', go);
        btn.addEventListener('click', another);
    }

    function togglePlatform() {
        platform = platform === 'spotify' ? 'tidal' : 'spotify';
        localStorage.setItem('songPlatform', platform);
        applyToggleUI();
        xs = [];
        last = null;
        loadSongs();
    }

    if (toggle) {
        toggle.addEventListener('click', togglePlatform);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePlatform();
            }
        });
    }

    applyToggleUI();
    loadSongs();
})();
