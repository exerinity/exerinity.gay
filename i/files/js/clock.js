(function () {
  const elU = document.getElementById('clock-utc');
  const elL = document.getElementById('clock-local');
  const elU10 = document.getElementById('clock-utc10');
  if (!elU || !elL || !elU10) return;

  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  const icons = {
    day: '<i title="Day" id="tic" class="fa-solid fa-sun" style="color: #FFD43B;"></i>',
    night: '<i title="Night" id="tic" class="fa-solid fa-moon"></i>'
  };

  function pad(n) { return n.toString().padStart(2, '0'); }

  function icon(d) {
    const h = d.getHours();
    return (h >= 6 && h < 18) ? icons.day : icons.night;
  }

  function time(d, h24) {
    let h = d.getHours();
    const m = pad(d.getMinutes());
    const s = pad(d.getSeconds());

    if (h24) {
      return `${pad(h)}:${m}:${s}`;
    }
    const ap = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m}:${s} ${ap} ${icon(d)}`;
  }

  function fmt(d, h24) {
    const day = days[d.getDay()];
    const x = d.getDate();
    const mon = months[d.getMonth()];
    const y = d.getFullYear();
    const t = time(d, h24);
    return `${day} ${x} ${mon} ${y} - ${t}`;
  }

  function tz(d, off) {
    const u = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(u + off * 60000);
  }

  function is24() {
    try {
      const f = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
      const ps = f.formatToParts(new Date());
      const has = ps.some(p => p.type === 'dayPeriod');
      return !has;
    } catch { return false; }
  }

  const h24 = is24();

  function go() {
    const n = new Date();

    const u = new Date(
      n.getUTCFullYear(),
      n.getUTCMonth(),
      n.getUTCDate(),
      n.getUTCHours(),
      n.getUTCMinutes(),
      n.getUTCSeconds()
    );

    const loc = n;

    const u10 = tz(n, 660);

    elU.innerHTML = fmt(u, h24);
    elL.innerHTML = fmt(loc, h24);
    elU10.innerHTML = fmt(u10, h24);
  }

  go();
  setInterval(go, 1000);
})();