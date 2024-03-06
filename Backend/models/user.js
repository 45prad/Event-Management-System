const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullname: {
        type: String,
        require: true,
    },
    rollNo: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role:{
        type: String,
        require: true
    },
    commiteeName:{
        type: String,
        require: true
    },
    department: {
        type: String,
        require: true
    },
})


module.exports = mongoose.model("User",UserSchema);