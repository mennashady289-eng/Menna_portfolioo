// ===== Theme toggle =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
function applyTheme(t){
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', t);
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navList.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
}));

// ===== Anti-gravity starfield background (canvas) =====
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function resize(){
  canvas.width = innerWidth; canvas.height = innerHeight;
  const count = Math.floor((innerWidth * innerHeight) / 9000);
  stars = Array.from({length: count}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6 + 0.4,
    s: Math.random() * 0.3 + 0.05
  }));
}
resize();
addEventListener('resize', resize);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const light = root.getAttribute('data-theme') === 'light';
  ctx.fillStyle = light ? 'rgba(196,80,30,0.35)' : 'rgba(255,255,255,0.65)';
  stars.forEach(st => {
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fill();
    if(!reduceMotion){
      st.y -= st.s; // gentle upward drift = "anti-gravity"
      if(st.y < -5) st.y = innerHeight + 5;
    }
  });
  requestAnimationFrame(draw);
}
draw();

// ===== Subtle parallax on hero image (mouse-follow, disabled on touch) =====
const heroImg = document.querySelector('.hero-img');
if (matchMedia('(pointer: fine)').matches && !reduceMotion) {
  addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5) * 14;
    const y = (e.clientY / innerHeight - 0.5) * 14;
    heroImg.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// ===== Scroll-triggered reveal =====
const revealTargets = document.querySelectorAll('section .wrap > *');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.opacity = 1;
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  io.observe(el);
});