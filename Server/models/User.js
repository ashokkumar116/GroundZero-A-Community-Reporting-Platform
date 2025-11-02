import mongoose from "mongoose";

const volunteerWorkSchema = new mongoose.Schema({
    report:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reports",
        required:true,
    },
    joinedAt:{
        type:Date,
        default:Date.now,
    },
    
})

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: "Small actions, real impact — I’m in.",
        },
        profile_image: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        dob: {
            type: Date,
            default: null,
        },
        village_name: {
            type: String,
            default: "",
        },
        district: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        email_verified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: "",
        },
        otp_expiry: {
            type: Date,
            default: null,
        },
        last_login: {
            type: Date,
            default:null
        },
        volunteer_works:{
            type:[volunteerWorkSchema],
            default:[]
        }
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
