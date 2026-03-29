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
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
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
  threshold: 0.5, // Highlight when section is 50% in view
  rootMargin: "-70px 0px 0px 0px" // Account for fixed header height
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

// STAGGERED REVEALS FOR CARDS & LISTS
const staggerContainers = document.querySelectorAll('.experience-grid, .project-grid, .skills-grid');
staggerContainers.forEach(container => {
  const children = container.children;
  Array.from(children).forEach((child, index) => {
    child.style.transitionDelay = `${index * 100}ms`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});

// FACE ANIMATION LOGIC (OPTIMIZED)
const faceContainer = document.getElementById('face-interactive');
const faceImg = document.getElementById('anim-face');
const frames = ['images/face1.png', 'images/face2.png', 'images/face3.png'];
let animInterval = null;
let currentFrame = 0;

function startTalking() {
  if (animInterval) return;
  animInterval = setInterval(() => {
    currentFrame = (currentFrame % 2) + 1; // Flips between frame 1 and 2
    faceImg.src = frames[currentFrame];
  }, 150);
}

function stopTalking() {
  clearInterval(animInterval);
  animInterval = null;
  faceImg.src = frames[0];
  currentFrame = 0;
}

faceContainer.addEventListener('mouseenter', startTalking);
faceContainer.addEventListener('mouseleave', stopTalking);
faceContainer.addEventListener('touchstart', (e) => {
  e.preventDefault();
  faceContainer.classList.toggle('active');
  if (faceContainer.classList.contains('active')) startTalking();
  else stopTalking();
});

// STICKY HEADER & NAV STATE
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  // Use class toggle for CSS performance
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// Smooth Desktop Scrolling
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetID = this.getAttribute('href');
    const targetElement = document.querySelector(targetID);
    if (targetElement) {
      window.scrollTo({ 
        top: targetID === '#home' ? 0 : targetElement.offsetTop - 70, 
        behavior: 'smooth' 
      });
    }
  });
});
