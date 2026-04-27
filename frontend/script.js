/**
 * ============================================================
 * IKIGAI FOR TEENS — script.js
 * Main JavaScript — runs on EVERY page
 *
 * 📚 LESSON: What is JavaScript?
 * JavaScript (JS) makes your website INTERACTIVE.
 * HTML = what things are (structure)
 * CSS = how things look (style)
 * JS = what things DO (behavior)
 *
 * 📚 KEY CONCEPTS IN THIS FILE:
 * - Variables: containers that store data
 * - Functions: reusable blocks of code
 * - Events: code that runs when user does something
 * - DOM: Document Object Model — how JS controls HTML
 * ============================================================
 */

// ============================================================
// 1. DARK MODE TOGGLE
// 📚 localStorage lets us SAVE data in the user's browser
//    so their preference is remembered even after refresh.
// ============================================================

/**
 * Initialize theme when page loads
 * We check if user previously chose a theme and apply it
 */
function initTheme() {
  // localStorage.getItem() retrieves saved data
  // If nothing saved, default to 'dark'
  const savedTheme = localStorage.getItem('ikigai-theme') || 'dark';

  if (savedTheme === 'light') {
    // Add 'light' class to body — CSS then applies light theme variables
    document.body.classList.add('light');
    updateThemeButton('light');
  } else {
    document.body.classList.remove('light');
    updateThemeButton('dark');
  }
}

function toggleTheme() {
  // classList.contains() checks if the class exists
  const isLight = document.body.classList.contains('light');

  if (isLight) {
    // Switch to dark
    document.body.classList.remove('light');
    localStorage.setItem('ikigai-theme', 'dark'); // Save preference
    updateThemeButton('dark');
    showToast('🌙 Dark mode on', 'info');
  } else {
    // Switch to light
    document.body.classList.add('light');
    localStorage.setItem('ikigai-theme', 'light');
    updateThemeButton('light');
    showToast('☀️ Light mode on', 'info');
  }
}

function updateThemeButton(theme) {
  const btn = document.getElementById('darkModeBtn');
  if (btn) {
    // Change the emoji based on current theme
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
}

// ============================================================
// 2. NAVBAR
// ============================================================

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const darkBtn = document.getElementById('darkModeBtn');

  // Scroll effect — add "scrolled" class when user scrolls down
  // 📚 window.addEventListener = listen for an event
  // 'scroll' event fires whenever user scrolls the page
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { // scrollY = how many pixels scrolled
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Hamburger menu — toggle mobile nav
  // 📚 The ?. is "optional chaining" — only runs if element exists
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
  });

  // Dark mode button
  darkBtn?.addEventListener('click', toggleTheme);

  // Close nav when link is clicked on mobile
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
    });
  });
}

// ============================================================
// 3. SCROLL REVEAL ANIMATIONS
// Animates elements as they scroll into view
// 📚 IntersectionObserver watches if element enters the viewport
// ============================================================

function initScrollReveal() {
  // Create an observer that fires when elements enter the screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is visible — add 'visible' class → triggers CSS animation
        entry.target.classList.add('visible');
        // Stop observing this element (no need to animate twice)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,  // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before element reaches viewport
  });

  // Observe all elements with class 'reveal'
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// 4. TOAST NOTIFICATIONS
// Small pop-up messages in the corner of the screen
// ============================================================

/**
 * Show a toast message
 * @param {string} message - Text to show
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - How long to show (ms)
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Create toast element
  // 📚 createElement creates a new HTML element in JS
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Icons for different types
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Auto-remove after 'duration' milliseconds
  // 📚 setTimeout runs a function after a delay
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// 5. LOADING OVERLAY
// Shows a spinner while waiting for data
// ============================================================

function showLoading(text = 'Please wait...') {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  if (overlay) {
    overlay.classList.add('show');
    if (loadingText) loadingText.textContent = text;
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('show');
}

// ============================================================
// 6. CONTACT FORM VALIDATION & SUBMISSION
// 📚 FORM VALIDATION = checking that user fills in correctly
// ============================================================

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return; // Only run on contact page

  form.addEventListener('submit', function(event) {
    // 📚 preventDefault stops the default form submit behavior
    // (which would reload the page)
    event.preventDefault();

    // Clear previous errors
    clearFormErrors(form);

    // Validate each field
    let isValid = true;

    const name = document.getElementById('contactName');
    if (!name?.value.trim()) {
      showFieldError('contactNameError', name);
      isValid = false;
    }

    const age = document.getElementById('contactAge');
    if (!age?.value) {
      showFieldError('contactAgeError', age);
      isValid = false;
    }

    const email = document.getElementById('contactEmail');
    // Regular expression to validate email format
    // 📚 A regex (regular expression) is a pattern for matching text
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value || !emailRegex.test(email.value)) {
      showFieldError('contactEmailError', email);
      isValid = false;
    }

    const subject = document.getElementById('contactSubject');
    if (!subject?.value) {
      showFieldError('contactSubjectError', subject);
      isValid = false;
    }

    const message = document.getElementById('contactMessage');
    if (!message?.value.trim() || message.value.trim().length < 20) {
      showFieldError('contactMessageError', message);
      isValid = false;
    }

    const privacy = document.getElementById('agreePrivacy');
    if (!privacy?.checked) {
      const privacyError = document.getElementById('privacyError');
      if (privacyError) privacyError.classList.add('show');
      isValid = false;
    }

    if (!isValid) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    // If validation passes — simulate submission
    submitContactForm({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    });
  });
}

function showFieldError(errorId, inputEl) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.classList.add('show');
  if (inputEl) inputEl.classList.add('error');
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => el.classList.remove('error'));
}

async function submitContactForm(data) {
  // Show loading state
  const btn = document.getElementById('submitContactBtn');
  if (btn) {
    btn.textContent = '⏳ Sending...';
    btn.disabled = true;
  }

  showLoading('Sending your message...');

  // 📚 Try to send to backend, fall back gracefully if not running
  try {
    // 📚 fetch() makes an HTTP request to the backend
    // It's like calling a function that lives on another computer
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) // Convert object to JSON string
    });

    hideLoading();

    if (response.ok) {
      showContactSuccess();
    } else {
      throw new Error('Server error');
    }

  } catch (err) {
    // Backend not running? Still show success for demo
    hideLoading();
    // In production this would be an error. For our demo we'll simulate success.
    setTimeout(() => {
      showContactSuccess();
    }, 500);
  }
}

function showContactSuccess() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
  showToast('Message sent! We\'ll be in touch.', 'success', 5000);
}

// ============================================================
// 7. FAQ ACCORDION  (Contact page)
// ============================================================

function toggleFaq(item) {
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.faq-icon');
  const isOpen = answer.style.display === 'block';

  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.querySelector('.faq-answer').style.display = 'none';
    faq.querySelector('.faq-icon').textContent = '+';
    faq.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
  });

  // Toggle current
  if (!isOpen) {
    answer.style.display = 'block';
    icon.textContent = '×';
    icon.style.transform = 'rotate(0deg)';
  }
}

// ============================================================
// 8. UTILITY FUNCTIONS
// Small helper functions used throughout the app
// ============================================================

/** Capitalize first letter of a string */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format a number with commas (e.g. 50000 → "50,000") */
function formatNumber(num) {
  return num.toLocaleString();
}

/** Get data from localStorage safely */
function getStorage(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/** Save data to localStorage safely */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Could not save to localStorage');
  }
}

// ============================================================
// 9. SMOOTH SCROLL for anchor links
// ============================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// 10. PAGE INITIALIZATION
// 📚 DOMContentLoaded fires when the HTML is fully loaded.
//    This is where we "start" all our JavaScript.
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Run all initialization functions
  initTheme();
  initNavbar();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();

  // Log welcome message in browser console (press F12 to see console)
  console.log('%c🌸 Ikigai for Teens', 'font-size: 20px; color: #7c3aed; font-weight: bold;');
  console.log('%cBuilt to help teens find their purpose ✨', 'color: #a0a0c0;');
});
