
const wrap = document.getElementById('pts');
const colors = [
  'rgba(139,92,246,0.7)',
  'rgba(59,130,246,0.6)',
  'rgba(167,139,250,0.8)',
  'rgba(255,255,255,0.5)'
];
for (let i = 0; i < 40; i++) {
  const s = document.createElement('div');
  const sz = Math.random() * 3 + 1.5;
  const col = colors[Math.floor(Math.random() * colors.length)];
  s.className = 'star-p';
  s.style.cssText = `
    width:${sz}px;
    height:${sz}px;
    left:${Math.random() * 100}%;
    background:${col};
    box-shadow:0 0 ${sz * 2}px ${col};
    animation-duration:${Math.random() * 14 + 8}s;
    animation-delay:${Math.random() * 12}s;
  `;
  wrap.appendChild(s);
}

// ─── NAV SCROLL EFFECT ───
window.addEventListener('scroll', () => {
  document.getElementById('topnav').style.background =
    window.scrollY > 60
      ? 'rgba(4,4,15,0.98)'
      : 'rgba(4,4,15,0.9)';
});

// ─── SCROLL REVEAL ───
const obs = new IntersectionObserver(entries => {
  entries.forEach(x => {
    if (x.isIntersecting) x.target.classList.add('on');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// ─── CONTACT FORM SUBMIT ───
async function sendForm() {
  const fn  = document.getElementById('fn').value.trim();
  const ln  = document.getElementById('ln').value.trim();
  const em  = document.getElementById('em').value.trim();
  const cc  = document.getElementById('cc').value;
  const ph  = document.getElementById('ph').value.trim();
  const sv  = document.getElementById('sv').value;
  const ms  = document.getElementById('ms').value.trim();
  const btn = document.getElementById('sbtn');
  const ok  = document.getElementById('okMsg');
  const err = document.getElementById('errMsg');

  if (!fn || !em || !sv || !ms) {
    alert('Please fill in: Name, Email, Service, and Message.');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/xgolgjnq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:     `${fn} ${ln}`,
        email:    em,
        phone:    ph ? `${cc} ${ph}` : 'Not provided',
        service:  sv,
        message:  ms,
        _replyto: em,
        _subject: `New Order from ${fn}: ${sv}`
      })
    });

    if (res.ok) {
      ok.style.display = 'block';
      err.style.display = 'none';
      // Clear form
      ['fn','ln','em','ph','sv','ms'].forEach(id => {
        document.getElementById(id).value = '';
      });
    } else {
      throw new Error('Server error');
    }

  } catch (e) {
    // Fallback: open mailto
    const subject = encodeURIComponent(`New Order: ${sv} — from ${fn}`);
    const body    = encodeURIComponent(
      `Name: ${fn} ${ln}\nEmail: ${em}\nPhone: ${cc} ${ph}\nService: ${sv}\n\nMessage:\n${ms}`
    );
    window.open(`mailto:muhammadmudasir5223@gmail.com?subject=${subject}&body=${body}`);
    ok.style.display = 'block';
    ok.textContent = '✅ Opening your email client to send the message...';
    err.style.display = 'none';
  }

  btn.textContent = 'Send Message →';
  btn.disabled = false;
}