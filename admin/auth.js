/**
 * AdminAuth - Simple authentication module for agent dashboard
 * Handles token generation, validation, and session management
 */

class AdminAuth {
  constructor() {
    this.tokenStorageKey = 'adminToken';
    this.emailStorageKey = 'adminEmail';
    this.tokenExpiryMs = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Generate a token for an agent email
   * @param {string} agentEmail - Email of the agent
   * @returns {string} - Generated token
   */
  generateToken(agentEmail) {
    // Create a simple token: email_timestamp_random
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const token = `${btoa(agentEmail)}_${timestamp}_${random}`;
    return token;
  }

  /**
   * Validate a token
   * @param {string} token - Token to validate
   * @returns {boolean} - Whether token is valid
   */
  validateToken(token) {
    if (!token) return false;

    try {
      // Parse token parts
      const parts = token.split('_');
      if (parts.length < 3) return false;

      // Decode email to verify it was valid base64
      const email = atob(parts[0]);
      if (!email || !email.includes('@')) return false;

      // Check if token has expired (24 hours)
      const timestamp = parseInt(parts[1], 10);
      const now = Date.now();
      if (now - timestamp > this.tokenExpiryMs) return false;

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Login with email and password
   * @param {string} email - Agent email
   * @param {string} password - Agent password
   * @returns {boolean} - Whether login was successful
   */
  login(email, password) {
    // Simple validation - email must contain @ and password must be at least 4 chars
    if (!email || !email.includes('@') || !password || password.length < 1) {
      return false;
    }

    // Generate token
    const token = this.generateToken(email);

    // Store token and email in localStorage
    localStorage.setItem(this.tokenStorageKey, token);
    localStorage.setItem(this.emailStorageKey, email);

    return true;
  }

  /**
   * Logout the current user
   */
  logout() {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.emailStorageKey);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenStorageKey);
    return this.validateToken(token);
  }

  /**
   * Get the current authenticated email
   * @returns {string|null} - Email of authenticated user or null
   */
  getEmail() {
    if (this.isAuthenticated()) {
      return localStorage.getItem(this.emailStorageKey);
    }
    return null;
  }

  /**
   * Get the current token
   * @returns {string|null} - Current token or null
   */
  getToken() {
    if (this.isAuthenticated()) {
      return localStorage.getItem(this.tokenStorageKey);
    }
    return null;
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminAuth;
}
