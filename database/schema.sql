CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff') DEFAULT 'customer'
);

CREATE TABLE individual (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    id_proof VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE group_booking (
    customer_id INT PRIMARY KEY,
    booking_person_name VARCHAR(100) NOT NULL,
    booking_person_age INT,
    booking_person_id VARCHAR(50),
    number_of_members INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE restaurant_table (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    seating_capacity INT NOT NULL,
    table_status ENUM('available', 'reserved', 'occupied') DEFAULT 'available'
);

CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    table_id INT,
    staff_id INT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    no_of_guests INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_table(table_id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE bill (
    bill_no INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id) ON DELETE CASCADE
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_no INT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'upi') NOT NULL,
    payment_status ENUM('pending', 'successful') NOT NULL DEFAULT 'successful',
    FOREIGN KEY (bill_no) REFERENCES bill(bill_no) ON DELETE CASCADE
);

-- NOTE: If upgrading an existing DB, run:
-- ALTER TABLE payment ADD COLUMN payment_status ENUM('pending', 'successful') DEFAULT 'successful' AFTER payment_method;
