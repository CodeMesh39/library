const mongoose=require("mongoose");
const BookSchema=new mongoose.Schema({
title:{type:String,required:true},
borrowerId:{type:String,required:true},
status:{type:String,enum:["Issued","Pending","Not Returned","Returned"],default:"Issued"},
issuedAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("Book",BookSchema);