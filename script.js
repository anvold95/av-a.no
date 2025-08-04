document.addEventListener('DOMContentLoaded', async () => {
  const data = await (await fetch('content.json')).json();

  // Services
  const servicesList = document.getElementById('services-list');
  if (servicesList) {
    servicesList.innerHTML = (data.services || [])
      .map(s => `<li>${s}</li>`).join('');
  }

  // Instagram Embed
  const insta = document.getElementById('instagram-embed');
  if (insta && data.instagram) {
    if (data.instagram.embedHtml) {
      insta.innerHTML = data.instagram.embedHtml;
      const s = document.createElement('script');
      s.async = true; s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    } else if (data.instagram.postUrl) {
      let url = data.instagram.postUrl;
      if (!url.endsWith('?embed')) url += url.endsWith('/') ? '?embed' : '/?embed';
      insta.innerHTML = `<iframe src="${url}" frameborder="0" allowfullscreen
        style="width:100%; height:100%;"></iframe>`;
    }
  }

  // Hero Carousel
  const heroImages = data.hero?.images || [];
  const heroContainer = document.getElementById('hero-images');
  const heroCounter   = document.getElementById('hero-counter');
  if (heroContainer && heroImages.length) {
    heroContainer.innerHTML = heroImages.map((img, i) =>
      `<img src="${img.src}" alt="${img.alt||''}"
        class="hero-slide${i===0?' current':''}" data-index="${i}">`
    ).join('');
    heroCounter.textContent = `1 / ${heroImages.length}`;

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
    slides.forEach(s => s.addEventListener('click', () =>
      show((current + 1) % slides.length)
    ));

    let timer = setInterval(() => show((current + 1) % slides.length), 5000);
    [...slides, document.querySelector('.hero-btn.prev'), document.querySelector('.hero-btn.next')]
      .forEach(el => {
        el.addEventListener('mouseenter', () => clearInterval(timer));
        el.addEventListener('mouseleave', () =>
          timer = setInterval(() => show((current + 1) % slides.length), 5000)
        );
      });
  }

  // Projects Grid
  const grid = document.getElementById('projects-grid');
  if (grid && data.projects) {
    grid.innerHTML = data.projects.map(p =>
      `<article class="project">
         <img src="${p.src}" alt="${p.alt||''}">
         ${p.caption ? `<div class="cap">${p.caption}</div>` : ''}
       </article>`
    ).join('');
  }

  // Footer links
  document.getElementById('linkedin-link').href = data.social?.linkedin || '#';
  document.getElementById('instagram-link').href = data.social?.instagram || '#';
});
