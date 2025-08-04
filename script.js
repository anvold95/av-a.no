document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  // --- Tjenester (Studio) ---
  const servicesList = document.getElementById('services-list');
  if (servicesList && data.services) {
    servicesList.innerHTML = data.services
      .map(s => `<li>${s}</li>`).join('');
  }

  // --- Instagram Embed ---
  const instaWrap = document.getElementById('instagram-embed');
  if (instaWrap && data.instagram) {
    if (data.instagram.embedHtml) {
      instaWrap.innerHTML = data.instagram.embedHtml;
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    } else if (data.instagram.postUrl) {
      const url = data.instagram.postUrl.endsWith('/')
        ? data.instagram.postUrl + '?embed'
        : data.instagram.postUrl + '/?embed';
      instaWrap.innerHTML = `
        <iframe
          src="${url}"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen
          scrolling="no"
          style="width:100%; height:100%;"></iframe>`;
    }
  }

  // --- Hero Carousel ---
  const heroContainer = document.getElementById('hero-images');
  const heroCounter   = document.getElementById('hero-counter');
  const heroData      = data.hero?.images || [];
  if (heroContainer && heroData.length) {
    // Inject slides
    heroContainer.innerHTML = heroData.map((img, i) =>
      `<img src="${img.src}"
            alt="${img.alt || ''}"
            class="hero-slide${i===0?' current':''}"
            data-index="${i}">`
    ).join('');
    heroCounter.textContent = `1 / ${heroData.length}`;

    const slides = Array.from(heroContainer.querySelectorAll('.hero-slide'));
    let current = 0;

    function show(idx) {
      slides.forEach(s => s.classList.remove('current'));
      slides[idx].classList.add('current');
      current = idx;
      heroCounter.textContent = `${idx+1} / ${slides.length}`;
    }

    document.querySelector('.hero-btn.prev')
      .addEventListener('click', () =>
        show((current - 1 + slides.length) % slides.length)
      );
    document.querySelector('.hero-btn.next')
      .addEventListener('click', () =>
        show((current + 1) % slides.length)
      );

    slides.forEach(slide =>
      slide.addEventListener('click', () =>
        show((current + 1) % slides.length)
      )
    );

    // Auto-advance 5s
    let timer = setInterval(() =>
      show((current + 1) % slides.length),
      5000
    );
    // Pause on hover
    [...slides,
      document.querySelector('.hero-btn.prev'),
      document.querySelector('.hero-btn.next')
    ].forEach(el => {
      el.addEventListener('mouseenter', () => clearInterval(timer));
      el.addEventListener('mouseleave', () =>
        timer = setInterval(() =>
          show((current + 1) % slides.length),
          5000
        )
      );
    });
  }

  // --- Projects Grid ---
  const grid     = document.getElementById('projects-grid');
  const projects = data.projects || [];
  if (grid) {
    grid.innerHTML = projects.map(p =>
      `<article class="project">
         <img src="${p.src}" alt="${p.alt||''}">
         ${p.caption ? `<div class="cap">${p.caption}</div>` : ''}
       </article>`
    ).join('');
  }

  // --- Footer Social Links ---
  document.getElementById('linkedin-link').href   = data.social?.linkedin   || '#';
  document.getElementById('instagram-link').href = data.social?.instagram || '#';
});
