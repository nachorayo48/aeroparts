/**
 * AEROPARTS - MAIN ENTRY POINT
 */

import { initNavigation } from './navigation.js';
import { initAirbusPanels } from './airbus-panels.js';
import { initContactForm } from './contact-form.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAirbusPanels();
  initContactForm();
});
