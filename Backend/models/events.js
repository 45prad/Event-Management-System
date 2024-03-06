const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tag: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        askedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        replies: [{
            reply: {
                type: String,
                required: true
            },
            repliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    }],
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Events', eventSchema);
