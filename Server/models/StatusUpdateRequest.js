const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true,
    },
    publicId:{
        type:String,
        required:true,
    }
})

const statusUpdateRequestSchema = new mongoose.Schema({
    report:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reports",
        required:true
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    requestedStatus:{
        type:String,
        enum:["in_progress","resolved"],
        required:true
    },
    note:{
        type:String,
        default:"",
    },
    images:{
        type:[imageSchema],
        default:[],
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
    }
},{
    timestamps:true
})

statusUpdateRequestSchema.index({
    report:1,
    requestedBy:1,
    requestedStatus:1,
    status:1
},{
    unique:true,
    partialFilterExpression:{status:"pending"}
});

export const StatusUpdateRequest = mongoose.model.StatusUpdateRequest || mongoose.model("StatusUpdateRequest",statusUpdateRequestSchema);