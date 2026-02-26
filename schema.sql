-- G.O.T Transportation Database Schema
-- Supabase / PostgreSQL

-- Enable UUID extension (enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 7),
  pickup_lng DECIMAL(10, 7),
  dropoff_lat DECIMAL(10, 7),
  dropoff_lng DECIMAL(10, 7),
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('personal', 'medical_courier')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  is_asap BOOLEAN DEFAULT true,
  distance_miles DECIMAL(8, 2),
  fare_amount DECIMAL(10, 2) NOT NULL,
  base_fare DECIMAL(10, 2) DEFAULT 8.00,
  per_mile_rate DECIMAL(10, 2) DEFAULT 2.50,
  medical_surcharge DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method VARCHAR(50) DEFAULT 'venmo',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MVP Payment tracking
CREATE TABLE mvp_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payer_email VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'venmo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- App settings (for MVP lock state)
CREATE TABLE app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES ('mvp_unlocked', 'false');
INSERT INTO app_settings (key, value) VALUES ('mvp_payment_amount', '45000');

-- Create default admin user (password: admin123 - change in production!)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('admin@gottransportation.com', '$2a$10$Hmf2pmnRb/jEu8gYFy/VTOM8ZYT6haGfpRgw8ic4inRlhxpilb6YG', 'Admin', 'GOT', 'admin');

-- Indexes
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_users_email ON users(email);
