// Force scroll to top on every page load/refresh
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Theme Switch
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const currentTheme = savedTheme || systemTheme;

htmlElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') toggleSwitch.checked = true;

toggleSwitch.addEventListener('change', (e) => {
  const theme = e.target.checked ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, false);

// Mobile Menu
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const header = document.querySelector('header');

function toggleMobileMenu() {
  menuBtn.classList.toggle('open');
  mobileNav.classList.toggle('open');
  header.classList.toggle('menu-open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
}

menuBtn.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));

// Intersection Observer — Reveal
const revealOptions = { threshold: 0.1, rootMargin: "0px" };

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

// Scroll-spy
const navItems = document.querySelectorAll('nav a, .mobile-nav a');
const spyOptions = { threshold: 0.4, rootMargin: "-20% 0px -20% 0px" };

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) item.classList.add('active');
      });
    }
  });
}, spyOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => revealObserver.observe(el));
document.querySelectorAll('section').forEach(section => spyObserver.observe(section));

// Staggered reveals
const staggerContainers = document.querySelectorAll('.index-list, .project-spreads, .skill-list');
staggerContainers.forEach(container => {
  Array.from(container.children).forEach((child, index) => {
    if (!child.classList.contains('reveal')) {
      child.classList.add('reveal');
      revealObserver.observe(child);
    }
    child.style.transitionDelay = `${index * 80}ms`;
  });
});

// Sticky Header
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Smooth Scrolling
const navLinks = document.querySelectorAll('nav a, header .logo, footer a');
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      window.scrollTo({
        top: href === '#home' ? 0 : targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});
