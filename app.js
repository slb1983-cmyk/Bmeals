// ══════════════════════════════════════════
//  Bryn's Meal Planning — App Data Layer
//  Uses localStorage as the data store
// ══════════════════════════════════════════

const DB = {
  // ── Keys ──
  KEYS: {
    clients: 'bryn_clients',
    recipes: 'bryn_recipes',
    session: 'bryn_session',
    swapRequests: 'bryn_swaps',
  },

  // ── Seed data on first load ──
  init() {
    if (!localStorage.getItem(this.KEYS.clients)) {
      localStorage.setItem(this.KEYS.clients, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.recipes)) {
      localStorage.setItem(this.KEYS.recipes, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.swapRequests)) {
      localStorage.setItem(this.KEYS.swapRequests, JSON.stringify([]));
    }
  },

  // ── Helpers ──
  currentWeekDate() {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay()); // Sunday
    return d.toISOString().split('T')[0];
  },
  nextSunday() {
    const d = new Date();
    const daysUntilSunday = 7 - d.getDay();
    d.setDate(d.getDate() + daysUntilSunday);
    return d.toISOString().split('T')[0];
  },
  formatDate(str) {
    if (!str) return '—';
    return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  },

  // ── CRUD ──
  getClients() { return JSON.parse(localStorage.getItem(this.KEYS.clients) || '[]'); },
  saveClients(clients) { localStorage.setItem(this.KEYS.clients, JSON.stringify(clients)); },
  getClient(id) { return this.getClients().find(c => c.id === id) || null; },
  updateClient(id, updates) {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) { clients[idx] = { ...clients[idx], ...updates }; this.saveClients(clients); return clients[idx]; }
    return null;
  },

  getRecipes() { return JSON.parse(localStorage.getItem(this.KEYS.recipes) || '[]'); },
  saveRecipes(recipes) { localStorage.setItem(this.KEYS.recipes, JSON.stringify(recipes)); },
  getClientRecipes(clientId) {
    return this.getRecipes().filter(r => r.clientId === clientId)
      .sort((a, b) => b.weekOf.localeCompare(a.weekOf));
  },
  getCurrentWeekRecipes(clientId) {
    const week = this.currentWeekDate();
    return this.getRecipes().find(r => r.clientId === clientId && r.weekOf === week) || null;
  },

  getSwapRequests() { return JSON.parse(localStorage.getItem(this.KEYS.swapRequests) || '[]'); },
  addSwapRequest(req) {
    const swaps = this.getSwapRequests();
    req.id = 'swap_' + Date.now();
    req.date = new Date().toISOString();
    req.status = 'pending';
    swaps.push(req);
    localStorage.setItem(this.KEYS.swapRequests, JSON.stringify(swaps));
    return req;
  },
  updateSwapStatus(id, status) {
    const swaps = this.getSwapRequests();
    const idx = swaps.findIndex(s => s.id === id);
    if (idx !== -1) { swaps[idx].status = status; localStorage.setItem(this.KEYS.swapRequests, JSON.stringify(swaps)); }
  },

  // ── Auth ──
  loginClient(email, password) {
    const clients = this.getClients();
    return clients.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password) || null;
  },
  loginAdmin(password) {
    return password === 'bryn_admin_2024';
  },
  setSession(data) { localStorage.setItem(this.KEYS.session, JSON.stringify(data)); },
  getSession() { return JSON.parse(localStorage.getItem(this.KEYS.session) || 'null'); },
  clearSession() { localStorage.removeItem(this.KEYS.session); },

  // ── Admin: add new recipe week ──
  addWeeklyRecipes(clientId, weekOf, recipes, brynsNote) {
    const all = this.getRecipes();
    // Remove existing for this week/client
    const filtered = all.filter(r => !(r.clientId === clientId && r.weekOf === weekOf));
    filtered.push({ id: 'r_' + Date.now(), weekOf, clientId, recipes, brynsNote });
    this.saveRecipes(filtered);
  },

  // ── New client signup ──
  addClient(data) {
    const clients = this.getClients();
    const client = {
      id: 'client_' + Date.now(),
      ...data,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      nextBillingDate: this.nextSunday(),
      weeklyRate: data.plan === 'premium' ? 12 : 10,
      notes: ''
    };
    clients.push(client);
    this.saveClients(clients);
    return client;
  }
};

// Auto-init
DB.init();

// Auto-init
DB.init();
