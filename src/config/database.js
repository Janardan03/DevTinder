const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://janardansharmaofficial:T8kXZAmo9TidpnQR@namastenodejs.pfng7.mongodb.net/devTinder");
}

module.exports = connectDB;