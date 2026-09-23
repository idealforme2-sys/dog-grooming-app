/**
 * MuffleyGroom - Gallery Lightbox & Viewer
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryLightbox();
});

const galleryItems = [
  {
    src: 'assets/images/gallery_1.jpg',
    caption: 'Hydrotherapy Bubble Bath with organic lavender suds'
  },
  {
    src: 'assets/images/gallery_2.jpg',
    caption: 'Precision coat hand-brushing and styling'
  },
  {
    src: 'assets/images/gallery_3.jpg',
    caption: 'Master groomer finishing session on our salon table'
  },
  {
    src: 'assets/images/gallery_4.jpg',
    caption: 'Fluffy miniature poodle styling with signature purple collar'
  },
  {
    src: 'assets/images/gallery_5.jpg',
    caption: 'Warm spa towel wrap for calm dog grooming'
  },
  {
    src: 'assets/images/gallery_6.jpg',
    caption: 'Gentle warm blowout & coat fluffing for golden retriever'
  }
];

let currentGalleryIndex = 0;

function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const galleryCards = document.querySelectorAll('.gallery-item-card');
  const viewFullGalleryBtn = document.getElementById('viewFullGalleryBtn');

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentGalleryIndex = index;

    lightboxImg.src = galleryItems[currentGalleryIndex].src;
    lightboxCaption.textContent = `${galleryItems[currentGalleryIndex].caption} (${currentGalleryIndex + 1} / ${galleryItems.length})`;
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (viewFullGalleryBtn) {
    viewFullGalleryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showImage(0);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentGalleryIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentGalleryIndex + 1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
      showImage(currentGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentGalleryIndex + 1);
    }
  });
}
