const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const StudentSchema = new mongoose.Schema({
    username:{type:String},
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: Number,
    room: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"

        },
        room: String},
    roll:Number,
    attendance:[{
        Date:{type:Date,default:Date.now},
        attendance:{type:Boolean,default:false}
    }]
});

StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", StudentSchema);