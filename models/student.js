const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    email: { type: String, unique: true, required: true },
    phone: Number,
    parent_number:Number,
    password:{type:String,default:'password'},
    room:String,
    roll:Number,
    attendance:[{

    }]
});

StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", StudentSchema);