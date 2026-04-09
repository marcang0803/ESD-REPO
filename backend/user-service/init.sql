

CREATE DATABASE IF NOT EXISTS user_service_db;
USE user_service_db;


CREATE TABLE IF NOT EXISTS idempotency_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idem_key VARCHAR(100) NOT NULL UNIQUE,
    request_hash VARCHAR(64) NOT NULL,
    response_body TEXT NOT NULL,
    status_code INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL,
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    payout_account_id VARCHAR(100),
    provider_business_name VARCHAR(120),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- payout_account_id must be a real Stripe connected account ID in production.
-- For sandbox testing use: acct_test_... from your Stripe dashboard.
-- ─────────────────────────────────────────────
INSERT INTO users (id, name, email, phone, role, subscription_status, payout_account_id, provider_business_name)
VALUES 
  (1, 'Elena Lim', 'elena.lim.provider@example.com', '+6591234567', 'provider', 'ACTIVE', 'acct_1TBWluA7QXhkPxGZ', 'Elena Wellness Studio'),
  (2, 'Demo Provider', 'demo.provider@example.com', '+6590000000', 'provider', 'ACTIVE', 'acct_demo_connected_123', 'Demo Fitness Co.')
ON DUPLICATE KEY UPDATE
    name                  = VALUES(name),
    email                 = VALUES(email),
    payout_account_id     = VALUES(payout_account_id),
    provider_business_name = VALUES(provider_business_name);

-- ─────────────────────────────────────────────
-- Customer users (ids 1001-1010 match booking.sql user_id values)
-- ─────────────────────────────────────────────
INSERT INTO users (id, name, email, phone, role, subscription_status)
VALUES
  (1001, 'Elena Lim',     'elena.lim@example.com',     '+6598765432', 'customer', 'ACTIVE'),
  (1002, 'Carol Ng',    'carol.ng@example.com',     '+6581234567', 'customer', 'ACTIVE'),
  (1003, 'David Koh',   'david.koh@example.com',    '+6592345678', 'customer', 'ACTIVE'),
  (1004, 'Eve Wong',    'eve.wong@example.com',      '+6583456789', 'customer', 'ACTIVE'),
  (1005, 'Frank Ho',    'frank.ho@example.com',      '+6594567890', 'customer', 'ACTIVE'),
  (1006, 'Grace Lee',   'grace.lee@example.com',     '+6585678901', 'customer', 'ACTIVE'),
  (1007, 'Henry Chia',  'henry.chia@example.com',    '+6596789012', 'customer', 'ACTIVE'),
  (1008, 'Irene Yap',   'irene.yap@example.com',     '+6587890123', 'customer', 'ACTIVE'),
  (1009, 'James Teo',   'james.teo@example.com',     '+6598901234', 'customer', 'ACTIVE'),
  (1010, 'Karen Wee',   'karen.wee@example.com',     '+6589012345', 'customer', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);
