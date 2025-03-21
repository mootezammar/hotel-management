const express = require('express');

const client = require('../config/db');
const { validateGuest } = require('../middlewares/validate');
const{generateGuestId }=require('../middlewares/generateGuestId')

const router = express.Router();



//get all users
router.get('/guests', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Guests');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);res.status(500).json(error );
    }
});
//get one user
router.get('/guest/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid guest ID' });
        }

        // Query the database
        const result = await client.query('SELECT * FROM Guests WHERE guest_id = $1', [id]);

        // Check if the guest exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json(error );
    }
});

//add user
router.post('/guest', validateGuest, async (req, res) => {
    try {
        const { guest_name, email, phone } = req.body;
        const guest_id = generateGuestId(); // Generate a unique guest ID

        // Insert into the database
        const result = await client.query(
            'INSERT INTO Guests (guest_id, guest_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [guest_id, guest_name, email, phone]
        );

        // Return the newly created guest
        res.status(201).json({ guest: result.rows[0], message: "Guest added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//update user
router.put('/guest/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { guest_name, email, phone } = req.body;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid guest ID' });
        }

        // Validate input
        if (!guest_name && !email && !phone) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        // Update the guest in the database
        const result = await client.query(
            `UPDATE Guests 
             SET guest_name = COALESCE($1, guest_name), 
                 email = COALESCE($2, email), 
                 phone = COALESCE($3, phone) 
             WHERE guest_id = $4 
             RETURNING *`,
            [guest_name, email, phone, id]
        );

        // Check if the guest exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        // Return the updated guest
        res.status(200).json({result:result.rows[0],message:"guest updated"});
    } catch (error) {
        console.error(error);
       res.status(500).json(error );
    }
});


// delete guest
router.delete('/guest/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid guest ID' });
        }

        // Delete the guest from the database
        const result = await client.query('DELETE FROM Guests WHERE guest_id = $1 ', [id]);

      

        // Return the deleted guest
        res.status(200).json({ message: 'Guest deleted successfully', deletedGuest: result.rows[0] });
    } catch (error) {
        console.error(error);
       res.status(500).json(error );
    }
});
module.exports = router