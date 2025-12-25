(function () {
    let timer = null;

    function hold(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (confirm('Stop stargazing?')) {
                document.getElementById('bgstars').remove();
                setTimeout(() => { window.location.assign('/'); }, 500);
            }
        }, 400);
    }

    function anull() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    document.addEventListener('pointerdown', hold);
    document.addEventListener('pointerup', anull, { passive: true });
    document.addEventListener('pointercancel', anull, { passive: true });
    document.addEventListener('pointerleave', anull, { passive: true });

    document.addEventListener('dblclick', (e) => {
        anull();
        if (e.button !== undefined && e.button !== 0) return;
        if (confirm('Stop stargazing?')) {
            document.getElementById('bgstars').remove();
            setTimeout(() => { window.location.assign('/'); }, 500);
        }
    }, { passive: true });
})();

setTimeout(() => {
    document.getElementById('text').style.display = 'none';
}, 1500);