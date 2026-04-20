class StickyCTA {
  constructor() {
    this.ctaButton = document.getElementById('stickyCTA');
    this.button = document.getElementById('stickyCtaBtn');
    this.heroSection = document.querySelector('.blk-full');
    this.isVisible = false;
    this.init();
  }

  init() {
    if (!this.ctaButton || !this.button) {
      console.warn('Sticky CTA elements not found');
      return;
    }

    // Set up scroll listener
    window.addEventListener('scroll', () => this.updateVisibility());

    // Set up button click listener
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.openContactOptions();
    });

    // Initial visibility check
    this.updateVisibility();
  }

  updateVisibility() {
    if (!this.heroSection) return;

    // Get hero section position
    const heroBottom = this.heroSection.offsetTop + this.heroSection.offsetHeight;
    const currentScroll = window.scrollY;

    // Show button if we've scrolled past the hero section
    const shouldBeVisible = currentScroll > heroBottom;

    if (shouldBeVisible && !this.isVisible) {
      this.show();
    } else if (!shouldBeVisible && this.isVisible) {
      this.hide();
    }
  }

  show() {
    this.isVisible = true;
    this.ctaButton.classList.add('visible');
  }

  hide() {
    this.isVisible = false;
    this.ctaButton.classList.remove('visible');
  }

  openContactOptions() {
    // Create a simple menu overlay with options
    const existingMenu = document.getElementById('cta-menu-overlay');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menuHTML = `
      <div id="cta-menu-overlay" class="cta-menu-overlay">
        <div class="cta-menu">
          <button class="cta-menu-close">&times;</button>
          <h3 class="cta-menu-title">¿Cómo prefieres contactarnos?</h3>
          <a href="https://wa.me/528112345678" target="_blank" class="cta-menu-option">
            <span class="cta-menu-icon">💬</span>
            <span class="cta-menu-text">
              <span class="cta-menu-label">WhatsApp</span>
              <span class="cta-menu-desc">Chat directo con un agente</span>
            </span>
          </a>
          <button class="cta-menu-option cta-form-trigger">
            <span class="cta-menu-icon">📋</span>
            <span class="cta-menu-text">
              <span class="cta-menu-label">Formulario</span>
              <span class="cta-menu-desc">Cuéntanos tus necesidades</span>
            </span>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
    const overlay = document.getElementById('cta-menu-overlay');
    const closeBtn = overlay.querySelector('.cta-menu-close');
    const formTrigger = overlay.querySelector('.cta-form-trigger');

    // Change cursor color to black
    const cur = document.getElementById('cur');
    if (cur) cur.style.background = '#0d0d0d';

    // Close menu
    closeBtn.addEventListener('click', () => {
      if (cur) cur.style.background = '#fff';
      overlay.remove();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (cur) cur.style.background = '#fff';
        overlay.remove();
      }
    });

    // Open form
    formTrigger.addEventListener('click', () => {
      overlay.remove();
      // Call the form from the global ProgressiveForm instance
      if (typeof ProgressiveForm !== 'undefined' && window.progressiveForm) {
        window.progressiveForm.open();
      }
    });

    // Show menu with animation
    setTimeout(() => overlay.classList.add('visible'), 10);
  }
}

// Initialize sticky CTA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.stickyCTA = new StickyCTA();
});
