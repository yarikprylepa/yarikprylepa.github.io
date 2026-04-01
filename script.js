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

// Scroll-spy with more robust detection
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('nav a, .mobile-nav a');

const options = {
  threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  rootMargin: "-80px 0px -20% 0px"
};

const spyObserver = new IntersectionObserver((entries) => {
  // Find which section is most visible or 'highest' in the viewable area
  let mostVisibleSection = null;
  let maxRatio = 0;

  // We check which section is currently the most prominent
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    // A section is 'active' if its top is near the top of the viewport (taking navbar height into account)
    if (rect.top <= 100 && rect.bottom >= 100) {
      mostVisibleSection = section;
    }
  });

  if (mostVisibleSection) {
    const id = mostVisibleSection.getAttribute('id');
    updateActiveNavItem(id);
  }
}, options);

function updateActiveNavItem(id) {
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${id}`) {
      item.classList.add('active');
    }
  });
}

// Observe sections
sections.forEach(section => spyObserver.observe(section));

// Manual scroll event as fallback for quick scrolling
window.addEventListener('scroll', () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 120) {
      current = section.getAttribute("id");
    }
  });
  if (current) updateActiveNavItem(current);
}, { passive: true });

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

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => revealObserver.observe(el));

// Smooth Scrolling
const navLinks = document.querySelectorAll('nav a, header .logo, footer a');
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      if (href.startsWith('#')) {
        const id = href.substring(1);
        updateActiveNavItem(id);
      }
      window.scrollTo({
        top: href === '#home' ? 0 : targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});
