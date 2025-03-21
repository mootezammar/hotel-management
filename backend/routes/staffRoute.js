const express = require('express');
const router = express.Router();
const client = require('../config/db'); 

// GET all staff
router.get('/staff', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Staff');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// GET staff by ID
router.get('/staff/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid staff ID' });
        }

        const result = await client.query('SELECT * FROM Staff WHERE staff_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

// POST create a new staff member
router.post('/staff', async (req, res) => {
    try {
        const { staff_name, role, email, phone } = req.body;

        // Validate input
        if (!staff_name || !role || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into the database
        const result = await client.query(
            'INSERT INTO Staff (staff_name, role, email, phone) VALUES ($1, $2, $3, $4) ',
            [staff_name, role, email, phone]
        );

        // Return the newly created staff member
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

// PUT update a staff member
router.put('/staff/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { staff_name, role, email, phone } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid staff ID' });
        }

        if (!staff_name && !role && !email && !phone) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        const result = await client.query(
            `UPDATE Staff 
             SET staff_name = COALESCE($1, staff_name), 
                 role = COALESCE($2, role), 
                 email = COALESCE($3, email), 
                 phone = COALESCE($4, phone) 
             WHERE staff_id = $5 
             `,
            [staff_name, role, email, phone, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
         res.status(500).json( error);
    }
});

// DELETE a staff member
router.delete('/staff/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid staff ID' });
        }

        const result = await client.query('DELETE FROM Staff WHERE staff_id = $1 ', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json({ message: 'Staff deleted successfully', deletedStaff: result.rows[0] });
    } catch (error) {
        console.error(error);
       res.status(500).json( error);
    }
});

module.exports = router;