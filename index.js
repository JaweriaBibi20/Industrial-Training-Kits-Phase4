/* ==========================================================================
   TASK 4 INTERACTIVE LOGIC (TASK 3 FEATURES + PHASE 4 VALIDATION ENGINE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // 1. TASK 3 EXISTING LOGIC (MOBILE NAV, THEME, MODALS, SEARCH)
  // ---------------------------------------------------------
  const navToggleBtn = document.querySelector('.js-nav-toggle');
  const navMenu = document.querySelector('.js-nav-menu');
  
  const themeToggleBtn = document.querySelector('.js-theme-toggle');
  const themeIcon = document.querySelector('.js-theme-icon');
  
  const searchBtn = document.querySelector('.js-search-btn');
  const searchModal = document.querySelector('.js-search-modal');
  const searchCloseBtn = document.querySelector('.js-search-close');
  const searchInput = document.querySelector('.js-search-input');
  const searchResults = document.querySelector('.js-search-results');

  const detailModal = document.querySelector('.js-detail-modal');
  const detailCloseBtns = document.querySelectorAll('.js-detail-close');
  const openModuleBtns = document.querySelectorAll('.js-open-module');

  // MODAL TARGET NODES
  const modalImg = document.getElementById('modal-img');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpec1 = document.getElementById('modal-spec1');
  const modalSpec2 = document.getElementById('modal-spec2');
  const modalSpec3 = document.getElementById('modal-spec3');

  // THEME MANAGEMENT
  let currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('is-light-mode');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('is-light-mode');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  // Mobile Navigation Toggle
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });
  }

  // Theme Switcher Trigger
  if (themeToggleBtn && themeIcon) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('is-light-mode')) {
        document.body.classList.remove('is-light-mode');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.add('is-light-mode');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // MODULE DETAIL MODAL OPEN TRIGGER
  openModuleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const tag = btn.getAttribute('data-tag');
      const img = btn.getAttribute('data-img');
      const desc = btn.getAttribute('data-desc');
      const spec1 = btn.getAttribute('data-spec1');
      const spec2 = btn.getAttribute('data-spec2');
      const spec3 = btn.getAttribute('data-spec3');

      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = tag;
      if (modalImg) modalImg.src = img;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalSpec1) modalSpec1.textContent = spec1;
      if (modalSpec2) modalSpec2.textContent = spec2;
      if (modalSpec3) modalSpec3.textContent = spec3;

      detailModal.classList.add('is-visible');
    });
  });

  // Close Detail Modal Triggers
  detailCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      detailModal.classList.remove('is-visible');
    });
  });

  // Live Search Implementation
  if (searchBtn && searchModal && searchCloseBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('is-visible');
      searchInput.value = '';
      searchResults.innerHTML = '<p class="search-hint">Type above to filter modules live...</p>';
      setTimeout(() => searchInput.focus(), 100);
    });

    searchCloseBtn.addEventListener('click', () => {
      searchModal.classList.remove('is-visible');
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.js-card');
      
      if (query === '') {
        searchResults.innerHTML = '<p class="search-hint">Type above to filter modules live...</p>';
        return;
      }

      let matches = [];
      cards.forEach((card) => {
        const title = card.querySelector('.js-card-title')?.textContent || '';
        const text = card.querySelector('.card-text')?.textContent || '';
        if (title.toLowerCase().includes(query) || text.toLowerCase().includes(query)) {
          matches.push({ id: card.id, title: title });
        }
      });

      if (matches.length > 0) {
        searchResults.innerHTML = matches.map(item => `
          <div class="search-result-item" data-target="${item.id}">
            <strong>${item.title}</strong>
          </div>
        `).join('');

        document.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              searchModal.classList.remove('is-visible');
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      } else {
        searchResults.innerHTML = '<p class="search-hint">No matching modules found.</p>';
      }
    });
  }

  // Backdrop Overlay Clicks to Close
  window.addEventListener('click', (event) => {
    if (event.target === searchModal) {
      searchModal.classList.remove('is-visible');
    }
    if (event.target === detailModal) {
      detailModal.classList.remove('is-visible');
    }
  });

  // ---------------------------------------------------------
  // 2. PHASE 4: FORM VALIDATION ENGINE & ARIA TETHERING
  // ---------------------------------------------------------
  const form = document.getElementById('registrationForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const liveRegion = document.getElementById('live-region');
  const jsonConsole = document.getElementById('jsonConsole');

  // Regex Patterns
  const nameRegex = /^[A-Za-z\s]{3,30}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/;

  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, nameError, "Full Name is required.");
      return false;
    } else if (!nameRegex.test(val)) {
      setError(nameInput, nameError, "Name must contain only letters (3-30 characters).");
      return false;
    } else {
      clearError(nameInput, nameError);
      return true;
    }
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) {
      setError(emailInput, emailError, "Email address is required.");
      return false;
    } else if (!emailRegex.test(val)) {
      setError(emailInput, emailError, "Enter a valid email address (e.g., engineer@domain.com).");
      return false;
    } else {
      clearError(emailInput, emailError);
      return true;
    }
  };

  const validatePassword = () => {
    const val = passwordInput.value;
    if (!val) {
      setError(passwordInput, passwordError, "Password is required.");
      return false;
    } else if (!passwordRegex.test(val)) {
      setError(passwordInput, passwordError, "Password requires uppercase, lowercase, number, special char (#?!@$%^&*-) and 8+ chars.");
      return false;
    } else {
      clearError(passwordInput, passwordError);
      return true;
    }
  };

  function setError(inputElem, errorSpanElem, message) {
    inputElem.setAttribute('aria-invalid', 'true');
    errorSpanElem.textContent = message;
  }

  function clearError(inputElem, errorSpanElem) {
    inputElem.setAttribute('aria-invalid', 'false');
    errorSpanElem.textContent = '';
  }

  // Real-time Blur Field Events
  if (nameInput && emailInput && passwordInput) {
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
  }

  // Prevent Default Threat & Form Submission Process
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevents page refresh and state wipe

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (isNameValid && isEmailValid && isPasswordValid) {
        const successPayload = {
          status: "SUCCESS_APPROVED",
          timestamp: new Date().toISOString(),
          user: {
            fullName: nameInput.value.trim(),
            email: emailInput.value.trim(),
            passwordEncrypted: "********"
          }
        };

        jsonConsole.innerHTML = `<pre>${JSON.stringify(successPayload, null, 2)}</pre>`;
        liveRegion.className = 'live-region-box active-success';
        liveRegion.textContent = 'Validation Approved: Payload successfully generated and dispatched.';
      } else {
        const failurePayload = {
          status: "VALIDATION_FAILED",
          timestamp: new Date().toISOString(),
          error: "Inspect error fields."
        };

        jsonConsole.innerHTML = `<pre>${JSON.stringify(failurePayload, null, 2)}</pre>`;
        liveRegion.className = 'live-region-box active-error';
        liveRegion.textContent = 'Validation Gate Error: Please fix the highlighted errors above.';
      }
    });
  }
});