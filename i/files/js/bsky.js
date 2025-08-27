(function () {
  const DID = 'did:plc:4ol7tajbdx5ugq2zblpmraf2';
  const API = 'https://public.api.bsky.app/xrpc';

  async function get(u) {
    const r = await fetch(u, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${u}`);
    return r.json();
  }

  function esc(s) {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function link(t) {
    const e = esc(t || '');
    return e.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function postUrl(uri) {
    try {
      const p = uri.split('/');
      const k = p[p.length - 1];
      const id = uri.split('/')[2].replace('at://', '');
      return `https://bsky.app/profile/${id}/post/${k}`;
    } catch { return 'https://bsky.app'; }
  }

  function imgs(em) {
    const xs = em?.images || [];
    if (!xs.length) return '';
    return `<div class="bsky-images">${xs.map(x => {
      const f = x.fullsize || x.thumb;
      const t = x.thumb || x.fullsize;
      const a = esc(x.alt || '');
      return `<a href="${f}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${t}" alt="${a}"></a>`;
    }).join('')}</div>`;
  }

  function vid(em) {
    if (!em) return '';
    const pl = em.playlist;
    const th = em.thumbnail;
    if (!pl) return '';
    const videoId = `video-${Math.random().toString(36).substr(2, 9)}`;
    
    setTimeout(() => {
      const video = document.getElementById(videoId);
      if (!video) return;
      
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = pl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(pl);
        hls.attachMedia(video);
      } else {
        video.innerHTML = `<p><i class="fa-solid fa-arrow-up-right-from-square"></i> your browser may not support HLS playback - <a href="${pl}" target="_blank" rel="noopener noreferrer">open video on bluesky</a>?</p>`;
      }
    }, 0);
    
    return `<div class="bsky-video">
      <video id="${videoId}" controls preload="metadata" ${th ? `poster="${th}"` : ''}></video>
    </div>`;
  }

  function emb(em) {
    if (!em) return '';
    const t = em.$type || '';
    if (t.endsWith('embed.images#view')) return imgs(em);
    if (t.endsWith('embed.video#view')) return vid(em);
    if (t.endsWith('embed.recordWithMedia#view')) {
      return emb(em.media) || emb(em.record);
    }
    if (t.endsWith('embed.record#view')) {
      const rec = em.record;
      const by = rec?.author?.handle ? `@${esc(rec.author.handle)}` : '';
      const text = rec?.value?.text ? esc(rec.value.text).slice(0, 200) : '';
      const u = rec?.uri ? postUrl(rec.uri) : 'https://bsky.app';
      return `<a class="bsky-quote" href="${u}" target="_blank" rel="noopener noreferrer">quoted post ${by}${text ? `: ${text}` : ''}</a>`;
    }
    return '';
  }

  function post(item) {
    const post = item?.post;
    if (!post) return '<p class="bsky-error">Nothing!</p>';
    const rec = post.record || {};
    const raw = link(rec.text || '');
    const why = item.reason && item.reason.$type && item.reason.$type.includes('#reasonRepost') ? item.reason : null;
    const from = why ? (post.author?.handle ? `reposted from @${esc(post.author.handle)}` : 'reposted') : '';
    const url = postUrl(post.uri);

    let ems = '';
    if (post.embed) ems = emb(post.embed);

    return `
      <article class="bsky-item">
        ${from ? `<div class="bsky-repost">${from}</div>` : ''}
        ${raw ? `<p class="bsky-text">${raw}</p>` : ''}
        ${ems}
        <div class="bsky-footer"><a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> open</a></div>
      </article>
    `;
  }

  function profile(p) {
    const av = p?.avatar || '';
    const nm = p?.displayName || p?.handle || 'Bluesky';
    const at = p?.handle ? `@${p.handle}` : '';
    const id = p?.did || DID;
    const href = `https://bsky.app/profile/exerinity.com`;
    return `
      <div class="bsky-profile-card">
        ${av ? `<img class="bsky-avatar" src="${av}" alt="${esc(nm)}" loading="lazy">` : ''}
        <div class="bsky-ident">
          <div class="bsky-name">${esc(nm)}</div>
          ${at ? `<div class="bsky-handle"><a href="${href}" target="_blank" rel="noopener noreferrer">${esc(at)}</a></div>` : ''}
        </div>
      </div>
    `;
  }

  async function run() {
    const prof = document.getElementById('bsky-profile');
    const box = document.getElementById('bsky-post');
    if (!prof || !box) return;
    box.innerHTML = '<p class="loading"><div class="spinner"></div></p>';

    try {
      const [p, f] = await Promise.all([
        get(`${API}/app.bsky.actor.getProfile?actor=${encodeURIComponent(DID)}`),
        get(`${API}/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(DID)}&limit=1`)
      ]);

      prof.innerHTML = profile(p);

      const item = (f?.feed && f.feed[0]) || null;
      if (item) {
        box.innerHTML = post(item);
        twittermoji();
      } else {
        box.innerHTML = '<p class="bsky-empty">nothing!</p>';
      }
    } catch (err) {
      console.error(err);
      const msg = `<p class="bsky-error">nothing!</p>`;
      if (prof) prof.innerHTML = msg;
      if (box) box.innerHTML = '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
