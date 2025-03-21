const express = require('express');
const router = express.Router();
const client = require('../config/db');

// GET total revenue
router.get('/statistics/revenue', async (req, res) => {
    try {
        const result = await client.query('SELECT SUM(amount) AS total_revenue FROM Payments');
        res.status(200).json({ total_revenue: result.rows[0].total_revenue || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET total number of bookings
router.get('/statistics/bookings', async (req, res) => {
    try {
        const result = await client.query('SELECT COUNT(*) AS total_bookings FROM Bookings');
        res.status(200).json({ total_bookings: result.rows[0].total_bookings || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET room occupancy rate
router.get('/statistics/occupancy', async (req, res) => {
    try {
        const totalRoomsResult = await client.query('SELECT COUNT(*) AS total_rooms FROM Rooms');
        const occupiedRoomsResult = await client.query('SELECT COUNT(DISTINCT room_id) AS occupied_rooms FROM Bookings WHERE CURRENT_DATE BETWEEN check_in_date AND check_out_date');

        const totalRooms = totalRoomsResult.rows[0].total_rooms || 0;
        const occupiedRooms = occupiedRoomsResult.rows[0].occupied_rooms || 0;

        const occupancyRate = (occupiedRooms / totalRooms) * 100;
        res.status(200).json({ occupancy_rate: occupancyRate.toFixed(2) + '%' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;