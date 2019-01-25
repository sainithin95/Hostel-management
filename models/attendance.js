const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  attendance:{
      date:{type:Date,default:Date.now},
      attendance:[{
          id:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student"
          },
          attendance:{type:Boolean,default:true}
      }]
  }
});
// db.groups.update({:"ab"},{$push:{count_array:{ id:"5c2dbdb89a25740144247afa",count:100}}});

module.exports = mongoose.model("Attendance", AttendanceSchema);