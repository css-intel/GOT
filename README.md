# Nita Jr. Get On Through (G.O.T) Transportation

> Reliable ride booking web application for personal and medical courier transportation services.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express (via Netlify Functions)
- **Database:** PostgreSQL
- **Payments:** Stripe
- **Maps:** Google Maps Distance Matrix API
- **Hosting:** Netlify (full-stack)

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Google Maps API key (optional, uses fallback distance if not set)

### 1. Clone & Install

```bash
git clone <repo-url>
cd GOT
npm install
cd netlify/functions && npm install && cd ../..
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Database Setup

Run the schema against your PostgreSQL database:

```bash
psql -d your_database -f schema.sql
```

This creates all tables and a default admin user:
- Email: `admin@gottransportation.com`
- Password: `admin123` (change in production!)

### 4. Run Locally

```bash
npm run dev
```

Or with Netlify CLI for full-stack:

```bash
npx netlify dev
```

---

## Deployment to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Connect on Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo
4. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### 3. Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key |
| `SITE_URL` | Your Netlify site URL |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP email address |
| `SMTP_PASS` | SMTP password |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps key (frontend) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (frontend) |

### 4. PostgreSQL

Use a managed PostgreSQL service:
- [Neon](https://neon.tech) (free tier available)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- AWS RDS

---

## Stripe Webhook Configuration

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Project Structure

```
GOT/
├── index.html                    # HTML entry point
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── netlify.toml                  # Netlify deploy config
├── schema.sql                    # Database schema
├── .env.example                  # Environment template
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                  # React entry
│   ├── App.jsx                   # Routes & app shell
│   ├── index.css                 # Global styles
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── MvpContext.jsx        # MVP lock state
│   ├── utils/
│   │   └── api.js                # API client
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx        # Public layout
│   │   │   └── AdminLayout.jsx   # Admin sidebar layout
│   │   └── common/
│   │       └── MvpPaymentModal.jsx  # MVP gate popup
│   └── pages/
│       ├── Home.jsx              # Landing page
│       ├── Login.jsx             # Login form
│       ├── Register.jsx          # Registration form
│       ├── BookRide.jsx          # Ride booking form
│       ├── BookingConfirmation.jsx
│       ├── MyRides.jsx           # User ride history
│       ├── MvpSuccess.jsx        # MVP payment success
│       ├── MvpCancel.jsx         # MVP payment cancelled
│       └── admin/
│           ├── AdminDashboard.jsx
│           ├── AdminRides.jsx
│           └── AdminCustomers.jsx
└── netlify/
    └── functions/
        ├── package.json          # Backend dependencies
        ├── api.js                # Express API (serverless)
        ├── stripe-webhook.js     # Stripe webhook handler
        └── lib/
            ├── db.js             # PostgreSQL connection
            ├── auth.js           # JWT auth middleware
            └── email.js          # Email notifications
```

---

## Features

### Customer-Facing
- User registration & login (JWT auth)
- Ride booking with Google Maps autocomplete
- Real-time fare calculation (base $8 + $2.50/mile + $10 medical)
- Stripe payment integration
- Booking confirmation with email notification
- Ride history

### Admin Dashboard
- Secure admin login
- View all ride requests
- Change ride status (Pending → Confirmed → Completed / Cancelled)
- Customer list
- Revenue summary

### MVP Payment Gate
- 2-minute timer triggers payment modal overlay
- Processes $1,250 deposit (50% of $2,500)
- Stripe Checkout integration
- Backend webhook verification
- Demo mode watermark until payment confirmed
- Read-only admin until activated

---

## Fare Calculation

| Component | Rate |
|---|---|
| Base Fare | $8.00 |
| Per Mile | $2.50 |
| Medical Courier Surcharge | $10.00 (flat) |

**Example:** 10-mile personal ride = $8 + (10 × $2.50) = **$33.00**
**Example:** 10-mile medical courier = $8 + (10 × $2.50) + $10 = **$43.00**

---

## Security

- JWT authentication with 24h expiry
- bcrypt password hashing
- Input validation on all endpoints
- Stripe secret key server-side only
- Admin route protection
- CORS configured
- Environment variables for all secrets

---

## License

Private — Nita Jr. Get On Through (G.O.T) Transportation
