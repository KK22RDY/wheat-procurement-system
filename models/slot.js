const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    slotID: String,
    center: String,
    time: String,
    date: String,
    capacity: Number,
    booked: Number
});

module.exports = mongoose.model("Slot", schema);