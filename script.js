// script.js
(async function () {
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  /* ---------- TEKST + TJENESTER ---------- */
  // (Dersom du fortsatt bruker disse i en annen seksjon)
  const about = document.getElementById('about-text');
  if (about) {
    about.innerHTML = (data.about?.paragraphs || [])
      .map(p => `<p>${p}</p>`)
      .join('');
  }

  const servicesList = document.getElementById('services-list');
  if (servicesList) {
    servicesList.innerHTML = (data.services || [])
      .map(s => `<li>${s}</li>`)
      .join('');
  }

  const ctaLink = document.getElementById('cta-link');
  if (ctaLink && data.cta?.href) {
    ctaLink.href = data.cta.href;
  }

  /* ---------- INSTAGRAM ---------- */
  const instaWrap = document.querySelector('.insta-embed');
  if (instaWrap && data.instagram) {
    if (data.instagram.embedHtml) {
      instaWrap.innerHTML = data.instagram.embedHtml;
      const s = document.createElement('script');
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(s);
    } else if (data.instagram.postUrl) {
      instaWrap.innerHTML = `
        <iframe
          src="${data.instagram.postUrl}embed"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen
          scrolling="no"
          style="width:100%; min-height:300px;">
        </iframe>`;
    }
  }

  /* ---------- HERO CAROUSEL ---------- */
  const heroImages = data.hero?.images || [];
  const heroContainer = document.getElementById('hero-images');
  if (heroContainer && heroImages.length) {
    // Rens utgangspunkt
    heroContainer.innerHTML = heroImages.map((img, i) => `
      <img
        src="${img.src}"
        alt="${img.alt || ''}"
        class="hero-slide${i === 0 ? ' current' : ''}">
    `).join('');

    const slides = Array.from(heroContainer.querySelectorAll('.hero-slide'));
    let current = 0;

    function show(idx) {
      slides.forEach((s, i) => s.classList.toggle('current', i === idx));
      current = idx;
    }

    document.querySelector('.hero-btn.prev')?.addEventListener('click', () => {
      show((current - 1 + slides.length) % slides.length);
    });
    document.querySelector('.hero-btn.next')?.addEventListener('click', () => {
      show((current + 1) % slides.length);
    });

    // Automatisk rulling hver 5s
    let timer = setInterval(() => {
      show((current + 1) % slides.length);
    }, 5000);

    // Pause automatikk ved hover
    [ ...slides, 
      document.querySelector('.hero-btn.prev'),
      document.querySelector('.hero-btn.next')
    ].forEach(el => {
      el?.addEventListener('mouseenter', () => clearInterval(timer));
      el?.addEventListener('mouseleave', () => {
        timer = setInterval(() => show((current + 1) % slides.length), 5000);
      });
    });
  }

  /* ---------- PROSJEKT-GRID + LIGHTBOX ---------- */
  const projects = data.projects || [];
  const grid = document.querySelector('.projects-grid');
  if (grid) {
    grid.innerHTML = projects.map((p, i) => `
      <article class="project">
        <img src="${p.src}" alt="${p.alt || ''}" loading="lazy">
        ${p.caption ? `<div class="cap">${p.caption}</div>` : ''}
      </article>
    `).join('');
  }

  // Lightbox (valgfritt å beholde)
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const lbClose = document.querySelector('.lightbox-close');

  function openLB(idx) {
    const it = projects[idx];
    if (!it) return;
    lbImg.src = it.src;
    lbImg.alt = it.alt || '';
    lbCap.textContent = it.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  grid?.addEventListener('click', e => {
    const item = e.target.closest('.project');
    if (!item) return;
    const idx = Array.from(grid.children).indexOf(item);
    openLB(idx);
  });
  lbClose?.addEventListener('click', closeLB);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLB();
  });
  window.addEventListener('keydown', e => {
    if (!lightbox?.hidden && (e.key === 'Escape' || e.key === 'Esc')) closeLB();
  });

})();
