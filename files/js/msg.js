async function msg(text, options = {}) {
    const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'var(--overlay-bg, rgba(0,0,0,0.35))';
    overlay.style.backdropFilter = 'blur(7px)';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    if (!reduceMotion) overlay.style.animation = 'fin 0.2s ease';

    const box = document.createElement('div');
    box.style.background = 'var(--dialog-bg, #141414)';
    box.style.color = 'var(--fg, #fff)';
    box.style.borderRadius = '16px';
    box.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
    box.style.padding = '2rem 2.5rem 1.5rem 2.5rem';
    box.style.maxWidth = '420px';
    box.style.width = '90vw';
    box.style.position = 'absolute';
    box.style.fontFamily = 'inherit';
    box.style.textAlign = 'center';
    if (!reduceMotion) box.style.animation = 'zin 0.2s ease';

    const title = document.createElement('div');
    title.style.position = 'absolute';
    title.style.top = '12px';
    title.style.left = '16px';
    title.style.fontSize = '1.2rem';
    title.style.fontWeight = 'bold';
    title.style.color = 'var(--fg, #fff)';
    title.style.cursor = 'move';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.height = '24px';
    title.style.userSelect = 'none';
    title.innerHTML = `${options.titlebarText || 'exerinity.gay'}`;

    const close = document.createElement('button');
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    close.setAttribute('aria-label', 'Close');
    close.style.position = 'absolute';
    close.style.top = '12px';
    close.style.right = '16px';
    close.style.background = 'none';
    close.style.border = 'none';
    close.style.fontSize = '1.3rem';
    close.style.cursor = 'pointer';
    close.style.color = 'var(--error-bg, #ff6666)';
    close.style.transition = 'color 0.2s';
    close.onmouseenter = () => close.style.color = 'var(--fg, #fff)';
    close.onmouseleave = () => close.style.color = 'var(--error-bg, #ff6666)';

    const removeOverlay = () => {
        if (reduceMotion) {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            return;
        }
        box.style.animation = 'zout 0.15s ease forwards';
        overlay.style.animation = 'fout 0.15s ease forwards';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 250);
    };

    close.onclick = removeOverlay;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    title.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - box.getBoundingClientRect().left;
        offsetY = e.clientY - box.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            box.style.left = `${e.clientX - offsetX}px`;
            box.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    const content = document.createElement('div');
        content.style.marginTop = '0.5rem';
    content.style.fontSize = '1.08rem';
    content.style.lineHeight = '1.6';
    content.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1rem; align-items:stretch; text-align:left;">
                <div style="margin-bottom:0.25rem; cursor: default;">${text}</div>
                <div style="display:flex; justify-content:flex-end;">
                    <button id="bu" type="button" style="background: var(--btn-bg, #333); color: var(--fg, #fff); padding: 0.6rem 1rem; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.15); transition: filter 0.2s ease, transform 0.02s ease; outline: none;">Close</button>
                </div>
            </div>
    `;
    const bu = content.querySelector('#bu');
    if (bu) {
        if (reduceMotion) {
            bu.style.transition = 'none';
        }
        bu.addEventListener('click', removeOverlay);
        bu.onmouseenter = () => bu.style.filter = 'brightness(1.15)';
        bu.onmouseleave = () => bu.style.filter = '';
        if (!reduceMotion) {
            bu.onmousedown = () => bu.style.transform = 'scale(0.98)';
            bu.onmouseup = () => bu.style.transform = '';
        } else {
            bu.onmousedown = null;
            bu.onmouseup = null;
            bu.style.transform = '';
        }
    }

    box.appendChild(title);
    box.appendChild(close);
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) removeOverlay();
    });

    if (!document.getElementById('msg-modal-animations')) {
        const style = document.createElement('style');
        style.id = 'msg-modal-animations';
        style.textContent = `
            @keyframes zin { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes zout { from { transform: scale(1); opacity: 1; } to { transform: scale(0.7); opacity: 0; } }
            @keyframes fin { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fout { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}