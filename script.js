// Carousel functionality
let currentSlide = 0;
const track = document.getElementById('car-track');
const dots = document.querySelectorAll('.car-dot');
const totalSlides = document.querySelectorAll('.car-item').length;

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  dots.forEach((dot, index) => {
    dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
  });
}

// Navigation buttons
document.querySelectorAll('.car-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const direction = parseInt(btn.dataset.dir);
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
  });
});

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    updateCarousel();
  });
});

// Auto-play carousel with longer intervals
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}, 8000);

// Smooth scroll for navigation links
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
