const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: Number,
    likedMost: String, 
    improvements: String, 
    recommendations: String, 
    comments: String 
});

module.exports = mongoose.model('Feedback', feedbackSchema);
