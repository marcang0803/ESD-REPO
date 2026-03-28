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
    hold_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    customer_id INT NOT NULL,
    expiry_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Class(class_id)
);
