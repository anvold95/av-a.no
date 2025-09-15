document.addEventListener('DOMContentLoaded', async () => {
  // Load content from JSON if available
  try {
    const data = await (await fetch('content.json')).json();
    
    // --- Hero-karusell ---
    const heroImgs = data.hero?.images || [];
    const heroContainer = document.getElementById('hero-images');
    const heroCounter = document.getElementById('hero-counter');
    
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
      
      // Click to advance
      slides.forEach(s => s.addEventListener('click', () =>
        show((current+1) % slides.length)
      ));
      
      // Auto-advance
      let timer = setInterval(() =>
        show((current+1) % slides.length), 5000
      );
      
      slides.forEach(s => {
        s.addEventListener('mouseenter', () => clearInterval(timer));
        s.addEventListener('mouseleave', () =>
          timer = setInterval(() =>
            show((current+1) % slides.length), 5000
          )
        );
      });
    }
    
    // --- Projects Grid ---
    const grid = document.getElementById('projects-grid');
    if (grid && data.projects) {
      grid.innerHTML = data.projects.map(p =>
        `<article class="project">
           ${p.date ? `<div class="project-info">${p.date}</div>` : ''}
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
    if (data.social) {
      document.getElementById('linkedin-link').href = data.social.linkedin || '#';
      document.getElementById('instagram-link').href = data.social.instagram || '#';
    }
  } catch (error) {
    console.log('No content.json found, using demo content');
    initializeDemoCarousel();
  }
  
  // --- Dragon Cursor & Trail ---
  const cursor = document.querySelector('.dragon-cursor');
  let mouseX = 0, mouseY = 0;
  let trailHistory = [];
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Add to trail history
    trailHistory.push({
      x: mouseX,
      y: mouseY,
      time: Date.now()
    });
    
    // Keep only recent points
    trailHistory = trailHistory.filter(point => Date.now() - point.time < 300);
    
    // Create trail dot occasionally
    if (trailHistory.length > 3 && Math.random() > 0.7) {
      createTrailDot(mouseX, mouseY);
    }
  });
  
  // Hover effects for cursor
  document.querySelectorAll('a, button, .project').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  
  function createTrailDot(x, y) {
    const trail = document.createElement('div');
    trail.className = 'dragon-trail';
    
    const offsetX = (Math.random() - 0.5) * 8;
    const offsetY = (Math.random() - 0.5) * 8;
    
    trail.style.left = (x + offsetX) + 'px';
    trail.style.top = (y + offsetY) + 'px';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 800);
  }
  
  // --- Demo Carousel (fallback) ---
  function initializeDemoCarousel() {
    const heroImgs = document.querySelectorAll('.hero-slide');
    const heroCounter = document.getElementById('hero-counter');
    let currentSlide = 0;
    
    if (heroImgs.length === 0) return;
    
    function showSlide(index) {
      heroImgs.forEach(img => img.classList.remove('current'));
      heroImgs[index].classList.add('current');
      heroCounter.textContent = `${index + 1} / ${heroImgs.length}`;
      currentSlide = index;
    }
    
    // Auto-advance slides
    setInterval(() => {
      showSlide((currentSlide + 1) % heroImgs.length);
    }, 5000);
    
    // Click to advance
    heroImgs.forEach(img => {
      img.addEventListener('click', () => {
        showSlide((currentSlide + 1) % heroImgs.length);
      });
    });
  }
  
  // --- Smooth Scroll Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // --- Header & Footer Auto-hide ---
  let lastScrollY = window.scrollY;
  let idleTimer = null;
  let isIdle = false;
  
  function hideElements() {
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.site-footer');
    header.classList.add('hidden');
    footer.classList.add('hidden');
    isIdle = true;
  }
  
  function showElements() {
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.site-footer');
    header.classList.remove('hidden');
    footer.classList.remove('hidden');
    isIdle = false;
  }
  
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (isIdle) showElements();
    idleTimer = setTimeout(hideElements, 3000); // Hide after 3 seconds of inactivity
  }
  
  // Track mouse movement and scrolling for idle detection
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    
    // Show/hide on scroll direction (immediate)
    if (window.scrollY > lastScrollY && window.scrollY > 100 && !isIdle) {
      header.style.transform = 'translateY(-100%)';
    } else if (!isIdle) {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = window.scrollY;
    resetIdleTimer();
  });
  
  // Initialize idle timer
  resetIdleTimer();
});

// Hastigheds-baseret blur-effekt
let lastScrollY = window.scrollY;
let lastTime = performance.now();

function blurOnSpeed() {
  const now = performance.now();
  const deltaY = window.scrollY - lastScrollY;
  const deltaT = now - lastTime;
  // pixler pr ms → pixler pr frame * faktor
  const speed = Math.abs(deltaY) / deltaT; // px per ms
  const blur = Math.min(speed * 100 * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--blur-factor')), 10);
  
  document.querySelector('.site-header').style.filter = `blur(${blur}px)`;
  document.querySelector('.site-footer').style.filter = `blur(${blur}px)`;

  lastScrollY = window.scrollY;
  lastTime = now;
  requestAnimationFrame(blurOnSpeed);
}

// Start loop
requestAnimationFrame(blurOnSpeed);

// --- Scroll-to-carousel hijack ---
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero-slide');
  const heroCounter = document.getElementById('hero-counter');
  if (!slides.length) return;

  let currentIndex = 0;
  let lockScroll = false;

  function showSlide(i) {
    slides.forEach(s => s.classList.remove('current'));
    slides[i].classList.add('current');
    currentIndex = i;
    if (heroCounter) heroCounter.textContent = `${i+1} / ${slides.length}`;
  }

  window.addEventListener('wheel', (e) => {
    const rect = hero.getBoundingClientRect();
    const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;

    if (inView && !lockScroll) {
      // hindre at vanlig scroll skyver siden
      e.preventDefault();
      lockScroll = true;

      if (e.deltaY > 0 && currentIndex < slides.length - 1) {
        showSlide(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        showSlide(currentIndex - 1);
      } else {
        // Slipp scroll når vi er på første eller siste slide
        lockScroll = false;
        return;
      }

      // delay så man ikke hopper flere slides på én gang
      setTimeout(() => {
        lockScroll = false;
      }, 600);
    }
  }, { passive: false });
})();

(function() {
  const heroSection = document.querySelector('.hero-inner.container');
  const heroContainer = document.querySelector('#hero-images');
  const slides = heroContainer ? heroContainer.querySelectorAll('.hero-slide') : [];
  if (!heroSection || slides.length === 0) return;

  let currentIndex = 0;
  let locked = false;

  function updateSlide(index) {
    heroContainer.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    const counter = document.getElementById('hero-counter');
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
  }

  function handleScroll(e) {
    const rect = heroSection.getBoundingClientRect();
    const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    if (!inView) return; // bare aktivt når hero er sentrert

    e.preventDefault();
    if (locked) return;
    locked = true;

    if (e.deltaY > 0 && currentIndex < slides.length - 1) {
      updateSlide(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      updateSlide(currentIndex - 1);
    }

    setTimeout(() => { locked = false; }, 700); // liten pause for smoothness
  }

  // start på første slide
  updateSlide(0);

  window.addEventListener('wheel', handleScroll, { passive: false });
})();

