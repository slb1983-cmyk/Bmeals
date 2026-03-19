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
      const clients = [
        {
          id: 'client_001',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '412-555-0101',
          password: 'sarah2024',
          plan: 'premium',
          familySize: 4,
          dietaryRestrictions: 'Nut allergy',
          deliveryMethod: 'email',
          groceryStore: 'Giant Eagle',
          status: 'active',
          joinDate: '2024-11-01',
          venmo: '@sarah-johnson-412',
          nextBillingDate: this.nextSunday(),
          weeklyRate: 12,
          notes: ''
        },
        {
          id: 'client_002',
          name: 'Mike & Dana Torres',
          email: 'dana@example.com',
          phone: '412-555-0202',
          password: 'torres2024',
          plan: 'basic',
          familySize: 2,
          dietaryRestrictions: 'Vegetarian',
          deliveryMethod: 'text',
          groceryStore: 'Whole Foods',
          status: 'active',
          joinDate: '2024-12-15',
          venmo: '@dana-torres',
          nextBillingDate: this.nextSunday(),
          weeklyRate: 10,
          notes: ''
        }
      ];
      localStorage.setItem(this.KEYS.clients, JSON.stringify(clients));
    }

    if (!localStorage.getItem(this.KEYS.recipes)) {
      const recipes = [
        {
          id: 'r001',
          weekOf: this.currentWeekDate(),
          clientId: 'client_001',
          recipes: [
            {
              title: 'Lemon Herb Roasted Chicken',
              description: 'Tender roasted chicken with fresh herbs, lemon zest, and garlic over roasted root vegetables.',
              prepTime: '15 min',
              cookTime: '55 min',
              servings: 4,
              tags: ['protein', 'gluten-free'],
              ingredients: ['Whole chicken', 'Lemon', 'Fresh rosemary', 'Garlic cloves', 'Carrots', 'Potatoes', 'Olive oil', 'Sea salt'],
              swapped: false
            },
            {
              title: 'Tuscan White Bean Soup',
              description: 'Hearty, warming soup with cannellini beans, kale, and sun-dried tomatoes in a rich vegetable broth.',
              prepTime: '10 min',
              cookTime: '30 min',
              servings: 4,
              tags: ['vegetarian', 'high-fiber'],
              ingredients: ['Cannellini beans', 'Kale', 'Sun-dried tomatoes', 'Vegetable broth', 'Garlic', 'Onion', 'Fresh thyme'],
              swapped: false
            },
            {
              title: 'Maple Glazed Salmon',
              description: 'Pan-seared salmon with a maple-dijon glaze, served with quinoa and steamed asparagus.',
              prepTime: '10 min',
              cookTime: '20 min',
              servings: 4,
              tags: ['omega-3', 'gluten-free'],
              ingredients: ['Salmon fillets', 'Pure maple syrup', 'Dijon mustard', 'Quinoa', 'Asparagus', 'Lemon', 'Olive oil'],
              swapped: false
            }
          ],
          brynsNote: 'Enjoying this gorgeous spring weather! This week\'s menu is fresh and light. 🌿'
        },
        {
          id: 'r002',
          weekOf: this.currentWeekDate(),
          clientId: 'client_002',
          recipes: [
            {
              title: 'Spring Vegetable Frittata',
              description: 'A fluffy oven-baked egg dish loaded with asparagus, peas, goat cheese, and fresh mint.',
              prepTime: '10 min',
              cookTime: '25 min',
              servings: 2,
              tags: ['vegetarian', 'high-protein'],
              ingredients: ['Eggs', 'Asparagus', 'Peas', 'Goat cheese', 'Fresh mint', 'Shallot', 'Olive oil'],
              swapped: false
            },
            {
              title: 'Mushroom & Lentil Bolognese',
              description: 'A deeply savory plant-based bolognese using portobello mushrooms and green lentils over pasta.',
              prepTime: '15 min',
              cookTime: '40 min',
              servings: 2,
              tags: ['vegetarian', 'high-fiber'],
              ingredients: ['Portobello mushrooms', 'Green lentils', 'Whole wheat pasta', 'Crushed tomatoes', 'Carrot', 'Celery', 'Fresh basil'],
              swapped: false
            },
            {
              title: 'Thai Peanut Buddha Bowl',
              description: 'Colorful roasted veggies, brown rice, edamame, and a creamy peanut-lime dressing.',
              prepTime: '15 min',
              cookTime: '30 min',
              servings: 2,
              tags: ['vegetarian', 'gluten-free'],
              ingredients: ['Brown rice', 'Edamame', 'Red cabbage', 'Cucumber', 'Carrots', 'Natural peanut butter', 'Lime', 'Ginger', 'Tamari'],
              swapped: false
            }
          ],
          brynsNote: 'Three beautiful plant-based meals for you this week — all big on flavor and easy on prep! 🌱'
        }
      ];
      localStorage.setItem(this.KEYS.recipes, JSON.stringify(recipes));
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
