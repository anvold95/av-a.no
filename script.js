document.addEventListener('DOMContentLoaded', async () => {
  const data = await (await fetch('content.json')).json();

  // --- Hero Carousel uten piler ---
  const heroImgs = data.hero?.images || [];
  const heroContainer = document.getElementById('hero-images');
  const heroCounter   = document.getElementById('hero-counter');
  if (heroContainer && heroImgs.length) {
    heroContainer.innerHTML = heroImgs.map((img, i) =>
      `<img src="${img.src}" alt="${img.alt||''}"
        class="hero-slide${i===0?' current':''}" data-index="${i}">`
    ).join('');
    heroCounter.textContent = `1 / ${heroImgs.length}`;

    const slides = Array.from(heroContainer.querySelectorAll('.hero-slide'));
    let current = 0;

    function show(i) {
      slides.forEach(s => s.classList.remove('current'));
      slides[i].classList.add('current');
      current = i;
      heroCounter.textContent = `${i+1} / ${slides.length}`;
    }

    // Klikk på bildet for neste
    slides.forEach(s => s.addEventListener('click', () =>
      show((current+1) % slides.length)
    ));

    // Auto-advance
    let timer = setInterval(() => show((current+1)%slides.length), 5000);
    slides.forEach(s => {
      s.addEventListener('mouseenter', () => clearInterval(timer));
      s.addEventListener('mouseleave', () =>
        timer = setInterval(() => show((current+1)%slides.length), 5000)
      );
    });
  }

  // --- Prosjekter Grid ---
  const grid = document.getElementById('projects-grid');
  if (grid && data.projects) {
    grid.innerHTML = data.projects.map(p =>
      `<article class="project">
         <img src="${p.src}" alt="${p.alt||''}">
         ${p.caption?`<div class="cap">${p.caption}</div>`:''}
       </article>`
    ).join('');
  }

  // --- Studio Services ---
  const services = document.getElementById('services-list');
  if (services && data.services) {
    services.innerHTML = data.services.map(s => `<li>${s}</li>`).join('');
  }

  // --- Footer Social Links ---
  document.getElementById('linkedin-link').href   = data.social?.linkedin   || '#';
  document.getElementById('instagram-link').href = data.social?.instagram || '#';

  // --- Mouse glitter-tail ---
  let last = { x:0, y:0, t:0 };
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    const dt = now - last.t || 1;
    const speed = Math.min(Math.hypot(dx,dy)/dt*50, 20); // 0–20 scale
    last = { x: e.clientX, y: e.clientY, t: now };

    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    // skaler størrelsen etter hastighet
    const size = 4 + speed; 
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    document.body.append(dot);
    setTimeout(() => dot.remove(), 800);
  });
});
