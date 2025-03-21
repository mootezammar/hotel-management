const express = require('express');
const router = express.Router();
const client = require('../config/db');

// GET all rooms
router.get('/rooms', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Rooms');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(error );
    }
});

// GET room by ID
router.get('/room/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        // Query the database
        const result = await client.query('SELECT * FROM Rooms WHERE room_id = $1', [id]);

        // Check if the room exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Return the room data
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
     
        res.status(500).json(error );
    }
});

// POST create a new room
router.post('/room', async (req, res) => {
    try {
        const { room_number, room_type, price_per_night } = req.body;

        // Validate input
        if (!room_number || !room_type || !price_per_night) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into the database
        const result = await client.query(
            'INSERT INTO Rooms (room_number, room_type, price_per_night) VALUES ($1, $2, $3)',
            [room_number, room_type, price_per_night]
        );

        // Return the newly created room
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
     
        res.status(500).json(error );
    }
});

// PUT update a room
router.put('/room/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { room_number, room_type, price_per_night } = req.body;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        // Validate input
        if (!room_number && !room_type && !price_per_night) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        // Update the room in the database
        const result = await client.query(
            `UPDATE Rooms 
             SET room_number = COALESCE($1, room_number), 
                 room_type = COALESCE($2, room_type), 
                 price_per_night = COALESCE($3, price_per_night) 
             WHERE room_id = $4 
             RETURNING *`,
            [room_number, room_type, price_per_night, id]
        );

        // Check if the room exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Return the updated room
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        
        res.status(500).json(error );
    }
});

// DELETE a room
router.delete('/room/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        // Delete the room from the database
        const result = await client.query('DELETE FROM Rooms WHERE room_id = $1 ', [id]);

        // Check if the room was found and deleted
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Return the deleted room
        res.status(200).json({ message: 'Room deleted successfully', deletedRoom: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/room/:id/availability', async (req, res) => {
    try {
        const id = req.params.id;
        const { is_available } = req.body;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        // Validate input
        if (typeof is_available !== 'boolean') {
            return res.status(400).json({ error: 'Invalid availability status. Must be a boolean (true/false).' });
        }

        // Update the room's availability
        const result = await client.query(
            'UPDATE Rooms SET is_available = $1 WHERE room_id = $2 ',
            [is_available, id]
        );

        // Check if the room exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Return the updated room
        res.status(200).json({ message: 'Room availability updated successfully', room: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json( error);
    }
});

module.exports = router;