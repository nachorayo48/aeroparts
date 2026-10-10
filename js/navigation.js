/**
 * AEROPARTS - NAVIGATION MODULE
 * Sticky header transitions, smooth scroll with header offset, and scroll-spy.
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link');
  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const mainNav = document.querySelector('.main-nav');
  const sections = document.querySelectorAll('section[id]');

  if (!header) return;

  // 1. Sticky Header Scroll Effect
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 2. Smooth Scroll with Header Offset
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          // Close mobile drawer if open
          if (mainNav && mainNav.classList.contains('is-open')) {
            toggleMobileMenu(false);
          }

          const headerHeight = header.offsetHeight || 84;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 3. Scroll Spy (Active section link highlighting)
  const observerOptions = {
    root: null,
    rootMargin: `-${header.offsetHeight || 84}px 0px -50% 0px`,
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 4. Mobile Menu Drawer
  function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !mainNav.classList.contains('is-open');
    if (shouldOpen) {
      mainNav.classList.add('is-open');
      menuToggleBtn.classList.add('is-active');
      menuToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mainNav.classList.remove('is-open');
      menuToggleBtn.classList.remove('is-active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn && mainNav) {
    menuToggleBtn.addEventListener('click', () => toggleMobileMenu());

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });
  }
}
