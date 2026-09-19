// ---- portfolio frame data ----
  const frames = [
    {n:'005', title:'Wedding Portrait 1', cat:'weddings', catLabel:'Weddings', image:'images/Weddings 1.jpg'},
    {n:'006', title:'Wedding Portrait 2', cat:'weddings', catLabel:'Weddings', image:'images/Weddings 2.jpeg'},
    {n:'007', title:'Wedding Portrait 3', cat:'weddings', catLabel:'Weddings', image:'images/Weddings 3.jpg'},
    {n:'008', title:'Wedding Portrait 4', cat:'weddings', catLabel:'Weddings', image:'images/Weddings 4.jpg'},
    {n:'009', title:'Introduction Portrait 1', cat:'introductions', catLabel:'Introductions', image:'images/Introductions 1.jpg'},
    {n:'010', title:'Introduction Portrait 2', cat:'introductions', catLabel:'Introductions', image:'images/Introductions 2.jpg'},
    {n:'011', title:'Introduction Portrait 3', cat:'introductions', catLabel:'Introductions', image:'images/Introductions 3.jpeg'},
    {n:'012', title:'Introduction Portrait 4', cat:'introductions', catLabel:'Introductions', image:'images/Introductions 4.jpg'},
    {n:'013', title:'Cultural Moment 1', cat:'culturals', catLabel:'Culturals', image:'images/Culturals 1.jpg'},
    {n:'014', title:'Cultural Moment 2', cat:'culturals', catLabel:'Culturals', image:'images/Culturals 2.jpg'},
    {n:'015', title:'Cultural Moment 3', cat:'culturals', catLabel:'Culturals', image:'images/Culturals 3.jpg'},
    {n:'016', title:'Cultural Moment 4', cat:'culturals', catLabel:'Culturals', image:'images/Culturals 4.jpg'},
    {n:'017', title:'Studio Portrait 1', cat:'studios', catLabel:'Studios', image:'images/Studios 1.jpg'},
    {n:'018', title:'Studio Portrait 2', cat:'studios', catLabel:'Studios', image:'images/Studios 2.jpg'},
    {n:'019', title:'Studio Portrait 3', cat:'studios', catLabel:'Studios', image:'images/Studios 3.jpg'},
    {n:'020', title:'Studio Portrait 4', cat:'studios', catLabel:'Studios', image:'images/Studios 4.jpeg'},
    {n:'021', title:'Graduation Portrait 1', cat:'graduations', catLabel:'Graduations', image:'images/Graduations 1.JPG'},
    {n:'022', title:'Graduation Portrait 2', cat:'graduations', catLabel:'Graduations', image:'images/Graduations 2.JPEG'},
    {n:'023', title:'Graduation Portrait 3', cat:'graduations', catLabel:'Graduations', image:'images/Graduations 3.JPEG'},
    {n:'024', title:'Graduation Portrait 4', cat:'graduations', catLabel:'Graduations', image:'images/Graduations 4.JPEG'},
  ];

 const grid = document.getElementById('grid');

// Escape helper to prevent broken HTML if titles have special characters
const esc = (str) => String(str).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

grid.innerHTML = frames.map((f, i) => `
  <div class="frame" data-cat="${esc(f.cat)}" data-index="${i}">
    <span class="frame-num mono">No. ${esc(f.n)}</span>
    <img 
      src="${esc(f.image)}" 
      alt="${esc(f.title)}" 
      loading="lazy"
      onerror="this.onerror=null; this.src='images/IMG 06.JPG';"
    >
    <span class="frame-mark" aria-hidden="true"></span>
    <div class="frame-overlay">
      <p class="frame-title">${esc(f.title)}</p>
      <p class="frame-cat">${esc(f.catLabel)}</p>
    </div>
  </div>
`).join('');

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const zoomInBtn = document.getElementById('lightboxZoomIn');
  const zoomOutBtn = document.getElementById('lightboxZoomOut');
  const resetBtn = document.getElementById('lightboxReset');
  let currentLightboxIndex = 0;
  let currentLightboxGroup = 'gallery';
  let currentLightboxItem = null;
  let zoomLevel = 1;
  let zoomOrigin = 'center center';

  function applyZoom() {
    lightboxImage.style.transform = `scale(${zoomLevel})`;
    lightboxImage.classList.toggle('zoomed', zoomLevel > 1);
    lightboxImage.style.transformOrigin = zoomOrigin;
  }

  function resetZoom() {
    zoomLevel = 1;
    zoomOrigin = 'center center';
    applyZoom();
  }

  function updateZoomOrigin(event) {
    const rect = lightboxImage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    zoomOrigin = `${x}% ${y}%`;
    applyZoom();
  }

  function openLightbox(item) {
    const type = item.dataset.type || 'gallery';
    currentLightboxGroup = type;
    currentLightboxItem = item;

    const img = item.querySelector('img');
    const title = type === 'journal'
      ? (item.dataset.title || '')
      : (item.querySelector('.frame-title')?.textContent || '');
    const category = type === 'journal'
      ? (item.dataset.category || '')
      : (item.querySelector('.frame-cat')?.textContent || '');

    currentLightboxIndex = Number(item.dataset.index || 0);
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    resetZoom();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    resetZoom();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showLightboxByDelta(delta) {
    const items = currentLightboxGroup === 'journal'
      ? Array.from(document.querySelectorAll('.journal-item'))
      : Array.from(document.querySelectorAll('.frame:not(.hidden-frame)'));

    if (!items.length) return;

    const currentVisibleIndex = items.findIndex(item => item === currentLightboxItem);
    const nextIndex = (currentVisibleIndex + delta + items.length) % items.length;
    const nextItem = items[nextIndex];
    if (nextItem) openLightbox(nextItem);
  }

  document.querySelectorAll('.frame').forEach(frame => {
    frame.addEventListener('click', () => openLightbox(frame));
  });

  document.querySelectorAll('.journal-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(item);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  lightboxImage.addEventListener('mousemove', updateZoomOrigin);

  zoomInBtn.addEventListener('click', () => {
    zoomLevel = Math.min(zoomLevel + 0.25, 3);
    applyZoom();
  });

  zoomOutBtn.addEventListener('click', () => {
    zoomLevel = Math.max(zoomLevel - 0.25, 1);
    applyZoom();
  });

  resetBtn.addEventListener('click', resetZoom);

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    resetZoom();
    showLightboxByDelta(-1);
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    resetZoom();
    showLightboxByDelta(1);
  });
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showLightboxByDelta(1);
    if (event.key === 'ArrowLeft') showLightboxByDelta(-1);
  });

  // filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.frame').forEach(frame => {
        const show = f === 'all' || frame.dataset.cat === f;
        frame.classList.toggle('hidden-frame', !show);
      });
    });
  });

  // nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // nav scroll state
  const siteNav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // testimonial carousel
  const slides = document.querySelectorAll('.testi-slide');
  const dotsWrap = document.getElementById('testiDots');
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => showSlide(i));
    dotsWrap.appendChild(dot);
  });
  function showSlide(i){
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
  }
  document.getElementById('testiPrev').addEventListener('click', () => showSlide(current - 1));
  document.getElementById('testiNext').addEventListener('click', () => showSlide(current + 1));

  // newsletter CTA
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Opened ✓';
      setTimeout(() => { btn.textContent = original; }, 2200);
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
