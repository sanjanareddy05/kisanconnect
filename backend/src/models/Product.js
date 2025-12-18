const mongoose = require("mongoose");
module.exports = mongoose.model("Product", new mongoose.Schema({
  name:String,
  price:Number,
  category:String,
  location:String,
  farmerId:{ type: mongoose.Schema.Types.ObjectId, ref:"User" }
},{timestamps:true}));