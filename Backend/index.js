const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');


connectToMongo();
const app = express()
app.use(cors())
const port = 5000

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(express.json())

app.use("/uploads", express.static("uploads"))

app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/room',require('./routes/room.js'))
app.use('/api/data', require('./routes/data.js'));
app.use('/api/events', require('./routes/events.js'));

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})