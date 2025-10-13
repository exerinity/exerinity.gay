(function () {
    const SRC = '/data/songs/spotify.json';
    const box = document.getElementById('spotify-embed');
    const btn = document.getElementById('song-shuffle');
    const ano = document.getElementById('anotherone');

    if (!box) return;

    let xs = [];
    let last = null;

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
        frame.src = `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator`;
        frame.width = '100%';
        frame.height = '152';
        frame.style.border = 'none';
        frame.style.borderRadius = '12px';
        frame.loading = 'lazy';

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

    if (btn) {
        btn.addEventListener('click', go);
        btn.addEventListener('click', another);
    }

    fetch(SRC, { cache: 'no-store' })
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
})();
