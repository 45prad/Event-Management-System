const mongoose = require('mongoose');
require('dotenv').config()

const mongoUrI = process.env.MONGODB_URL;

const connectToMongo = async () =>{
    try {
        await mongoose.connect(mongoUrI);
        console.log("connected to DB");
    } catch (error) {
        console.log(error)
    }
}

module.exports =  connectToMongo;