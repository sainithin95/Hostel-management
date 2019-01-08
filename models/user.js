const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    name: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: { type: Boolean, default: false },

    isChef: { type: Boolean, default: false },

    isWarden: { type: Boolean, default: false }
});





UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);