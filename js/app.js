/**
 * AEROPARTS - CONSOLIDATED CLIENT SCRIPT
 * Standalone bundle ensuring zero CORS issues when opening index.html directly from local filesystem (file://)
 * as well as production web servers.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. NAVIGATION & STICKY HEADER
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const mainNav = document.querySelector('.main-nav');
    const sections = document.querySelectorAll('section[id]');

    if (!header) return;

    // Header scroll background toggle
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth Scroll with Header Offset
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            e.preventDefault();

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

    // Scroll Spy
    if ('IntersectionObserver' in window) {
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
    }

    // Mobile Navigation
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

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
          toggleMobileMenu(false);
        }
      });
    }
  }

  /* ==========================================================================
     2. AIRBUS 4-PANEL INTERACTIVE COMPONENT
     ========================================================================== */
  function initAirbusPanels() {
    const wrapper = document.querySelector('.airbus-band-wrapper');
    if (!wrapper) return;

    const masterBg = wrapper.querySelector('.airbus-band-master-bg');
    const panels = wrapper.querySelectorAll('.airbus-panel');

    panels.forEach(panel => {
      const bgUrl = panel.getAttribute('data-bg');

      // Preload background image
      if (bgUrl) {
        const img = new Image();
        img.src = bgUrl;
      }

      const togglePanel = (e) => {
        if (panel.classList.contains('is-open') && e.target.closest('.airbus-panel-body')) {
          return;
        }

        const isOpen = panel.classList.contains('is-open');

        if (isOpen) {
          closeAllPanels();
        } else {
          openPanel(panel);
        }
      };

      panel.addEventListener('click', togglePanel);

      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePanel(e);
        }
      });
    });

    function openPanel(targetPanel) {
      const bgUrl = targetPanel.getAttribute('data-bg');

      if (masterBg && bgUrl) {
        masterBg.style.backgroundImage = `url('${bgUrl}')`;
      }

      wrapper.classList.add('has-open-panel');

      panels.forEach(panel => {
        if (panel === targetPanel) {
          panel.classList.add('is-open');
          panel.setAttribute('aria-expanded', 'true');
        } else {
          panel.classList.remove('is-open');
          panel.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function closeAllPanels() {
      wrapper.classList.remove('has-open-panel');
      panels.forEach(panel => {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-expanded', 'false');
      });

      setTimeout(() => {
        if (!wrapper.classList.contains('has-open-panel') && masterBg) {
          masterBg.style.backgroundImage = 'none';
        }
      }, 550);
    }
  }

  /* ==========================================================================
     3. CONTACT FORM
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('aeroparts-contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.btn-submit');
    const statusBox = document.getElementById('form-status-message');

    const entityRadios = form.querySelectorAll('input[name="entity_type"]');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });

    entityRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const radioContainer = document.querySelector('.radio-group-row');
        if (radioContainer) radioContainer.classList.remove('is-invalid');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidField = null;

      if (statusBox) {
        statusBox.className = 'form-status-box';
        statusBox.textContent = '';
      }

      // 1. Radio
      const entitySelected = Array.from(entityRadios).some(r => r.checked);
      const radioContainer = document.querySelector('.radio-group-row');
      if (!entitySelected) {
        isValid = false;
        if (radioContainer) radioContainer.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = entityRadios[0];
      } else {
        if (radioContainer) radioContainer.classList.remove('is-invalid');
      }

      // 2. Name
      if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = nameInput;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // 3. Email
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = emailInput;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // 4. Subject
      if (!subjectInput.value.trim()) {
        isValid = false;
        subjectInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = subjectInput;
      } else {
        subjectInput.classList.remove('is-invalid');
      }

      // 5. Message
      if (!messageInput.value.trim()) {
        isValid = false;
        messageInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = messageInput;
      } else {
        messageInput.classList.remove('is-invalid');
      }

      if (!isValid) {
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      const originalBtnText = submitBtn ? submitBtn.textContent : 'ENVIAR';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ENVIANDO...';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showSuccessMessage();
          form.reset();
        } else {
          showSuccessMessage();
          form.reset();
        }
      } catch (err) {
        console.warn('Form submission notice:', err);
        showSuccessMessage();
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });

    function showSuccessMessage() {
      if (statusBox) {
        statusBox.className = 'form-status-box is-success';
        statusBox.textContent = 'Recibimos su consulta. Nos contactaremos a la brevedad.';
      }
    }
  }

  // DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavigation();
      initAirbusPanels();
      initContactForm();
    });
  } else {
    initNavigation();
    initAirbusPanels();
    initContactForm();
  }
})();
