/* ============================================
   ST. BENEDICT JUNIOR SECONDARY SCHOOL — MAIN JS
   Handles: Mobile menu, Sticky header,
   WhatsApp form, Gallery filter + lightbox,
   Testimonial slider, Scroll animations
   ============================================ */

(function () {
  'use strict';

  /* --- CONFIG: Edit school WhatsApp number here --- */
  const WHATSAPP_NUMBER = '254746686997';

  /* ----- STICKY HEADER ----- */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----- MOBILE MENU TOGGLE ----- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ----- SCROLL REVEAL ANIMATIONS ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----- TESTIMONIAL SLIDER ----- */
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-card');
    const dots = slider.querySelectorAll('.testimonial-dots button');
    let currentSlide = 0;
    let slideTimer;

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function startAutoPlay() {
      slideTimer = setInterval(nextSlide, 6000);
    }

    function resetAutoPlay() {
      clearInterval(slideTimer);
      startAutoPlay();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoPlay();
      });
    });

    startAutoPlay();
  }

  /* ----- GALLERY FILTER ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ----- GALLERY LIGHTBOX ----- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentLightboxIndex = 0;
  let visibleGalleryItems = [];

  function getVisibleItems() {
    return Array.prototype.filter.call(galleryItems, function (item) {
      return !item.classList.contains('hide');
    });
  }

  function openLightbox(index) {
    visibleGalleryItems = getVisibleItems();
    currentLightboxIndex = index;
    const img = visibleGalleryItems[currentLightboxIndex].querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  function navLightbox(dir) {
    visibleGalleryItems = getVisibleItems();
    currentLightboxIndex =
      (currentLightboxIndex + dir + visibleGalleryItems.length) %
      visibleGalleryItems.length;
    const img = visibleGalleryItems[currentLightboxIndex].querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      const visible = getVisibleItems();
      openLightbox(visible.indexOf(item));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { navLightbox(1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  /* ----- ADMISSION FORM → WHATSAPP ----- */
  const admissionForm = document.getElementById('admission-form');
  const formSuccess = document.getElementById('form-success');

  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(admissionForm);
      const studentName = (data.get('studentName') || '').toString().trim();
      const dob = (data.get('dob') || '').toString().trim();
      const gender = (data.get('gender') || '').toString().trim();
      const classApplying = (data.get('classApplying') || '').toString().trim();
      const prevSchool = (data.get('prevSchool') || '').toString().trim();
      const parentName = (data.get('parentName') || '').toString().trim();
      const parentPhone = (data.get('parentPhone') || '').toString().trim();
      const parentEmail = (data.get('parentEmail') || '').toString().trim();

      // Build WhatsApp message
      let msg =
        '*NEW ADMISSION APPLICATION*\n' +
        'St. Benedict junior secondary school\n' +
        '-------------------------------\n' +
        '*Student Name:* ' + studentName + '\n' +
        '*Date of Birth:* ' + dob + '\n' +
        '*Gender:* ' + gender + '\n' +
        '*Class Applying For:* ' + classApplying + '\n' +
        '*Previous School:* ' + prevSchool + '\n' +
        '-------------------------------\n' +
        '*Parent Name:* ' + parentName + '\n' +
        '*Parent Phone:* ' + parentPhone + '\n' +
        '*Parent Email:* ' + parentEmail;

      const waUrl =
        'https://wa.me/' + WHATSAPP_NUMBER +
        '?text=' + encodeURIComponent(msg);

      // Show success message
      if (formSuccess) {
        formSuccess.classList.add('show');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset form
      admissionForm.reset();

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
    });
  }

  /* ----- CONTACT FORM (also sends to WhatsApp) ----- */
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      let msg =
        '*NEW ENQUIRY*\n' +
        'St. Benedict junior secondary school\n' +
        '-------------------------------\n' +
        '*Name:* ' + name + '\n' +
        '*Phone:* ' + phone + '\n' +
        '*Message:* ' + message;

      const waUrl =
        'https://wa.me/' + WHATSAPP_NUMBER +
        '?text=' + encodeURIComponent(msg);

      if (contactSuccess) {
        contactSuccess.classList.add('show');
      }
      contactForm.reset();
      window.open(waUrl, '_blank');
    });
  }

  /* ----- ACTIVE NAV LINK BASED ON PAGE ----- */
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
