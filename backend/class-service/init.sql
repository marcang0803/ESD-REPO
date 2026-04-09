CREATE DATABASE IF NOT EXISTS classservice;
USE classservice;

CREATE TABLE IF NOT EXISTS Class (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INT NOT NULL,
    capacity INT NOT NULL,
    available_slots INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ClassHold (
    hold_id VARCHAR(50) PRIMARY KEY,
    class_id INT NOT NULL,
    user_id INT NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    expiry_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Class(class_id)
);

INSERT INTO Class (class_id, customer_id, class_name, date, start_time, duration, capacity, available_slots, status, location) VALUES
(101, 1, 'Morning Reformer', '2026-04-11', '08:30:00', 50, 16, 8, 'Scheduled', 'Studio A, West Mall'),
(102, 1, 'Ignite HIIT', '2026-04-12', '19:00:00', 40, 20, 2, 'Scheduled', 'Skyline Studio, ION Orchard'),
(103, 1, 'Lunar Yin Yoga', '2026-04-13', '18:30:00', 60, 18, 5, 'Scheduled', 'Moon Hall, Riverfront'),
(104, 1, 'Sunrise Flow', '2026-04-10', '07:00:00', 55, 15, 6, 'Scheduled', 'Studio B, West Mall'),
(105, 1, 'Core Sculpt', '2026-04-09', '17:30:00', 45, 15, 3, 'Scheduled', 'Studio C, Orchard'),
(106, 1, 'Evening Stretch', '2026-04-08', '18:00:00', 45, 12, 4, 'Scheduled', 'Skyline Studio, ION Orchard'),
(107, 1, 'Solar Gratitude', '2026-04-09', '06:15:00', 45, 12, 10, 'Completed', 'Studio A, West Mall'),
(108, 1, 'Lunar Breath', '2026-04-07', '21:30:00', 20, 10, 8, 'Completed', 'Moon Hall, Riverfront')
ON DUPLICATE KEY UPDATE class_id = class_id;
