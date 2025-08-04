// script.js
document.addEventListener('DOMContentLoaded', async () => {
  // Hent innhold fra JSON
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  // ----- Tjenester -----
  const servicesList = document.getElementById('services-list');
  servicesList.innerHTML = (data.services || [])
    .map(s => `<li>${s}</li>`).join('');

  // ----- Instagram embed -----
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

  // ----- Hero Carousel -----
  const heroContainer = document.getElementById('hero-images');
  const heroCounter = document.getElementById('hero-counter');
  const heroData = data.hero?.images || [];
  if (heroContainer && heroData.length) {
    heroContainer.innerHTML = heroData.map((img, i) =>
      `<img src="${img.src}" alt="${img.alt||''}"
            class="hero-slide${i===0?' current':''}" data-index="${i}">`
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

    // Naviger ved å klikke på selve bildet
    slides.forEach(s =>
      s.addEventListener('click', () =>
        show((current + 1) % slides.length)
      )
    );

    // Auto‐advance hver 5s
    let timer = setInterval(() =>
      show((current + 1) % slides.length), 5000
    );
    // Pause ved hover
    [ ...slides,
      document.querySelector('.hero-btn.prev'),
      document.querySelector('.hero-btn.next')
    ].forEach(el => {
      el.addEventListener('mouseenter', () => clearInterval(timer));
      el.addEventListener('mouseleave', () =>
        timer = setInterval(() =>
          show((current + 1) % slides.length), 5000
        )
      );
    });
  }

  // ----- Projects Grid -----
  const grid = document.getElementById('projects-grid');
  const projects = data.projects || [];
  grid.innerHTML = projects.map(p =>
    `<article class="project">
       <img src="${p.src}" alt="${p.alt||''}">
       ${p.caption ? `<div class="cap">${p.caption}</div>` : ''}
     </article>`
  ).join('');
});
