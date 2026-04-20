/**
 * AdminDashboard - Main dashboard controller
 * Handles authentication, lead loading, rendering, and user interactions
 */

class AdminDashboard {
  constructor() {
    this.auth = new AdminAuth();
    this.leads = [];
    this.stats = {
      totalLeads: 0,
      hotLeads: 0,
      contactedLeads: 0,
      scheduledLeads: 0,
    };
    this.init();
  }

  /**
   * Initialize the dashboard - check auth status and render appropriate view
   */
  async init() {
    // Check if user is authenticated
    if (this.auth.isAuthenticated()) {
      this.showDashboard();
      await this.loadLeads();
    } else {
      this.showLoginForm();
    }

    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to DOM elements
   */
  attachEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  /**
   * Show login form
   */
  showLoginForm() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('loginContainer').classList.add('active');
    document.getElementById('dashboardContainer').classList.remove('active');
  }

  /**
   * Show dashboard
   */
  showDashboard() {
    document.getElementById('header').style.display = 'flex';
    document.getElementById('loginContainer').classList.remove('active');
    document.getElementById('dashboardContainer').classList.add('active');

    // Set user email in header
    const email = this.auth.getEmail();
    if (email) {
      document.getElementById('userEmail').textContent = email;
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    // Clear previous errors
    document.getElementById('emailError').classList.remove('show');
    document.getElementById('passwordError').classList.remove('show');

    // Validate inputs
    if (!email) {
      this.showError('emailError', 'El email es requerido');
      return;
    }

    if (!password) {
      this.showError('passwordError', 'La contraseña es requerida');
      return;
    }

    // Attempt login
    const loginSuccess = this.auth.login(email, password);

    if (loginSuccess) {
      // Clear form
      document.getElementById('loginForm').reset();

      // Show dashboard
      this.showDashboard();

      // Load leads
      await this.loadLeads();
    } else {
      this.showError('emailError', 'Credenciales inválidas. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Handle logout
   */
  handleLogout() {
    this.auth.logout();
    this.showLoginForm();
    this.leads = [];
  }

  /**
   * Show error message
   */
  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  /**
   * Load leads from API
   */
  async loadLeads() {
    const leadsLoading = document.getElementById('leadsLoading');
    const leadsTable = document.getElementById('leadsTable');
    const leadsEmpty = document.getElementById('leadsEmpty');

    // Show loading state
    leadsLoading.style.display = 'block';
    leadsTable.style.display = 'none';
    leadsEmpty.style.display = 'none';

    try {
      const response = await fetch('/api/leads?limit=1000');

      if (!response.ok) {
        throw new Error('Failed to load leads');
      }

      this.leads = await response.json();

      // Update stats
      this.updateStats();

      // Render leads
      if (this.leads.length > 0) {
        this.renderLeads();
        leadsTable.style.display = 'table';
      } else {
        leadsEmpty.style.display = 'block';
      }

      leadsLoading.style.display = 'none';
    } catch (error) {
      console.error('Error loading leads:', error);
      leadsLoading.innerHTML = '<p style="color: var(--red);">Error al cargar los leads. Por favor, intenta de nuevo.</p>';
    }
  }

  /**
   * Update statistics from leads data
   */
  updateStats() {
    // Reset stats
    this.stats = {
      totalLeads: 0,
      hotLeads: 0,
      contactedLeads: 0,
      scheduledLeads: 0,
    };

    // Calculate stats
    this.leads.forEach((lead) => {
      this.stats.totalLeads++;

      // Hot leads (score >= 90)
      if (lead.lead_score && lead.lead_score >= 90) {
        this.stats.hotLeads++;
      }

      // Contacted
      if (lead.status === 'contacted') {
        this.stats.contactedLeads++;
      }

      // Scheduled
      if (lead.status === 'scheduled') {
        this.stats.scheduledLeads++;
      }
    });

    // Update DOM
    document.getElementById('totalLeads').textContent = this.stats.totalLeads;
    document.getElementById('hotLeads').textContent = this.stats.hotLeads;
    document.getElementById('contactedLeads').textContent = this.stats.contactedLeads;
    document.getElementById('scheduledLeads').textContent = this.stats.scheduledLeads;
  }

  /**
   * Render leads in table
   */
  renderLeads() {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';

    this.leads.forEach((lead) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="lead-name">${this.escapeHtml(lead.name)}</td>
        <td class="lead-email">${this.escapeHtml(lead.email)}</td>
        <td class="lead-phone">${lead.phone ? this.escapeHtml(lead.phone) : '-'}</td>
        <td class="lead-budget">
          ${this.formatBudgetRange(lead.budget_min, lead.budget_max)}
        </td>
        <td>
          <span class="lead-score ${lead.lead_score >= 90 ? 'hot' : ''}">
            ${lead.lead_score ? Math.round(lead.lead_score) : '-'}
          </span>
        </td>
        <td>
          <span class="lead-status ${this.getStatusClass(lead.status)}">
            ${this.getStatusLabel(lead.status)}
          </span>
        </td>
        <td class="lead-actions">
          ${lead.phone ? `
            <button class="btn-action whatsapp" onclick="dashboard.contactLead('${lead.id}', '${this.escapeHtml(lead.phone)}')">
              WhatsApp
            </button>
          ` : '<span style="color: rgba(0,0,0,0.3)">Sin teléfono</span>'}
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  /**
   * Contact a lead via WhatsApp
   */
  contactLead(leadId, phone) {
    if (!phone) {
      alert('Este lead no tiene teléfono registrado');
      return;
    }

    // Format phone number for WhatsApp (remove any non-digits except + at start)
    let formattedPhone = phone.replace(/\D/g, '');

    // If it doesn't start with country code, assume Bolivia (+591)
    if (!formattedPhone.startsWith('591') && !formattedPhone.startsWith('1')) {
      formattedPhone = '591' + formattedPhone;
    }

    // Build WhatsApp URL with a default message
    const message = 'Hola! Soy agente de Montana Realty. Vi tu interés en propiedades. ¿Podemos agendar una llamada para hablar sobre tus opciones?';
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Helper: Escape HTML special characters
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Helper: Format budget range
   */
  formatBudgetRange(min, max) {
    if (!min && !max) return '-';

    const format = (val) => {
      if (!val) return '';
      return `$${(val / 1000).toFixed(0)}k`;
    };

    if (min && max) {
      return `${format(min)} - ${format(max)}`;
    }

    return format(min || max);
  }

  /**
   * Helper: Get status CSS class
   */
  getStatusClass(status) {
    const statusMap = {
      pending: 'pending',
      contacted: 'contacted',
      scheduled: 'scheduled',
      converted: 'scheduled',
    };
    return statusMap[status] || '';
  }

  /**
   * Helper: Get status label
   */
  getStatusLabel(status) {
    const statusMap = {
      pending: 'Pendiente',
      contacted: 'Contactado',
      scheduled: 'Cita Programada',
      converted: 'Convertido',
    };
    return statusMap[status] || 'Sin Asignar';
  }
}

// Initialize dashboard when DOM is ready
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new AdminDashboard();
});
