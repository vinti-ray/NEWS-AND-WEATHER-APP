const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    keyword:{type:[String]},
    count:{type:Number},
    ipAddress:{type:String}
},{timestamps:true})

module.exports=mongoose.model("news",schema)