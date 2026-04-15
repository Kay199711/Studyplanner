import { API_BASE_URL } from './config.js';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  #getUserId() {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');
    return userId;
  }

  // Auth
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(name, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  // User
  async updateProfile(name, email) {
    const userId = this.#getUserId();
    return this.request(`/api/users/${userId}/profile`, {
      method: 'PATCH',
      body: { name, email },
    });
  }

  async updatePassword(currentPassword, newPassword, confirmPassword) {
    const userId = this.#getUserId();
    return this.request(`/api/users/${userId}/password`, {
      method: 'PATCH',
      body: { currentPassword, newPassword, confirmPassword },
    });
  }

  // Shelf
  async getShelfItems() {
    return this.request('/api/shelf');
  }

  async addShelfYoutube(url) {
    return this.request('/api/shelf', {
      method: 'POST',
      body: { type: 'youtube', url },
    });
  }

  async addShelfPdf(fileData, fileName) {
    return this.request('/api/shelf', {
      method: 'POST',
      body: { type: 'pdf', fileData, fileName },
    });
  }

  async updateShelfItem(id, fileName) {
    return this.request(`/api/shelf/${id}`, {
      method: 'PATCH',
      body: { fileName },
    });
  }

  async deleteShelfItem(id) {
    return this.request(`/api/shelf/${id}`, { method: 'DELETE' });
  }

  // Notes
  async getNotes() {
    return this.request('/api/notes');
  }

  async createNote(content, color, pinned = 0, title = '') {
    return this.request('/api/notes', {
      method: 'POST',
      body: { title, content, color, pinned },
    });
  }

  async updateNote(id, content, color, pinned, title) {
    return this.request(`/api/notes/${id}`, {
      method: 'PUT',
      body: { title, content, color, Pinned: pinned },
    });
  }

  async deleteNote(id) {
    return this.request(`/api/notes/${id}`, { method: 'DELETE' });
  }

  // Calendar Events
  async getEvents() {
    return this.request('/api/events');
  }

  async createEvent(title, start_date, end_date, all_day = false, description = null) {
    return this.request('/api/events', {
      method: 'POST',
      body: { title, start_date, end_date, all_day, description },
    });
  }

  async updateEvent(id, fields) {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: fields,
    });
  }

  async deleteEvent(id) {
    return this.request(`/api/events/${id}`, { method: 'DELETE' });
  }
}

export default new ApiClient();
