const mongoose = require("mongoose");

const Gatepass = new mongoose.Schema({
    names:String,
    Reason: String,
    Status: { type: Boolean, default: false },
    Permission: { type: Boolean, default: false }
});

module.exports = mongoose.model("Gatepass", Gatepass);