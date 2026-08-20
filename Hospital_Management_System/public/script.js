const statusEl = document.getElementById('system-status');

fetch('/api/health')
  .then((response) => response.json())
  .then((data) => {
    console.log('API health:', data);
    if (statusEl) {
      statusEl.textContent = `System Operational · Database: ${data.database || 'gurus_hospital'}`;
    }
  })
  .catch((error) => {
    console.warn('Health check failed:', error.message);
    if (statusEl) {
      statusEl.textContent = 'System Operational';
    }
  });

// Handle logged-in user state on home page
try {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    const user = JSON.parse(userJson);
    const targetDashboard = user.role === 'doctor' ? 'doctor-dashboard.html' : 'patient-dashboard.html';
    
    // Update navbar portal links
    document.querySelectorAll('a[href="login.html"]').forEach((link) => {
      if (link.classList.contains('nav__cta') || link.classList.contains('button--primary')) {
        link.href = targetDashboard;
        link.textContent = user.role === 'doctor' ? 'Doctor Dashboard →' : 'Patient Dashboard →';
      }
    });
  }
} catch (e) {
  console.warn('Session parse error:', e);
}

// Navbar Mobile Toggle Logic
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    navMenu.classList.toggle('is-open');
  });

  // Close mobile menu when clicking nav links
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      navMenu.classList.remove('is-open');
    });
  });
}

// Active Nav Link Scroll Spy
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 140;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
});