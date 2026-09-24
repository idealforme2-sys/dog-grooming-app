/**
 * MuffleyGroom - Main UI & Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initConsultationForm();
  initServiceRows();
  initMobileDrawer();
  initPromoBanner();
  initPriceEstimator();
  initBeforeAfterSlider();
  initPricingSwitcher();
  initFaqAccordion();
  initFloatingQuickBar();
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

/* --------------------------------------------------------------------------
   6. Top Promo Announcement Banner
   -------------------------------------------------------------------------- */
function initPromoBanner() {
  const banner = document.getElementById('topPromoBanner');
  if (!banner) return;

  const closeBtn = document.getElementById('topPromoClose');
  const promoLink = document.getElementById('topPromoLink');

  if (sessionStorage.getItem('muffley_promo_dismissed') === 'true') {
    banner.classList.add('hidden');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
      sessionStorage.setItem('muffley_promo_dismissed', 'true');
    });
  }

  if (promoLink) {
    promoLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openBookingModal) {
        window.openBookingModal('Full Spa Treatment');
        showToast('🎁 Coupon PUPLOVE applied: 10% off + free blueberry facial!', 'success');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Breed Grooming Price & Frequency Estimator
   -------------------------------------------------------------------------- */
function initPriceEstimator() {
  const calcSection = document.getElementById('calculator');
  if (!calcSection) return;

  let state = {
    size: 'small', // small, medium, large, giant
    coat: 'curly', // short, double, curly, silky
    package: 'style' // bath, style, royal
  };

  const sizePricing = {
    small: { base: 45, label: 'Small Dog (under 10kg)' },
    medium: { base: 60, label: 'Medium Dog (10-25kg)' },
    large: { base: 75, label: 'Large Dog (25kg+)' },
    giant: { base: 95, label: 'Large Dog (25kg+)' }
  };

  const coatMultipliers = {
    short: { priceAdd: 0, timeAdd: 0, freq: 'Every 6 - 8 weeks' },
    double: { priceAdd: 15, timeAdd: 20, freq: 'Every 4 - 6 weeks' },
    curly: { priceAdd: 20, timeAdd: 25, freq: 'Every 4 - 5 weeks' },
    silky: { priceAdd: 15, timeAdd: 15, freq: 'Every 4 - 6 weeks' }
  };

  const packageConfig = {
    bath: {
      factor: 1.0,
      baseTime: 45,
      modalService: 'Bath & Hygiene',
      title: 'Bath & Hygiene'
    },
    style: {
      factor: 1.45,
      baseTime: 70,
      modalService: 'Haircut & Styling',
      title: 'Signature Breed Styling'
    },
    royal: {
      factor: 1.95,
      baseTime: 95,
      modalService: 'Full Spa Treatment',
      title: 'VIP Royal Canine Spa Day'
    }
  };

  function recalculate() {
    const sizeData = sizePricing[state.size];
    const coatData = coatMultipliers[state.coat];
    const pkgData = packageConfig[state.package];

    const estimatedLow = Math.round(sizeData.base * pkgData.factor + coatData.priceAdd);
    const estimatedHigh = estimatedLow + 15;
    const totalDuration = pkgData.baseTime + coatData.timeAdd;

    const priceEl = document.getElementById('calcResultPrice');
    const timeEl = document.getElementById('calcResultTime');
    const freqEl = document.getElementById('calcResultFreq');
    const descEl = document.getElementById('calcResultDesc');

    if (priceEl) priceEl.textContent = `$${estimatedLow} - $${estimatedHigh}`;
    if (timeEl) timeEl.textContent = `~${totalDuration} mins`;
    if (freqEl) freqEl.textContent = coatData.freq;
    if (descEl) descEl.textContent = `Personalized for ${sizeData.label} with ${state.coat} coat receiving ${pkgData.title}.`;
  }

  // Bind size chips
  const sizeChips = calcSection.querySelectorAll('.calc-size-chip');
  sizeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sizeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.size = chip.getAttribute('data-size');
      recalculate();
    });
  });

  // Bind coat chips
  const coatChips = calcSection.querySelectorAll('.calc-coat-chip');
  coatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      coatChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.coat = chip.getAttribute('data-coat');
      recalculate();
    });
  });

  // Bind package chips
  const pkgChips = calcSection.querySelectorAll('.calc-package-chip');
  pkgChips.forEach(chip => {
    chip.addEventListener('click', () => {
      pkgChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.package = chip.getAttribute('data-package');
      recalculate();
    });
  });

  // Bind CTA book button
  const bookBtn = document.getElementById('calcBookBtn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const pkg = packageConfig[state.package];
      const sizeData = sizePricing[state.size];
      if (window.openBookingModal) {
        window.openBookingModal(pkg.modalService, sizeData.label, 2);
        showToast(`🐾 Estimator package selected: ${pkg.title} for ${sizeData.label}! Choose your date.`, 'success');
      }
    });
  }

  recalculate();
}

/* --------------------------------------------------------------------------
   8. Before & After Transformation Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  if (!container) return;

  const afterWrap = document.getElementById('baAfterWrap');
  const divider = document.getElementById('baDividerLine');
  if (!afterWrap || !divider) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;

    afterWrap.style.width = `${percentage}%`;
    divider.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support for Mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* --------------------------------------------------------------------------
   9. Transparent 3-Tier Spa Pricing Menu
   -------------------------------------------------------------------------- */
function initPricingSwitcher() {
  const switchBtns = document.querySelectorAll('.size-switch-btn');
  if (!switchBtns.length) return;

  const tierPrices = {
    small: {
      bath: { price: '$45', time: '45 mins' },
      style: { price: '$70', time: '65 mins' },
      royal: { price: '$95', time: '85 mins' },
      label: 'Small Dog (under 10kg)'
    },
    medium: {
      bath: { price: '$60', time: '55 mins' },
      style: { price: '$85', time: '75 mins' },
      royal: { price: '$120', time: '100 mins' },
      label: 'Medium Dog (10-25kg)'
    },
    large: {
      bath: { price: '$75', time: '70 mins' },
      style: { price: '$110', time: '90 mins' },
      royal: { price: '$150', time: '120 mins' },
      label: 'Large Dog (25kg+)'
    }
  };

  let currentSize = 'small';

  function updatePricing(sizeKey) {
    currentSize = sizeKey;
    const data = tierPrices[sizeKey];
    if (!data) return;

    const bathEl = document.getElementById('priceValBath');
    const styleEl = document.getElementById('priceValStyle');
    const royalEl = document.getElementById('priceValRoyal');

    const bathTime = document.getElementById('priceTimeBath');
    const styleTime = document.getElementById('priceTimeStyle');
    const royalTime = document.getElementById('priceTimeRoyal');

    if (bathEl) bathEl.textContent = data.bath.price;
    if (styleEl) styleEl.textContent = data.style.price;
    if (royalEl) royalEl.textContent = data.royal.price;

    if (bathTime) bathTime.textContent = data.bath.time;
    if (styleTime) styleTime.textContent = data.style.time;
    if (royalTime) royalTime.textContent = data.royal.time;
  }

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const size = btn.getAttribute('data-size');
      updatePricing(size);
    });
  });

  // Book buttons in pricing cards
  const tierBookBtns = document.querySelectorAll('.trigger-tier-book');
  tierBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tierName = btn.getAttribute('data-tier') || 'Signature Styling';
      const sizeLabel = tierPrices[currentSize].label;
      if (window.openBookingModal) {
        window.openBookingModal(tierName, sizeLabel, 1);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Interactive FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   11. Floating Quick-Action Bar
   -------------------------------------------------------------------------- */
function initFloatingQuickBar() {
  const quickBar = document.getElementById('floatingQuickBar');
  const scrollTopBtn = document.getElementById('floatingScrollTop');
  const quickBookBtn = document.getElementById('floatingQuickBook');

  if (!quickBar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      quickBar.classList.add('visible');
    } else {
      quickBar.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (quickBookBtn) {
    quickBookBtn.addEventListener('click', () => {
      if (window.openBookingModal) {
        window.openBookingModal('Full Spa Treatment');
      }
    });
  }
}
