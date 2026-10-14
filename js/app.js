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
     3. I18N LANGUAGE SELECTOR (ES | EN)
     ========================================================================== */
  function initLanguage() {
    const defaultLang = 'es';
    let currentLang = defaultLang;

    try {
      const stored = localStorage.getItem('aeroparts_lang');
      if (stored === 'es' || stored === 'en') {
        currentLang = stored;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for language preference:', e);
    }

    function setLanguage(lang) {
      currentLang = (lang === 'en') ? 'en' : 'es';

      try {
        localStorage.setItem('aeroparts_lang', currentLang);
      } catch (e) {}

      document.documentElement.lang = currentLang;

      // Update button active state in header and mobile drawer
      document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });

      // Synchronize hidden input for Formspree
      const hiddenLangInput = document.getElementById('form-input-lang');
      if (hiddenLangInput) {
        hiddenLangInput.value = currentLang;
      }

      // Update texts
      const dict = window.aeropartsTranslations && window.aeropartsTranslations[currentLang];
      if (!dict) return;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          el.textContent = dict[key];
        }
      });

      // Update placeholders
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key] !== undefined) {
          el.setAttribute('placeholder', dict[key]);
        }
      });
    }

    // Attach click events
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && targetLang !== currentLang) {
          setLanguage(targetLang);
        }
      });
    });

    // Apply active language immediately
    setLanguage(currentLang);

    return {
      getLang: () => currentLang,
      setLanguage
    };
  }

  /* ==========================================================================
     4. CONTACT FORM (Formspree AJAX & Bilingual Feedback)
     ========================================================================== */
  function initContactForm(langManager) {
    const form = document.getElementById('aeroparts-contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.btn-submit');
    const statusBox = document.getElementById('form-status-message');

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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidField = null;

      if (statusBox) {
        statusBox.className = 'form-status-box';
        statusBox.textContent = '';
      }

      // 1. Name
      if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = nameInput;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // 2. Email
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = emailInput;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // 3. Subject
      if (!subjectInput.value.trim()) {
        isValid = false;
        subjectInput.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = subjectInput;
      } else {
        subjectInput.classList.remove('is-invalid');
      }

      // 4. Message
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

      const activeLang = langManager ? langManager.getLang() : (document.documentElement.lang || 'es');
      const dict = window.aeropartsTranslations && window.aeropartsTranslations[activeLang] ? window.aeropartsTranslations[activeLang] : {};

      const originalBtnText = dict['form.btn.submit'] || (activeLang === 'en' ? 'SEND' : 'ENVIAR');
      const sendingText = dict['form.btn.sending'] || (activeLang === 'en' ? 'SENDING…' : 'ENVIANDO…');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = sendingText;
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
          showFeedback('success', activeLang);
          form.reset();
          const hiddenLangInput = document.getElementById('form-input-lang');
          if (hiddenLangInput) hiddenLangInput.value = activeLang;
        } else {
          showFeedback('error', activeLang);
        }
      } catch (err) {
        console.warn('Form submission network error:', err);
        showFeedback('error', activeLang);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });

    function showFeedback(type, activeLang) {
      if (!statusBox) return;
      const dict = window.aeropartsTranslations && window.aeropartsTranslations[activeLang] ? window.aeropartsTranslations[activeLang] : {};

      if (type === 'success') {
        statusBox.className = 'form-status-box is-success';
        statusBox.textContent = dict['form.msg.success'] || (activeLang === 'en'
          ? 'We have received your inquiry. We will contact you shortly.'
          : 'Recibimos su consulta. Nos contactaremos a la brevedad.');
      } else {
        statusBox.className = 'form-status-box is-error';
        statusBox.textContent = dict['form.msg.error'] || (activeLang === 'en'
          ? 'Your inquiry could not be sent. Please try again or contact us at christiansterli@aeroparts.com.ar.'
          : 'No fue posible enviar su consulta. Por favor, intente nuevamente o escríbanos a christiansterli@aeroparts.com.ar.');
      }
    }
  }

  // DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavigation();
      initAirbusPanels();
      const langManager = initLanguage();
      initContactForm(langManager);
    });
  } else {
    initNavigation();
    initAirbusPanels();
    const langManager = initLanguage();
    initContactForm(langManager);
  }
})();
