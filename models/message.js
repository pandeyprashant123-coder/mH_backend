import mongoose from "mongoose";

const messages = mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    received:Boolean
})

export default mongoose.model('messagecontents',messages)