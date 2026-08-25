// Highlights the current section's nav link as the visitor scrolls.
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let currentId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${currentId}`
        ? 'var(--color-gold-dark)'
        : '';
    });
  };

  document.addEventListener('scroll', highlightNav);
  highlightNav();
});
