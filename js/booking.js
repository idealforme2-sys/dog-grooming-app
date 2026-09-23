/**
 * MuffleyGroom - Multi-Step Booking Modal & Service Details
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingModal();
  initServiceDetailsModal();
});

let bookingData = {
  service: 'Bath & Hygiene',
  dogSize: 'Small Dog (under 10kg)',
  date: '',
  time: '10:00 AM',
  ownerName: '',
  phone: '',
  petName: '',
  notes: ''
};

let currentStep = 1;

function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const nextBtn = document.getElementById('bookingNextBtn');
  const prevBtn = document.getElementById('bookingPrevBtn');
  const bookTriggers = document.querySelectorAll('.trigger-booking-modal');

  // Open modal on click
  bookTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedService = btn.getAttribute('data-service') || 'Bath & Hygiene';
      openBookingModal(preselectedService);
    });
  });

  // Close modal
  closeBtn.addEventListener('click', closeBookingModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeBookingModal();
  });

  // Chips in Step 1
  const serviceChips = modalOverlay.querySelectorAll('.service-chip');
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      bookingData.service = chip.getAttribute('data-value');
    });
  });

  const petTypeChips = modalOverlay.querySelectorAll('.pet-type-chip');
  petTypeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      petTypeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      bookingData.dogSize = chip.getAttribute('data-value');
    });
  });

  // Time slot buttons in Step 2
  const timeBtns = modalOverlay.querySelectorAll('.time-slot-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingData.time = btn.getAttribute('data-time');
    });
  });

  // Step Navigation
  nextBtn.addEventListener('click', () => {
    if (currentStep === 1) {
      goToStep(2);
    } else if (currentStep === 2) {
      const dateInput = document.getElementById('bookingDate');
      if (!dateInput.value) {
        window.showToast('Please select a preferred date.', 'error');
        dateInput.focus();
        return;
      }
      bookingData.date = dateInput.value;
      goToStep(3);
    } else if (currentStep === 3) {
      const nameInput = document.getElementById('bookingOwnerName');
      const phoneInput = document.getElementById('bookingPhone');
      const petNameInput = document.getElementById('bookingPetName');

      if (!nameInput.value.trim()) {
        window.showToast('Please enter your name.', 'error');
        nameInput.focus();
        return;
      }
      if (!phoneInput.value.trim()) {
        window.showToast('Please enter your phone number.', 'error');
        phoneInput.focus();
        return;
      }

      bookingData.ownerName = nameInput.value.trim();
      bookingData.phone = phoneInput.value.trim();
      bookingData.petName = petNameInput.value.trim() || 'My Pet';
      bookingData.notes = document.getElementById('bookingNotes').value.trim();

      // Submit booking
      populateSummary();
      goToStep(4);
    } else if (currentStep === 4) {
      closeBookingModal();
      window.showToast('🎉 Appointment confirmed! See you at MuffleyGroom!', 'success');
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  // Set default date to tomorrow
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
    bookingData.date = dateInput.value;
  }
}

function openBookingModal(preselectedService) {
  const modalOverlay = document.getElementById('bookingModal');
  if (!modalOverlay) return;

  if (preselectedService) {
    bookingData.service = preselectedService;
    const chips = modalOverlay.querySelectorAll('.service-chip');
    chips.forEach(c => {
      if (c.getAttribute('data-value') === preselectedService) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
  }

  goToStep(1);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function goToStep(step) {
  currentStep = step;

  // Update indicators
  const stepIndicators = document.querySelectorAll('.step-indicator-item');
  stepIndicators.forEach((indicator, index) => {
    const stepNum = index + 1;
    indicator.classList.remove('active', 'completed');
    if (stepNum === currentStep) {
      indicator.classList.add('active');
    } else if (stepNum < currentStep) {
      indicator.classList.add('completed');
    }
  });

  // Update panes
  const stepPanes = document.querySelectorAll('.booking-step-pane');
  stepPanes.forEach((pane, index) => {
    pane.classList.remove('active');
    if (index + 1 === currentStep) {
      pane.classList.add('active');
    }
  });

  // Update buttons
  const prevBtn = document.getElementById('bookingPrevBtn');
  const nextBtn = document.getElementById('bookingNextBtn');

  if (currentStep === 1) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.innerHTML = 'Continue to Date & Time →';
  } else if (currentStep === 2) {
    prevBtn.style.visibility = 'visible';
    nextBtn.innerHTML = 'Continue to Details →';
  } else if (currentStep === 3) {
    prevBtn.style.visibility = 'visible';
    nextBtn.innerHTML = 'Confirm Appointment 🐾';
  } else if (currentStep === 4) {
    prevBtn.style.display = 'none';
    nextBtn.innerHTML = 'Done & Close';
    nextBtn.classList.remove('btn-pink');
    nextBtn.classList.add('btn-purple');
  }
}

function populateSummary() {
  document.getElementById('sumService').textContent = bookingData.service;
  const dogDisplay = bookingData.petName ? `${bookingData.petName} (${bookingData.dogSize})` : bookingData.dogSize;
  document.getElementById('sumPet').textContent = dogDisplay;
  document.getElementById('sumDateTime').textContent = `${bookingData.date} at ${bookingData.time}`;
  document.getElementById('sumContact').textContent = `${bookingData.ownerName} (${bookingData.phone})`;
}

window.openBookingModal = openBookingModal;

/* --------------------------------------------------------------------------
   Service Details Modal ("Learn More")
   -------------------------------------------------------------------------- */
const serviceDataCatalog = {
  'bath-hygiene': {
    title: 'Bath & Hygiene',
    desc: 'Our essential luxury hydrobath with hypoallergenic organic shampoos, deep conditioning, blueberry facial scrub, and gentle ear & paw sanitation.',
    image: 'assets/images/service_bath.jpg',
    duration: '45 - 60 mins',
    price: '$45 - $65',
    includes: ['Organic coat shampoo & rinse', 'Gentle warm blow-dry', 'Ear cleaning & hair removal', 'Sanitary & paw pad trimming', 'Nail clipping & filing', 'Signature dog fragrance mist']
  },
  'haircut-styling': {
    title: 'Haircut & Styling',
    desc: 'Breed-specific hand styling or bespoke teddy bear cut done by master groomers. Includes bath, deep conditioning, precision scissoring, and finish.',
    image: 'assets/images/service_haircut.jpg',
    duration: '75 - 90 mins',
    price: '$70 - $95',
    includes: ['Complete Bath & Hygiene package', 'Precision breed styling or puppy cut', 'Face, paw & tail scissor sculpting', 'Sanitary hygiene cleanup', 'Complimentary bowtie or bandana', 'Nourishing coat gloss spray']
  },
  'nail-trimming': {
    title: 'Nail Trimming & Paw Care',
    desc: 'Gentle, stress-free nail clipping followed by rotary smoothing and soothing organic paw balm to protect against cracking and rough paw pads.',
    image: 'assets/images/service_nails.jpg',
    duration: '20 - 30 mins',
    price: '$20 - $30',
    includes: ['Precision quick-safe clipping', 'Rotary buffing & edge smoothing', 'Paw pad hair trim & tidy', 'Organic chamomile paw butter balm', 'Gentle paw massage']
  },
  'de-shedding': {
    title: 'De-Shedding Treatment',
    desc: 'Specialized 4-step undercoat removal program using specialized furminating brushes, deshedding shampoo & solution, and high-velocity fluff blowout.',
    image: 'assets/images/service_cat.jpg',
    duration: '60 - 80 mins',
    price: '$55 - $80',
    includes: ['De-shedding deep soak bath', 'Undercoat conditioning soak', 'High-velocity coat blowout', 'Specialist rake & blade brushing', 'Reduces shedding by up to 90%', 'Healthy dermal coat polish']
  }
};

function initServiceDetailsModal() {
  const modal = document.getElementById('serviceDetailsModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const triggers = document.querySelectorAll('.trigger-service-detail');
  const bookBtn = document.getElementById('serviceModalBookBtn');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = trigger.getAttribute('data-service-key');
      const data = serviceDataCatalog[serviceKey];
      if (!data) return;

      document.getElementById('serviceModalImg').src = data.image;
      document.getElementById('serviceModalTitle').textContent = data.title;
      document.getElementById('serviceModalDesc').textContent = data.desc;
      document.getElementById('serviceModalDuration').textContent = data.duration;
      document.getElementById('serviceModalPrice').textContent = data.price;

      const listContainer = document.getElementById('serviceModalIncludes');
      listContainer.innerHTML = '';
      data.includes.forEach(item => {
        const li = document.createElement('div');
        li.className = 'service-include-item';
        li.innerHTML = `<span class="check">✓</span> <span>${item}</span>`;
        listContainer.appendChild(li);
      });

      bookBtn.onclick = () => {
        modal.classList.remove('active');
        openBookingModal(data.title);
      };

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
