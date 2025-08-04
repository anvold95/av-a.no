(async function () {
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  /* ---------- Tekst + tjenester ---------- */
  const about = document.getElementById('about-text');
  about.innerHTML = (data.about?.paragraphs || [])
    .map(p => `<p>${p}</p>`)
    .join('');

  const servicesList = document.getElementById('services-list');
  servicesList.innerHTML = (data.services || [])
    .map(s => `<li>${s}</li>`)
    .join('');

  const ctaLink = document.getElementById('cta-link');
  if (ctaLink && data.cta?.href) {
    ctaLink.href = data.cta.href;
  }

  /* ---------- Instagram ---------- */
  const instaWrap = document.getElementById('instagram-embed');
  if (instaWrap) {
    if (data.instagram?.embedHtml) {
      instaWrap.innerHTML = data.instagram.embedHtml;
      const s = document.createElement('script');
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(s);
    } else if (data.instagram?.postUrl) {
      instaWrap.innerHTML = `
        <iframe
          src="${data.instagram.postUrl}embed"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen="true"
          scrolling="no"
          style="width:100%; min-height:560px;">
        </iframe>`;
    }
    const instaFallback = document.getElementById('instagram-fallback');
    if (instaFallback) {
      instaFallback.href = data.instagram?.profileUrl || '#';
    }
  }

  /* ---------- HERO (kun om seksjonen finnes) ---------- */
  const heroMount = document.getElementById('hero-images');
  if (heroMount) {
    const heroImages = (data.hero?.images && data.hero.images.length)
      ? data.hero.images
      : (data.projects || []).slice(0, 5);

    heroMount.innerHTML = heroImages.map((it, i) => `
      <div class="hero-slide"
           role="img"
           aria-label="${it.alt || ''}"
           style="background-image:url('${it.src}')"
           ${i === 0 ? 'aria-current="true"' : ''}>
      </div>
    `).join('');

    let hIdx = 0;
    const slides = Array.from(heroMount.querySelectorAll('.hero-slide'));
    const setHero = (i) => {
      hIdx = (i + slides.length) % slides.length;
      slides.forEach((s, j) =>
        s.setAttribute('aria-current', j === hIdx ? 'true' : 'false')
      );
    };
    const jump = (dir) => setHero(hIdx + dir);
    const nextBtn = document.querySelector('.hero-btn.next');
    const prevBtn = document.querySelector('.hero-btn.prev');
    nextBtn.addEventListener('click', () => jump(1));
    prevBtn.addEventListener('click', () => jump(-1));
    let heroTimer = setInterval(() => jump(1), 5000);
    ['click','keydown','pointerdown','touchstart'].forEach(ev => {
      heroMount.addEventListener(ev, () => {
        clearInterval(heroTimer);
        heroTimer = setInterval(() => jump(1), 7000);
      }, { passive: true });
    });
  }

  /* ---------- Prosjektrist ---------- */
  const grid = document.getElementById('projects-grid');
  const images = data.projects || [];
  grid.innerHTML = images.map((item, idx) => `
    <article class="project ${idx % 5 === 0 ? 'tall' : ''}">
      <a href="${item.src}"
         class="project-link"
         data-idx="${idx}"
         aria-label="${item.alt || 'Prosjektbilde'}">
        <img src="${item.src}"
             alt="${item.alt || ''}"
             loading="lazy">
        ${item.caption ? `<div class="cap">${item.caption}</div>` : ''}
      </a>
    </article>
  `).join('');

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const lbClose = document.querySelector('.lightbox-close');

  const openLightbox = (idx) => {
    const it = images[idx];
    if (!it) return;
    lbImg.src = it.src;
    lbImg.alt = it.alt || '';
    lbCap.textContent = it.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  grid.addEventListener('click', (e) => {
    const a = e.target.closest('a.project-link');
    if (!a) return;
    e.preventDefault();
    openLightbox(Number(a.dataset.idx));
  });
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.hidden && (e.key === 'Escape' || e.key === 'Esc')) {
      closeLightbox();
    }
    if (!lightbox.hidden && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const current = images.findIndex(it => it.src === lbImg.src);
      const next = (current + dir + images.length) % images.length;
      openLightbox(next);
    }
  });

  /* ---------- Sertifikat + footer ---------- */
  document.getElementById('cert-text').textContent = data.cert?.text || '';
  document.getElementById('cert-link').href = data.cert?.link || '#';
  const certLogo = document.getElementById('cert-logo');
  if (data.cert?.logo) {
    certLogo.src = data.cert.logo;
  }

  document.getElementById('linkedin-link').href = data.social?.linkedin || '#';
  document.getElementById('instagram-link').href = data.social?.instagram || '#';
})();
