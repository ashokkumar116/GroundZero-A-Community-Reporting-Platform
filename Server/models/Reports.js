import mongoose from "mongoose";

const CategoryEnum = [
  'pothole',
  'streetlight',
  'garbage',
  'water',
  'drainage',
  'traffic',
  'other'
];

const PriorityEnum = ['low', 'medium', 'high', 'critical'];

const StatusEnum = ['reported',"verified", 'in_progress', 'resolved', 'rejected', 'archived',"false_report"];

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

const volunteerSchema = new mongoose.Schema({
    volunteerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    joinedAt:{
        type:Date,
        default:Date.now,
    },
})

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const statusHistorySchema = new mongoose.Schema({
  from: { type: String, enum: StatusEnum },
  to: { type: String, enum: StatusEnum, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
  at: { type: Date, default: Date.now }
}, { _id: false });

const reportSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxLength:150,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        required:true,
        enum:CategoryEnum,
        default:"other"
    },
    priority:{
        type:String,
        required:true,
        enum:PriorityEnum,
        default:"medium"
    },
    village:{
        type:String,
        required:true,
        trim:true,   
    },
    district:{
        type:String,
        required:true,
        trim:true,   
    },
    state:{
        type:String,
        required:true,
        trim:true,   
    },
    pincode:{
        type:Number,
        required:true,
        trim:true,   
    },
    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    volunteers:{
        type:[volunteerSchema],
        default:[]
    },
    status:{
        type:String,
        enum:StatusEnum,
        default:"reported"
    },
    images:{
        type:[imageSchema],
        default:[]
    },
    reportedAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    resolvedAt:{
        type:Date,
        default:Date.now,
    },
    upvotes:{
        type:Number,
        default:0,
    },
    views:{
        type:Number,
        default:0,
    },
    history:{
        type:[statusHistorySchema],
        default:[]
    },
    comments:{
        type:[commentSchema],
        default:[]
    },
    isArchieved:{
        type:Boolean,
        default:false,
    },
    verified:{
        type:Boolean,
        default:false,
    }

}, {timestamps:true})




export const Reports = mongoose.model.Reports || mongoose.model("Reports",reportSchema);