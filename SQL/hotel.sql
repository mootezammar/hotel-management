-- Guests Table
CREATE TABLE Guests (
    guest_id SERIAL PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Guests
ALTER COLUMN guest_id TYPE VARCHAR(50);

ALTER TABLE Bookings DROP CONSTRAINT bookings_guest_id_fkey;
ALTER TABLE Bookings ALTER COLUMN guest_id TYPE VARCHAR(50);

ALTER TABLE Bookings 
ADD CONSTRAINT bookings_guest_id_fkey 
FOREIGN KEY (guest_id) REFERENCES Guests(guest_id);
-- Rooms Table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Table
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES Guests(guest_id) ON DELETE CASCADE,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------------

INSERT INTO Guests (guest_name, email, phone) VALUES
('mootez ammar', 'mootez@gmail.com.com', '+21697528941');

INSERT INTO Rooms (room_number, room_type, price_per_night) VALUES
('101', 'Single', 100.00);

INSERT INTO Staff (staff_name, role, email, phone) VALUES
('sami bannour', 'Receptionist', 'sami@gmail.com', '+21697528941');

INSERT INTO Bookings (guest_id, room_id, check_in_date, check_out_date, total_price) VALUES
(1, 1, '2023-10-01', '2023-10-05', 400.00);
INSERT INTO Payments (booking_id, amount, payment_method) VALUES
(1, 400.00, 'Credit Card');


SELECT * FROM Guests;


SELECT * FROM Rooms;


SELECT * FROM Staff;


SELECT * FROM Bookings;


SELECT * FROM Payments;

SELECT 
    b.booking_id, 
    g.guest_name, 
    r.room_number, 
    r.room_type, 
    b.check_in_date, 
    b.check_out_date, 
    b.total_price
FROM Bookings b
JOIN Guests g ON b.guest_id = g.guest_id
JOIN Rooms r ON b.room_id = r.room_id;

SELECT 
    g.guest_name, 
    p.amount
FROM Payments p
JOIN Bookings b ON p.booking_id = b.booking_id
JOIN Guests g ON b.guest_id = g.guest_id
WHERE p.amount > (SELECT AVG(amount) FROM Payments);

SELECT 
    SUM(amount) AS total_revenue,
    MIN(amount) AS min_payment,
    MAX(amount) AS max_payment
FROM Payments;

--DROP table Guests CASCADE
