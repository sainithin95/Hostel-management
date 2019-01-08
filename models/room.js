const mongoose = require("mongoose");
  

const RoomSchema = new mongoose.Schema({
    ac:{type:Boolean,default:false},
    room:{ type: String,required: true }
});



module.exports = mongoose.model("Room", RoomSchema);