const header = document.getElementById('header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-menu');
const navLinks = document.querySelectorAll('.scroll-link');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialSlider = document.querySelector('.testimonial-slider');
const prevButton = document.getElementById('prevTestimonial');
const nextButton = document.getElementById('nextTestimonial');
const dots = document.querySelectorAll('.dot');
const body = document.body;
let currentSlide = 0;
let slideInterval = null;
const slideDelay = 7000;

function handleScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function toggleMenu() {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  primaryNav.classList.toggle('open');
  primaryNav.setAttribute('aria-hidden', String(isOpen));
  body.classList.toggle('menu-open', !isOpen);
}

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  primaryNav.classList.remove('open');
  primaryNav.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
}

function updateSlider(index) {
  const total = testimonialCards.length;
  currentSlide = (index + total) % total;
  testimonialCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === currentSlide;
    card.classList.toggle('active', isActive);
    card.setAttribute('aria-hidden', String(!isActive));
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlide);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = window.setInterval(nextSlide, slideDelay);
}

function stopAutoSlide() {
  if (slideInterval) {
    window.clearInterval(slideInterval);
    slideInterval = null;
  }
}

function nextSlide() {
  updateSlider(currentSlide + 1);
}

function prevSlide() {
  updateSlider(currentSlide - 1);
}

function scrollToSection(event) {
  const targetId = event.currentTarget.getAttribute('href');
  if (!targetId.startsWith('#')) return;
  event.preventDefault();
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  closeMenu();
}

function initScrollAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
  });
}

navToggle.addEventListener('click', toggleMenu);
navLinks.forEach((link) => link.addEventListener('click', scrollToSection));
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);
dots.forEach((dot) => dot.addEventListener('click', () => updateSlider(Number(dot.dataset.slide))));
window.addEventListener('scroll', handleScroll);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

if (testimonialSlider) {
  testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
  testimonialSlider.addEventListener('mouseleave', startAutoSlide);
  testimonialSlider.addEventListener('focusin', stopAutoSlide);
  testimonialSlider.addEventListener('focusout', startAutoSlide);
}

window.addEventListener('load', () => {
  handleScroll();
  initScrollAnimation();
  updateSlider(0);
  startAutoSlide();
});
