const mongoose = require("mongoose");


const VolunteerRequestSchema = new mongoose.Schema({
    report:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reports",
        required:true,
    },
    volunteer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    note:{
        type:String,
        default:"",
    },
    requestedAt:{
        type:Date,
        default:Date.now,
    },
    reviewedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    reviewedAt:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
},{
    timestamps:true
})

VolunteerRequestSchema.index({ 
    report: 1, 
    volunteer: 1 
}, { 
    unique: true 
});


export const VolunteerRequest = mongoose.model.VolunteerRequest || mongoose.model("VolunteerRequest",VolunteerRequestSchema);