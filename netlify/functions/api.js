import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pool from './lib/db.js';
import { generateToken, authMiddleware, adminMiddleware } from './lib/auth.js';
import { sendBookingConfirmation } from './lib/email.js';

const app = express();
const VENMO_USERNAME = 'Dexter-Price-3';

app.use(cors());
app.use(express.json());

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'G.O.T Transportation API' });
});

// ─── AUTH ROUTES ───
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email.toLowerCase(), passwordHash, firstName, lastName, phone || null]
    );

    const user = result.rows[0];
    const token = generateToken(user);
    res.status(201).json({ user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = result.rows[0];
    res.json({ id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name, phone: u.phone, role: u.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── FARE CALCULATION ───
app.post('/api/fare/estimate', async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, serviceType } = req.body;
    if (!pickupAddress || !dropoffAddress || !serviceType) {
      return res.status(400).json({ error: 'Pickup, dropoff, and service type are required' });
    }

    let distanceMiles = 5; // Default fallback

    // Try Google Maps Distance Matrix API
    if (process.env.GOOGLE_MAPS_API_KEY) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickupAddress)}&destinations=${encodeURIComponent(dropoffAddress)}&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.rows?.[0]?.elements?.[0]?.status === 'OK') {
          distanceMiles = data.rows[0].elements[0].distance.value / 1609.34;
        }
      } catch (e) {
        console.warn('Google Maps API error, using fallback distance:', e.message);
      }
    }

    const baseFare = 8.0;
    const perMileRate = 2.5;
    const medicalSurcharge = serviceType === 'medical_courier' ? 10.0 : 0;
    const fareAmount = baseFare + (perMileRate * distanceMiles) + medicalSurcharge;

    res.json({
      distanceMiles: Math.round(distanceMiles * 100) / 100,
      baseFare,
      perMileRate,
      medicalSurcharge,
      fareAmount: Math.round(fareAmount * 100) / 100,
    });
  } catch (err) {
    console.error('Fare estimate error:', err);
    res.status(500).json({ error: 'Failed to calculate fare' });
  }
});

// ─── RIDE BOOKING ───
app.post('/api/rides', authMiddleware, async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, serviceType, scheduledAt, isAsap, distanceMiles, fareAmount } = req.body;

    if (!pickupAddress || !dropoffAddress || !serviceType || fareAmount == null) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const medicalSurcharge = serviceType === 'medical_courier' ? 10.0 : 0;

    const result = await pool.query(
      `INSERT INTO rides (user_id, pickup_address, dropoff_address, service_type, scheduled_at, is_asap, distance_miles, fare_amount, base_fare, per_mile_rate, medical_surcharge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [req.user.id, pickupAddress, dropoffAddress, serviceType, scheduledAt || null, isAsap !== false, distanceMiles || 0, fareAmount, 8.0, 2.5, medicalSurcharge]
    );

    const ride = result.rows[0];

    // Send booking confirmation email
    try {
      await sendBookingConfirmation(req.user.email, ride);
    } catch (emailErr) {
      console.warn('Email send failed:', emailErr.message);
    }

    // Build Venmo deep link with pre-filled info
    const venmoNote = `GOT Transportation Ride #${ride.id.slice(0, 8).toUpperCase()} - ${serviceType === 'medical_courier' ? 'Medical Courier' : 'Personal'}`;
    const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=${fareAmount.toFixed(2)}&note=${encodeURIComponent(venmoNote)}`;

    res.status(201).json({
      ride,
      venmoUrl,
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/api/rides', authMiddleware, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query = `SELECT r.*, u.email, u.first_name, u.last_name, u.phone 
               FROM rides r LEFT JOIN users u ON r.user_id = u.id 
               ORDER BY r.created_at DESC`;
      params = [];
    } else {
      query = 'SELECT * FROM rides WHERE user_id = $1 ORDER BY created_at DESC';
      params = [req.user.id];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch rides error:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

app.patch('/api/rides/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if MVP is unlocked
    const setting = await pool.query("SELECT value FROM app_settings WHERE key = 'mvp_unlocked'");
    if (setting.rows[0]?.value !== 'true') {
      return res.status(403).json({ error: 'Demo mode - MVP payment required to modify rides' });
    }

    const result = await pool.query(
      'UPDATE rides SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ride not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update ride status error:', err);
    res.status(500).json({ error: 'Failed to update ride' });
  }
});

// ─── ADMIN ROUTES ───
app.get('/api/admin/customers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/admin/revenue', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalResult = await pool.query(
      "SELECT COALESCE(SUM(fare_amount), 0) as total FROM rides WHERE status = 'completed'"
    );
    const countResult = await pool.query('SELECT COUNT(*) as count FROM rides');
    const completedResult = await pool.query("SELECT COUNT(*) as count FROM rides WHERE status = 'completed'");
    const pendingResult = await pool.query("SELECT COUNT(*) as count FROM rides WHERE status = 'pending'");

    res.json({
      totalRevenue: parseFloat(totalResult.rows[0].total),
      totalRides: parseInt(countResult.rows[0].count),
      completedRides: parseInt(completedResult.rows[0].count),
      pendingRides: parseInt(pendingResult.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

app.get('/api/admin/mvp-status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM app_settings WHERE key = 'mvp_unlocked'");
    res.json({ unlocked: result.rows[0]?.value === 'true' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check MVP status' });
  }
});

// ─── MVP PAYMENT (Venmo) ───
app.get('/api/mvp/venmo-link', (req, res) => {
  const venmoNote = 'GOT Transportation MVP Development Fee - 50% Deposit';
  const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=450.00&note=${encodeURIComponent(venmoNote)}`;
  res.json({ venmoUrl, venmoUsername: VENMO_USERNAME, amount: 450.00 });
});

// Admin manually confirms MVP payment was received via Venmo
app.post('/api/mvp/confirm', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query("UPDATE app_settings SET value = 'true', updated_at = NOW() WHERE key = 'mvp_unlocked'");
    res.json({ unlocked: true });
  } catch (err) {
    console.error('MVP confirm error:', err);
    res.status(500).json({ error: 'Failed to confirm MVP payment' });
  }
});

// ─── ADMIN: MANUAL PAYMENT CONFIRM (Venmo received) ───
app.patch('/api/rides/:id/confirm-payment', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE rides SET payment_status = 'paid', status = 'confirmed', updated_at = NOW() WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ride not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export const handler = serverless(app);
