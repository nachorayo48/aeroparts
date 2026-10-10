/**
 * AEROPARTS - AIRBUS 4-PANEL INTERACTIVE COMPONENT
 * Replicates the exact Airbus interaction: hover expand, crossfade master background,
 * active frosted glass card, and mobile accordion adaptation.
 */

export function initAirbusPanels() {
  const wrapper = document.querySelector('.airbus-band-wrapper');
  if (!wrapper) return;

  const masterBg = wrapper.querySelector('.airbus-band-master-bg');
  const panels = wrapper.querySelectorAll('.airbus-panel');

  panels.forEach(panel => {
    const btn = panel.querySelector('.airbus-panel-btn');
    const bgUrl = panel.getAttribute('data-bg');

    // Preload background image for instant crossfade
    if (bgUrl) {
      const img = new Image();
      img.src = bgUrl;
    }

    const togglePanel = (e) => {
      // Don't trigger if user clicked inside the open text or a link
      if (panel.classList.contains('is-open') && e.target.closest('.airbus-panel-body')) {
        return;
      }

      const isOpen = panel.classList.contains('is-open');

      if (isOpen) {
        // Close current panel
        closeAllPanels();
      } else {
        // Open this panel
        openPanel(panel);
      }
    };

    panel.addEventListener('click', togglePanel);

    // Keyboard support
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel(e);
      }
    });
  });

  function openPanel(targetPanel) {
    const bgUrl = targetPanel.getAttribute('data-bg');

    // 1. Update master background image
    if (masterBg && bgUrl) {
      masterBg.style.backgroundImage = `url('${bgUrl}')`;
    }

    // 2. Set wrapper open state
    wrapper.classList.add('has-open-panel');

    // 3. Update panel states
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

    // Reset master background after fade transition
    setTimeout(() => {
      if (!wrapper.classList.contains('has-open-panel') && masterBg) {
        masterBg.style.backgroundImage = 'none';
      }
    }, 550);
  }
}
