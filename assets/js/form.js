class ProgressiveForm {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      preference: 'email',
      budgetMin: '',
      budgetMax: ''
    };
    this.initElements();
  }

  initElements() {
    // Check if modal already exists, if so use it; otherwise create it
    let modal = document.getElementById('form-modal');
    if (!modal) {
      this.createModalHTML();
      modal = document.getElementById('form-modal');
    }

    this.modal = modal;
    this.overlay = document.getElementById('form-overlay');
    this.dialog = document.getElementById('form-dialog');
    this.formContainer = document.getElementById('form-container');

    // Bind close button
    document.getElementById('form-close').addEventListener('click', () => this.close());

    // Bind form buttons
    this.bindFormButtons();
  }

  createModalHTML() {
    // This will be called if modal doesn't exist in HTML
    const modalHTML = `
      <div id="form-overlay" class="modal-overlay">
        <div id="form-dialog" class="modal-dialog">
          <button id="form-close" class="modal-close">&times;</button>
          <div id="form-container" class="form-container">
            <!-- Form content will be rendered here -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  bindFormButtons() {
    // This will be called after rendering each step
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const submitBtn = document.getElementById('btn-submit');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
    if (submitBtn) submitBtn.addEventListener('click', () => this.submit());
  }

  open() {
    this.currentStep = 1;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      preference: 'email',
      budgetMin: '',
      budgetMax: ''
    };
    this.renderStep(1);
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Change cursor color to black
    const cur = document.getElementById('cur');
    if (cur) cur.style.background = '#0d0d0d';
  }

  close() {
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Change cursor color back to white
    const cur = document.getElementById('cur');
    if (cur) cur.style.background = '#fff';
  }

  renderStep(step) {
    this.currentStep = step;
    this.updateProgress();

    const formContent = document.getElementById('form-content');
    if (!formContent) {
      this.formContainer.innerHTML = '<div id="form-content"></div>';
    }

    let html = '';

    if (step === 1) {
      html = `
        <div id="form-content" class="form-content active">
          <h2 class="form-title">Cuéntanos sobre ti</h2>
          <p class="form-subtitle">Comenzamos con lo esencial: tu nombre y correo electrónico.</p>

          <div class="form-group">
            <label class="form-label">Nombre completo *</label>
            <input
              type="text"
              id="form-name"
              class="form-input"
              placeholder="Tu nombre"
              value="${this.formData.name}"
            >
            <div class="form-error" id="error-name"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico *</label>
            <input
              type="email"
              id="form-email"
              class="form-input"
              placeholder="tu@correo.com"
              value="${this.formData.email}"
            >
            <div class="form-error" id="error-email"></div>
          </div>

          <div class="form-buttons">
            <button id="btn-next" class="btn-next">Siguiente →</button>
          </div>
        </div>
      `;
    } else if (step === 2) {
      html = `
        <div id="form-content" class="form-content active">
          <h2 class="form-title">Medio de contacto</h2>
          <p class="form-subtitle">¿Cómo prefieres que nos comunicaremos contigo?</p>

          <div class="form-group">
            <label class="form-label">Teléfono WhatsApp</label>
            <input
              type="tel"
              id="form-phone"
              class="form-input"
              placeholder="+52 81 XXXX XXXX"
              value="${this.formData.phone}"
            >
            <div class="form-error" id="error-phone"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Preferencia de contacto *</label>
            <div class="radio-group">
              <div class="radio-option">
                <input
                  type="radio"
                  id="pref-email"
                  name="preference"
                  value="email"
                  ${this.formData.preference === 'email' ? 'checked' : ''}
                >
                <label for="pref-email">Correo electrónico</label>
              </div>
              <div class="radio-option">
                <input
                  type="radio"
                  id="pref-whatsapp"
                  name="preference"
                  value="whatsapp"
                  ${this.formData.preference === 'whatsapp' ? 'checked' : ''}
                >
                <label for="pref-whatsapp">WhatsApp</label>
              </div>
              <div class="radio-option">
                <input
                  type="radio"
                  id="pref-phone"
                  name="preference"
                  value="phone"
                  ${this.formData.preference === 'phone' ? 'checked' : ''}
                >
                <label for="pref-phone">Llamada telefónica</label>
              </div>
            </div>
          </div>

          <div class="form-buttons">
            <button id="btn-prev" class="btn-prev">← Anterior</button>
            <button id="btn-next" class="btn-next">Siguiente →</button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      html = `
        <div id="form-content" class="form-content active">
          <h2 class="form-title">Tu presupuesto</h2>
          <p class="form-subtitle">Ayúdanos a entender tu rango de inversión (opcional).</p>

          <div class="form-group">
            <div class="budget-range">
              <div class="budget-input">
                <label class="form-label">Presupuesto mínimo</label>
                <input
                  type="number"
                  id="form-budget-min"
                  class="form-input"
                  placeholder="Ej: 1000000"
                  value="${this.formData.budgetMin}"
                >
              </div>
              <div class="budget-input">
                <label class="form-label">Presupuesto máximo</label>
                <input
                  type="number"
                  id="form-budget-max"
                  class="form-input"
                  placeholder="Ej: 50000000"
                  value="${this.formData.budgetMax}"
                >
              </div>
            </div>
            <div class="form-error" id="error-budget"></div>
          </div>

          <div class="form-buttons">
            <button id="btn-prev" class="btn-prev">← Anterior</button>
            <button id="btn-submit" class="btn-submit">Enviar solicitud →</button>
          </div>
        </div>
      `;
    }

    this.formContainer.innerHTML = html;
    this.bindFormButtons();

    // Refocus on first input after render
    setTimeout(() => {
      const firstInput = this.formContainer.querySelector('.form-input');
      if (firstInput) firstInput.focus();
    }, 0);
  }

  updateProgress() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');

      if (stepNum === this.currentStep) {
        step.classList.add('active');
      } else if (stepNum < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  validateStep(step) {
    const errors = {};

    if (step === 1) {
      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();

      if (!name) {
        errors.name = 'El nombre es requerido';
      }

      if (!email) {
        errors.email = 'El correo es requerido';
      } else if (!this.isValidEmail(email)) {
        errors.email = 'Correo no válido';
      }

      // Save valid data
      if (Object.keys(errors).length === 0) {
        this.formData.name = name;
        this.formData.email = email;
      }
    } else if (step === 2) {
      const phone = document.getElementById('form-phone')?.value.trim();
      const preference = document.querySelector('input[name="preference"]:checked')?.value;

      if (!preference) {
        errors.preference = 'Selecciona una preferencia de contacto';
      }

      // Save data (phone is optional)
      if (Object.keys(errors).length === 0) {
        this.formData.phone = phone;
        this.formData.preference = preference || 'email';
      }
    } else if (step === 3) {
      const budgetMin = document.getElementById('form-budget-min')?.value.trim();
      const budgetMax = document.getElementById('form-budget-max')?.value.trim();

      // Validate if both are provided
      if (budgetMin && budgetMax) {
        const min = parseInt(budgetMin);
        const max = parseInt(budgetMax);
        if (min > max) {
          errors.budget = 'El presupuesto mínimo no puede ser mayor al máximo';
        }
      }

      // Save data (both are optional)
      if (Object.keys(errors).length === 0) {
        this.formData.budgetMin = budgetMin;
        this.formData.budgetMax = budgetMax;
      }
    }

    // Display errors
    Object.keys(errors).forEach((field) => {
      const errorEl = document.getElementById(`error-${field}`);
      if (errorEl) {
        errorEl.textContent = errors[field];
        errorEl.classList.add('show');
      }

      const inputEl = document.getElementById(`form-${field}`);
      if (inputEl) {
        inputEl.classList.add('error');
      }
    });

    return Object.keys(errors).length === 0;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  nextStep() {
    // Clear previous errors
    this.clearErrors();

    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < 3) {
        this.renderStep(this.currentStep + 1);
      }
    }
  }

  previousStep() {
    // Clear errors
    this.clearErrors();

    if (this.currentStep > 1) {
      this.renderStep(this.currentStep - 1);
    }
  }

  clearErrors() {
    document.querySelectorAll('.form-error').forEach((el) => {
      el.classList.remove('show');
      el.textContent = '';
    });

    document.querySelectorAll('.form-input').forEach((el) => {
      el.classList.remove('error');
    });
  }

  async submit() {
    // Clear errors first
    this.clearErrors();

    // Validate final step
    if (!this.validateStep(this.currentStep)) {
      return;
    }

    // Prepare payload
    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone || null,
      preference: this.formData.preference,
      budgetMin: this.formData.budgetMin ? parseInt(this.formData.budgetMin) : null,
      budgetMax: this.formData.budgetMax ? parseInt(this.formData.budgetMax) : null
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        this.showSuccess(data);
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo enviar la solicitud'));
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Error de conexión. Por favor intenta de nuevo.');
    }
  }

  showSuccess(data) {
    const successHTML = `
      <div class="form-success show">
        <span class="success-icon">✓</span>
        <h2 class="success-title">¡Solicitud recibida!</h2>
        <p class="success-message">
          Gracias ${this.formData.name}. Te contactaremos pronto a través de ${this.getPreferenceName(this.formData.preference)}.
        </p>
        <div class="success-details">
          <strong>Resumen de tu solicitud:</strong><br>
          Email: ${this.formData.email}<br>
          ${this.formData.phone ? 'Teléfono: ' + this.formData.phone + '<br>' : ''}
          ${this.formData.budgetMin || this.formData.budgetMax ? 'Presupuesto: $' + (this.formData.budgetMin || '0') + ' - $' + (this.formData.budgetMax || 'Sin límite') + ' MXN' : 'Sin presupuesto especificado'}
        </div>
        <button class="btn-close-success" onclick="window.progressiveForm.close()">Cerrar</button>
      </div>
    `;

    this.formContainer.innerHTML = successHTML;
  }

  getPreferenceName(pref) {
    const preferences = {
      email: 'tu correo electrónico',
      whatsapp: 'WhatsApp',
      phone: 'llamada telefónica'
    };
    return preferences[pref] || 'tu correo electrónico';
  }
}

// Initialize form globally
window.progressiveForm = new ProgressiveForm();

// Optional: Auto-trigger form from nav action button or other triggers
document.addEventListener('DOMContentLoaded', () => {
  // Look for elements that should trigger the form
  const navAction = document.querySelector('.nav-action');
  if (navAction) {
    navAction.addEventListener('click', (e) => {
      e.preventDefault();
      window.progressiveForm.open();
    });
  }
});
