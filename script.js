(async function () {
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  // Tekst + tjenester
  const about = document.getElementById('about-text');
  about.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');

  const servicesList = document.getElementById('services-list');
  servicesList.innerHTML = data.services.map(s => `<li>${s}</li>`).join('');

  const ctaLink = document.getElementById('cta-link');
  ctaLink.href = data.cta.href;

  // Instagram
  const instaWrap = document.getElementById('instagram-embed');
  if (data.instagram.embedHtml) {
    instaWrap.innerHTML = data.instagram.embedHtml;
    // last offisielt script kun hvis vi faktisk har embed
    const s = document.createElement('script');
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  } else if (data.instagram.postUrl) {
    instaWrap.innerHTML = `<iframe
      src="${data.instagram.postUrl}embed"
      frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no"
      style="width:100%; min-height: 560px;"></iframe>`;
  }
  const instaFallback = document.getElementById('instagram-fallback');
  if (instaFallback) instaFallback.href = data.instagram.profileUrl || '#';

  // Karusell
  const track = document.getElementById('car-track');
  const dots = document.getElementById('car-dots');
  const images = data.projects;

  track.innerHTML = images.map(item => `
    <figure class="car-item">
      <img src="${item.src}" alt="${item.alt || ''}" loading="lazy">
      ${item.caption ? `<figcaption class="car-caption">${item.caption}</figcaption>` : ''}
    </figure>
  `).join('');

  dots.innerHTML = images.map((_, i) =>
    `<button class="car-dot" role="tab" aria-label="Bilde ${i+1}" data-idx="${i}"></button>`
  ).join('');

  let idx = 0;
  const setIdx = (i) => {
    idx = (i + images.length) % images.length;
    track.style.transform = `translateX(${-idx * 100}%)`;
    dots.querySelectorAll('.car-dot').forEach((d, j) => d.setAttribute('aria-current', j===idx ? 'true' : 'false'));
  };
  setIdx(0);

  document.querySelectorAll('.car-btn').forEach(btn => {
    btn.addEventListener('click', () => setIdx(idx + Number(btn.dataset.dir)));
  });

  dots.addEventListener('click', (e) => {
    const b = e.target.closest('.car-dot');
    if (b) setIdx(Number(b.dataset.idx));
  });

  // Piltaster
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') setIdx(idx - 1);
    if (e.key === 'ArrowRight') setIdx(idx + 1);
  });

  // Sertifikat
  document.getElementById('cert-text').textContent = data.cert.text;
  document.getElementById('cert-link').href = data.cert.link;
  const certLogo = document.getElementById('cert-logo');
  if (data.cert.logo) certLogo.src = data.cert.logo;

  // Footer lenker
  document.getElementById('linkedin-link').href = data.social.linkedin || '#';
  document.getElementById('instagram-link').href = data.social.instagram || '#';
})();
