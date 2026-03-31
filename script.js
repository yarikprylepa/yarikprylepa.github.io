// Theme Switch Orchestration
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const currentTheme = savedTheme || systemTheme;

// INITIAL THEME LOAD
htmlElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') toggleSwitch.checked = true;

toggleSwitch.addEventListener('change', (e) => {
  const theme = e.target.checked ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, false);

// MOBILE MENU LOGIC
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

mobileLinks.forEach(link => {
  link.addEventListener('click', toggleMobileMenu);
});

// INTERSECTION OBSERVER FOR PERFORMANCE-FIRST FADE-INS
const revealOptions = {
  threshold: 0.1, // Trigger earlier (10% in view)
  rootMargin: "0px" 
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

// SCROLL-SPY: HIGHLIGHT ACTIVE NAV LINKS
const navItems = document.querySelectorAll('nav a, .mobile-nav a');
const spyOptions = {
  threshold: 0.4, 
  rootMargin: "-20% 0px -20% 0px" 
};

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) {
          item.classList.add('active');
        }
      });
    }
  });
}, spyOptions);

// TARGET REVEAL AND SPY ELEMENTS
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => revealObserver.observe(el));

// Observe all sections for Scroll-Spy
document.querySelectorAll('section').forEach(section => {
  spyObserver.observe(section);
});

// STAGGERED REVEALS FOR INDEXES AND SPREADS
// Looking for containers of multiple items to apply dynamic delays
const staggerContainers = document.querySelectorAll('.index-list, .project-spreads, .skill-list');
staggerContainers.forEach(container => {
  const children = container.children;
  Array.from(children).forEach((child, index) => {
    // If child doesn't have reveal, add it
    if (!child.classList.contains('reveal')) {
      child.classList.add('reveal');
      revealObserver.observe(child);
    }
    child.style.transitionDelay = `${index * 80}ms`;
  });
});

// FACE PEEK ON LOAD
const facePeek = document.getElementById('face-peek');
if (facePeek) {
  facePeek.style.display = 'block';
  setTimeout(() => {
    facePeek.classList.add('visible');
  }, 800);
}

// STICKY HEADER & NAV STATE
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// Smooth Desktop Scrolling
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
