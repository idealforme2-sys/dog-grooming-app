/**
 * MuffleyGroom - Main UI & Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initConsultationForm();
  initServiceRows();
  initMobileDrawer();
});

/* --------------------------------------------------------------------------
   1. Navbar Scrolling & Active State
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active indicator
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. Consultation Form Submission & Validation
   -------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.querySelector('#consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[name="client_name"]');
    const phoneInput = form.querySelector('input[name="phone_number"]');
    const dogSizeInput = form.querySelector('select[name="dog_size"]') || form.querySelector('select[name="pet_type"]');

    if (!nameInput.value.trim()) {
      showToast('⚠️ Please enter your name.', 'error');
      nameInput.focus();
      return;
    }

    if (!phoneInput.value.trim()) {
      showToast('⚠️ Please enter your phone number.', 'error');
      phoneInput.focus();
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... ⏳';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('🐶 Thank you! We received your request and will call you shortly.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   4. About Us Interactive Service List
   -------------------------------------------------------------------------- */
function initServiceRows() {
  const serviceRows = document.querySelectorAll('.service-item-row');
  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const serviceName = row.querySelector('.service-item-name').textContent.trim();
      if (window.openBookingModal) {
        window.openBookingModal(serviceName);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.className = `toast-notice show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

window.showToast = showToast;
