// ═══════════════════════════════════════════════════════════════
// G.O.T Transportation — Full Mock Backend (localStorage)
// Complete working prototype — no server needed
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  USERS: 'got_users',
  RIDES: 'got_rides',
  TOKEN: 'got_token',
  CURRENT_USER: 'got_current_user',
  MVP: 'got_mvp_unlocked',
  FEEDBACK: 'got_client_feedback',
};

// ── Helpers ──────────────────────────────────────────────────────
function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getStore(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function delay(ms = 400) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 300));
}

// ── Seed admin + demo user on first load ─────────────────────
function seedData() {
  const users = getStore(STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const now = new Date().toISOString();
    setStore(STORAGE_KEYS.USERS, [
      {
        id: uid(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gottransportation.com',
        phone: '(803) 555-0100',
        password: 'admin123',
        role: 'admin',
        created_at: now,
      },
      {
        id: uid(),
        firstName: 'Demo',
        lastName: 'Rider',
        email: 'demo@example.com',
        phone: '(803) 555-0199',
        password: 'demo123',
        role: 'user',
        created_at: now,
      },
      {
        id: uid(),
        firstName: 'Dexter',
        lastName: 'Price',
        email: 'cssdex',
        phone: '(803) 555-0001',
        password: 'Nordstrom1!$$!',
        role: 'developer',
        created_at: now,
      },
    ]);
  }

  const rides = getStore(STORAGE_KEYS.RIDES);
  if (rides.length === 0) {
    const users2 = getStore(STORAGE_KEYS.USERS);
    const demoUser = users2.find(u => u.role === 'user');
    if (demoUser) {
      const now = new Date();
      setStore(STORAGE_KEYS.RIDES, [
        {
          id: uid(),
          user_id: demoUser.id,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          email: demoUser.email,
          phone: demoUser.phone,
          pickup_address: '1600 Main St, Columbia, SC 29201',
          dropoff_address: '700 Gervais St, Columbia, SC 29201',
          service_type: 'personal',
          is_asap: true,
          scheduled_at: null,
          distance_miles: 3.2,
          fare_amount: 16.00,
          status: 'completed',
          payment_method: 'venmo',
          payment_status: 'paid',
          created_at: new Date(now - 86400000 * 3).toISOString(),
        },
        {
          id: uid(),
          user_id: demoUser.id,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          email: demoUser.email,
          phone: demoUser.phone,
          pickup_address: '2800 Devine St, Columbia, SC 29205',
          dropoff_address: 'Prisma Health Richland Hospital, Columbia, SC 29203',
          service_type: 'medical_courier',
          is_asap: false,
          scheduled_at: new Date(now - 86400000).toISOString(),
          distance_miles: 5.8,
          fare_amount: 32.50,
          status: 'confirmed',
          payment_method: 'venmo',
          payment_status: 'pending',
          created_at: new Date(now - 86400000).toISOString(),
        },
        {
          id: uid(),
          user_id: demoUser.id,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          email: demoUser.email,
          phone: demoUser.phone,
          pickup_address: '5 Points, Columbia, SC 29205',
          dropoff_address: 'Columbia Metropolitan Airport, SC 29170',
          service_type: 'personal',
          is_asap: true,
          scheduled_at: null,
          distance_miles: 12.4,
          fare_amount: 39.00,
          status: 'pending',
          payment_method: 'venmo',
          payment_status: 'pending',
          created_at: new Date(now - 3600000).toISOString(),
        },
      ]);
    }
  }
}

seedData();

// Auto-unlock MVP for demo so all admin features work
if (!localStorage.getItem(STORAGE_KEYS.MVP)) {
  localStorage.setItem(STORAGE_KEYS.MVP, 'true');
}

// ═══════════════════════════════════════════════════════════════
// API Client — complete mock matching real backend interface
// ═══════════════════════════════════════════════════════════════

class ApiClient {
  constructor() {
    this.token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  _currentUser() {
    if (!this.token) return null;
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    } catch {
      return null;
    }
  }

  // ── Auth ───────────────────────────────────────────────────────

  async register(data) {
    await delay();
    const users = getStore(STORAGE_KEYS.USERS);

    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      id: uid(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || '',
      password: data.password,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setStore(STORAGE_KEYS.USERS, users);

    const token = `mock_token_${newUser.id}_${Date.now()}`;
    const safeUser = { ...newUser };
    delete safeUser.password;

    this.setToken(token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));

    return { token, user: safeUser };
  }

  async login(data) {
    await delay();
    const users = getStore(STORAGE_KEYS.USERS);
    const user = users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const safeUser = { ...user };
    delete safeUser.password;

    this.setToken(token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));

    return { token, user: safeUser };
  }

  async getMe() {
    await delay(200);
    const user = this._currentUser();
    if (!user) throw new Error('Not authenticated');
    return user;
  }

  // ── Fare Estimation ────────────────────────────────────────────

  async estimateFare(data) {
    await delay(600);
    const seed = (data.pickupAddress.length + data.dropoffAddress.length) % 20;
    const distanceMiles = Math.max(1.5, (seed * 0.7) + 2.3);
    const roundedDistance = Math.round(distanceMiles * 10) / 10;

    const baseFare = 8.0;
    const perMileRate = 2.5;
    const medicalSurcharge = data.serviceType === 'medical_courier' ? 10.0 : 0;
    const fareAmount = Math.round((baseFare + roundedDistance * perMileRate + medicalSurcharge) * 100) / 100;

    return {
      distanceMiles: roundedDistance,
      baseFare,
      perMileRate,
      medicalSurcharge,
      fareAmount,
    };
  }

  // ── Rides ──────────────────────────────────────────────────────

  async createRide(data) {
    await delay();
    const user = this._currentUser();
    if (!user) throw new Error('Not authenticated');

    const VENMO_USERNAME = 'Dexter-Price-3';

    const ride = {
      id: uid(),
      user_id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      pickup_address: data.pickupAddress,
      dropoff_address: data.dropoffAddress,
      service_type: data.serviceType,
      is_asap: data.isAsap,
      scheduled_at: data.scheduledAt || null,
      distance_miles: data.distanceMiles,
      fare_amount: data.fareAmount,
      status: 'pending',
      payment_method: 'venmo',
      payment_status: 'pending',
      driver_name: null,
      driver_eta: null,
      created_at: new Date().toISOString(),
    };

    const rides = getStore(STORAGE_KEYS.RIDES);
    rides.unshift(ride);
    setStore(STORAGE_KEYS.RIDES, rides);

    setTimeout(() => {
      const currentRides = getStore(STORAGE_KEYS.RIDES);
      const idx = currentRides.findIndex(r => r.id === ride.id);
      if (idx !== -1 && currentRides[idx].status === 'pending') {
        currentRides[idx].status = 'confirmed';
        currentRides[idx].driver_name = 'Marcus J.';
        currentRides[idx].driver_eta = Math.floor(Math.random() * 10) + 5;
        setStore(STORAGE_KEYS.RIDES, currentRides);
      }
    }, 3000);

    const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=${data.fareAmount}&note=${encodeURIComponent(`GOT Transportation Ride #${ride.id.slice(0, 8).toUpperCase()}`)}`;

    return { ride, venmoUrl };
  }

  async getRides() {
    await delay(300);
    const user = this._currentUser();
    if (!user) throw new Error('Not authenticated');

    const rides = getStore(STORAGE_KEYS.RIDES);

    if (user.role === 'admin') {
      return rides.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return rides
      .filter(r => r.user_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async getRide(id) {
    await delay(200);
    const rides = getStore(STORAGE_KEYS.RIDES);
    const ride = rides.find(r => r.id === id);
    if (!ride) throw new Error('Ride not found');
    return ride;
  }

  async updateRideStatus(id, status) {
    await delay();
    const rides = getStore(STORAGE_KEYS.RIDES);
    const idx = rides.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Ride not found');

    rides[idx].status = status;
    if (status === 'completed' && rides[idx].payment_status === 'pending') {
      rides[idx].payment_status = 'paid';
    }
    setStore(STORAGE_KEYS.RIDES, rides);
    return rides[idx];
  }

  async confirmPayment(rideId) {
    await delay();
    const rides = getStore(STORAGE_KEYS.RIDES);
    const idx = rides.findIndex(r => r.id === rideId);
    if (idx === -1) throw new Error('Ride not found');

    rides[idx].payment_status = 'paid';
    if (rides[idx].status === 'pending') {
      rides[idx].status = 'confirmed';
    }
    setStore(STORAGE_KEYS.RIDES, rides);
    return rides[idx];
  }

  // ── Admin ──────────────────────────────────────────────────────

  async getCustomers() {
    await delay(300);
    const users = getStore(STORAGE_KEYS.USERS);
    return users
      .filter(u => u.role !== 'admin')
      .map(u => ({
        id: u.id,
        first_name: u.firstName,
        last_name: u.lastName,
        email: u.email,
        phone: u.phone,
        created_at: u.created_at,
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async getRevenue() {
    await delay(300);
    const rides = getStore(STORAGE_KEYS.RIDES);

    const totalRides = rides.length;
    const completedRides = rides.filter(r => r.status === 'completed').length;
    const pendingRides = rides.filter(r => r.status === 'pending' || r.status === 'confirmed').length;
    const cancelledRides = rides.filter(r => r.status === 'cancelled').length;
    const totalRevenue = rides
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + parseFloat(r.fare_amount), 0);

    return { totalRides, completedRides, pendingRides, cancelledRides, totalRevenue };
  }

  async getMvpStatus() {
    await delay(200);
    return { unlocked: localStorage.getItem(STORAGE_KEYS.MVP) === 'true' };
  }

  // ── MVP Payment ────────────────────────────────────────────────

  async getMvpVenmoLink() {
    await delay(200);
    return {
      url: `https://venmo.com/?txn=pay&audience=private&recipients=Dexter-Price-3&amount=450.00&note=${encodeURIComponent('GOT Transportation - Interface Development Payment')}`,
    };
  }

  async confirmMvpPayment() {
    await delay();
    localStorage.setItem(STORAGE_KEYS.MVP, 'true');
    return { success: true };
  }

  // ── Feedback ───────────────────────────────────────────────────

  async getFeedback() {
    await delay(200);
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async deleteFeedback(id) {
    await delay();
    const items = await this.getFeedback();
    const updated = items.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated));
    return { success: true };
  }
}

const api = new ApiClient();
export default api;
