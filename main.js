/* ─────────────────────────────────────────────────────────
   ⬇  CONFIGURA AQUÍ la fecha y hora exacta del evento
   Formato: 'YYYY-MM-DDTHH:MM:00'
   Ejemplo:  '2025-08-15T18:00:00'  →  15 de agosto 2025 a las 6pm
───────────────────────────────────────────────────────── */
const EVENT_DATE = new Date('2026-07-05T18:00:00');

/* ─────────────────────────────────────────────────────────
   CUENTA REGRESIVA
───────────────────────────────────────────────────────── */
function updateCountdown() {
  const now  = new Date();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    ['cd-dias','cd-horas','cd-min','cd-seg'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const dias  = Math.floor(diff / 86400000);
  const horas = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const segs  = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cd-dias').textContent  = String(dias).padStart(2, '0');
  document.getElementById('cd-horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('cd-min').textContent   = String(mins).padStart(2, '0');
  document.getElementById('cd-seg').textContent   = String(segs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ─────────────────────────────────────────────────────────
   SCROLL REVEAL — aparición de secciones al hacer scroll
───────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ─────────────────────────────────────────────────────────
   CONFIRMACIÓN DE ASISTENCIA
   Cambia el número de WhatsApp en la variable "tel"
───────────────────────────────────────────────────────── */
function enviarConfirmacion(e) {
  e.preventDefault();

  const nombre   = document.getElementById('cf-nombre').value.trim();
  const personas = document.getElementById('cf-personas').value || '1';
  const asiste   = document.getElementById('cf-asiste').value;

  if (!asiste) {
    alert('Por favor indica si asistirás.');
    return;
  }

  /* ⬇ Pon aquí el número con código de país (sin + ni espacios) */
  const tel = '521XXXXXXXXXX';

  const msg = encodeURIComponent(
    `¡Hola! Confirmación XV de Nahomi 🌸\n` +
    `👤 Nombre: ${nombre}\n` +
    `👥 Personas: ${personas}\n` +
    `✅ Asiste: ${asiste === 'si' ? 'Sí asistiré 🎉' : 'No podré asistir 😢'}`
  );

  /* Abre WhatsApp con el mensaje prellenado */
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank');

  /* Muestra mensaje de confirmación en la página */
  const msgEl = document.getElementById('confirm-msg');
  if (msgEl) msgEl.style.display = 'block';

  /* Limpia el formulario */
  e.target.reset();
}

/* ─────────────────────────────────────────────────────────
   MÚSICA DE FONDO
   Agrega tu canción en /audio/cancion.mp3 y descomenta la
   etiqueta <source> en index.html
───────────────────────────────────────────────────────── */
let musicPlaying = false;

function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('musicBtn');

  if (!audio.src && audio.querySelectorAll('source').length === 0) {
    alert('Agrega tu canción en la carpeta /audio/ y enlázala en el tag <audio> de index.html');
    return;
  }

  if (musicPlaying) {
    audio.pause();
    btn.textContent = '🎵';
  } else {
    audio.play();
    btn.textContent = '🔇';
  }

  musicPlaying = !musicPlaying;
}



/* ─────────────────────────────────────────────────────────
   PÉTALOS ANIMADOS (canvas fijo en fondo)
───────────────────────────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  let petals = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnPetal() {
    petals.push({
      x:     Math.random() * canvas.width,
      y:     -12,
      size:  Math.random() * 10 + 5,
      speed: Math.random() * 1.2 + 0.5,
      drift: Math.random() * 1.5 - 0.75,
      rot:   Math.random() * Math.PI * 2,
      rotS:  (Math.random() - 0.5) * 0.04,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#e8b4c0' : '#c9a96e'
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.08) spawnPetal();
    petals = petals.filter(p => p.y < canvas.height + 20);
    petals.forEach(p => {
      p.y   += p.speed;
      p.x   += p.drift;
      p.rot += p.rotS;
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }

  animate();
})();
