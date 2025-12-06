const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

const announcementSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:[imageSchema],
        default:[],        
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true
})

const Announcement = mongoose.model("Announcement",announcementSchema)

module.exports = Announcement
