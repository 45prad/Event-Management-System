const mongoose = require('mongoose')
const { Schema } = mongoose;

const RoomSchema = new Schema({
    eventId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    roomNumber: { type: String, required: true },
    allocatedTo: [{ type: String }], // Array of committee names
    bookedAt: [{ type: Date }], // Array of booking dates
});


module.exports = mongoose.model("rooms", RoomSchema);