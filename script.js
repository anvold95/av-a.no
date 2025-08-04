document.addEventListener('DOMContentLoaded', async () => {
  const data = await (await fetch('content.json')).json();

  // Tjenester
  const services = document.getElementById('services-list');
  if (services && data.services) {
    services.innerHTML = data.services.map(s => `<li>${s}</li>`).join('');
  }

  // Hero-karusell
  const heroData = data.hero?.images || [];
  const container = document.getElementById('hero-images');
  const counter   = document.getElementById('hero-counter');
  if (container && heroData.length) {
    container.innerHTML = heroData.map((img,i) =>
      `<img src="${img.src}" alt="${img.alt||''}"
        class="hero-slide${i===0?' current':''}" data-index="${i}">`
    ).join('');
    counter.textContent = `1 / ${heroData.length}`;

    const slides = Array.from(container.querySelectorAll('.hero-slide'));
    let current = 0;
    function show(i) {
      slides.forEach(s => s.classList.remove('current'));
      slides[i].classList.add('current');
      current = i;
      counter.textContent = `${i+1} / ${slides.length}`;
    }

    document.querySelector('.hero-btn.prev')
      .addEventListener('click', () =>
        show((current-1+slides.length)%slides.length)
      );
    document.querySelector('.hero-btn.next')
      .addEventListener('click', () =>
        show((current+1)%slides.length)
      );
    slides.forEach(s =>
      s.addEventListener('click', () =>
        show((current+1)%slides.length)
      )
    );

    let timer = setInterval(() =>
      show((current+1)%slides.length), 5000
    );
    [...slides, ...document.querySelectorAll('.hero-btn')].forEach(el => {
      el.addEventListener('mouseenter', () => clearInterval(timer));
      el.addEventListener('mouseleave', () =>
        timer = setInterval(() => show((current+1)%slides.length), 5000)
      );
    });
  }

  // Prosjekter-grid
  const grid = document.getElementById('projects-grid');
  if (grid && data.projects) {
    grid.innerHTML = data.projects.map(p =>
      `<article class="project">
         <img src="${p.src}" alt="${p.alt||''}">
         ${p.caption?`<div class="cap">${p.caption}</div>`:''}
       </article>`
    ).join('');
  }

  // Sosiale lenker i footer
  document.getElementById('linkedin-link').href   = data.social?.linkedin   || '#';
  document.getElementById('instagram-link').href = data.social?.instagram || '#';
});

