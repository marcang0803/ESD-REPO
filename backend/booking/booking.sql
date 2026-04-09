CREATE DATABASE IF NOT EXISTS booking;
USE booking;

-- All datetime values are stored and interpreted as Singapore Time (SGT, UTC+08:00).
CREATE TABLE IF NOT EXISTS booking (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    booked_at DATETIME NOT NULL,
    cancelled_at DATETIME NULL,
    completed_at DATETIME NULL,
    CONSTRAINT chk_booking_status CHECK (status IN ('booked', 'cancelled', 'completed'))
);

INSERT INTO booking (user_id, class_id, status, booked_at, cancelled_at, completed_at) VALUES
(1001, 101, 'booked', '2026-03-01 09:00:00', NULL, NULL),
(1002, 102, 'booked', '2026-03-02 10:30:00', NULL, NULL),
(1003, 103, 'booked', '2026-03-03 14:15:00', NULL, NULL),
(1004, 101, 'booked', '2026-03-04 16:45:00', NULL, NULL),
(1005, 104, 'cancelled', '2026-03-05 08:20:00', '2026-03-05 12:00:00', NULL),
(1006, 105, 'cancelled', '2026-03-06 11:10:00', '2026-03-06 18:35:00', NULL),
(1007, 102, 'cancelled', '2026-03-07 15:25:00', '2026-03-08 09:05:00', NULL),
(1008, 106, 'completed', '2026-03-08 07:40:00', NULL, '2026-03-08 19:10:00'),
(1009, 103, 'completed', '2026-03-09 13:55:00', NULL, '2026-03-10 08:30:00'),
(1010, 104, 'completed', '2026-03-10 17:05:00', NULL, '2026-03-11 10:50:00');
