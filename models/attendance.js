const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
    name: String,
    room: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
        username: String
    },
});




// db.groups.update({:"ab"},{$push:{count_array:{ id:"5c2dbdb89a25740144247afa",count:100}}});

module.exports = mongoose.model("Attendance", AttendanceSchema);