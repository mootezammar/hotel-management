const express = require('express'); 
const morgan = require("morgan") 
const logger = require("./config/logger");
const client = require("./config/db")
const guestRouter = require("./routes/guestRoutes")
const roomRouter = require("./routes/roomRoutes")
const staffRouter = require("./routes/staffRoute")
const bookingRouter = require("./routes/bookingRoute")
const paymentRouter = require("./routes/paymentRoute")
const staticRouter=require("./routes/staticRoute")

const PORT = 3000




const app = express()
app.use(express.json())

app.use(morgan('combined', 
{
    stream : {
        write : (message) => {
            logger.info(message.trim())
        } 
    }
}
));

app.use('/api', guestRouter)
app.use('/api', roomRouter)
app.use('/api', staffRouter)
app.use('/api', bookingRouter)
app.use('/api', paymentRouter)
app.use('/api',staticRouter)


app.get('/', (req, res) => {
    res.json('hello from server')
})
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});

