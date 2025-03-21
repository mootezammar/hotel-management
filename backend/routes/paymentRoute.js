const express = require('express');
const router = express.Router();
const client = require('../config/db');

// GET all payments
router.get('/payments', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Payments');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// GET payment by ID
router.get('/payment/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid payment ID' });
        }

        const result = await client.query('SELECT * FROM Payments WHERE payment_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

// POST create a new payment
router.post('/payment', async (req, res) => {
    try {
        const { booking_id, amount, payment_method } = req.body;

        // Validate input
        if (!booking_id || !amount || !payment_method) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into the database
        const result = await client.query(
            'INSERT INTO Payments (booking_id, amount, payment_method) VALUES ($1, $2, $3) ',
            [booking_id, amount, payment_method]
        );

        // Return the newly created payment
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// DELETE a payment
router.delete('/payment/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid payment ID' });
        }

        const result = await client.query('DELETE FROM Payments WHERE payment_id = $1 ', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment deleted successfully', deletedPayment: result.rows[0] });
    } catch (error) {
        console.error(error); res.status(500).json( error);
    }
});

module.exports = router;