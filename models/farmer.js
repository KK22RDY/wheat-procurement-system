const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("Farmer", farmerSchema);