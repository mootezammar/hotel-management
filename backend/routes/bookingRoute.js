const express = require('express');
const router = express.Router();
const client = require('../config/db'); 
const {validateBooking }=require("../middlewares/validate")

// GET all bookings
router.get('/bookings', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Bookings');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// GET booking by ID
router.get('/booking/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }

        const result = await client.query('SELECT * FROM Bookings WHERE booking_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// POST create a new booking
router.post('/booking',validateBooking, async (req, res) => {
    try {
        const { guest_id, room_id, check_in_date, check_out_date, total_price } = req.body;

        // Validate input
        if (!guest_id || !room_id || !check_in_date || !check_out_date || !total_price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into the database
        const result = await client.query(
            'INSERT INTO Bookings (guest_id, room_id, check_in_date, check_out_date, total_price) VALUES ($1, $2, $3, $4, $5) ',
            [guest_id, room_id, check_in_date, check_out_date, total_price]
        );

        // Return the newly created booking
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

// PUT update a booking
router.put('/booking/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { guest_id, room_id, check_in_date, check_out_date, total_price } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }

        if (!guest_id && !room_id && !check_in_date && !check_out_date && !total_price) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        const result = await client.query(
            `UPDATE Bookings 
             SET guest_id = COALESCE($1, guest_id), 
                 room_id = COALESCE($2, room_id), 
                 check_in_date = COALESCE($3, check_in_date), 
                 check_out_date = COALESCE($4, check_out_date), 
                 total_price = COALESCE($5, total_price) 
             WHERE booking_id = $6 
             `,
            [guest_id, room_id, check_in_date, check_out_date, total_price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// DELETE a booking
router.delete('/booking/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }

        const result = await client.query('DELETE FROM Bookings WHERE booking_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully', deletedBooking: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

module.exports = router;