const validateGuest = (req, res, next) => {
    const { guest_name, email, phone } = req.body;

    if (!guest_name || !email || !phone) {
        return res.status(400).json({ error: 'Missing required fields: guest_name, email, phone' });
    }

    if (typeof guest_name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
        return res.status(400).json({ error: 'Invalid data types: guest_name, email, phone must be strings' });
    }

    next(); 
};
const validateBooking = (req, res, next) => {
    const { guest_id, room_id, check_in_date, check_out_date, total_price } = req.body;

    if (!guest_id || !room_id || !check_in_date || !check_out_date || !total_price) {
        return res.status(400).json({ error: 'Missing required fields: guest_id, room_id, check_in_date, check_out_date, total_price' });
    }

    if (isNaN(guest_id) || isNaN(room_id) || isNaN(total_price)) {
        return res.status(400).json({ error: 'Invalid data types: guest_id, room_id, total_price must be numbers' });
    }

    next(); 
};



module.exports = { validateGuest,validateBooking };