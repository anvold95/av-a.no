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
  
  // --- Dragon Cursor & Glitter Trail ---
  const cursor = document.querySelector('.dragon-cursor');
  let mouseX = 0, mouseY = 0;
  let trailPoints = [];
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Add point to trail
    trailPoints.push({
      x: mouseX,
      y: mouseY,
      time: Date.now()
    });
    
    // Keep only recent points
    trailPoints = trailPoints.filter(point => Date.now() - point.time < 500);
    
    // Create dragon glitter trail
    if (Math.random() > 0.8) {
      createDragonGlitter(mouseX, mouseY);
    }
  });
  
  // Hover effects for cursor
  document.querySelectorAll('a, button, .project').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  
  function createDragonGlitter(x, y) {
    const colors = ['#ff6b9d', '#a8e6cf', '#ffd93d', '#6bcf7f', '#ff8a65', '#b19cd9'];
    
    // Create multiple glitter particles
    for (let i = 0; i < 3; i++) {
      const glitter = document.createElement('div');
      glitter.className = 'dragon-glitter';
      
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      
      glitter.style.left = (x + offsetX) + 'px';
      glitter.style.top = (y + offsetY) + 'px';
      glitter.style.background = colors[Math.floor(Math.random() * colors.length)];
      glitter.style.animationDelay = (i * 0.1) + 's';
      
      // Add some sparkle shapes
      if (Math.random() > 0.7) {
        glitter.style.borderRadius = '0';
        glitter.style.transform = 'rotate(45deg)';
      }
      
      document.body.appendChild(glitter);
      
      setTimeout(() => {
        if (glitter.parentNode) {
          glitter.parentNode.removeChild(glitter);
        }
      }, 1500);
    }
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
  
  // --- Header Scroll Effect ---
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
  });
});
