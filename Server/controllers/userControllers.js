const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const { cloudinary } = require("../Services/cloudinary");
const Reports = require("../models/Reports");

const getUser = async (req, res) => {
  const userId = req.params.id;

  const user = await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $project:{
        password:0
      }
    },
    {
      $lookup:{
        from:"reports",
        let:{
          uid:"$_id"
        },
        pipeline:[
          {
            $match:{
              $expr:{
                $eq:["$reportedBy", "$$uid"]
              }
            }
          },
          {
            $project:{
              _id:1,
              title:1,
              status:1,
              reportedBy:1
            }
          }
        ],
        as:"posts"
      }
    },
    {
      $lookup:{
        from:"reports",
        let:{
          reportId:{
            $ifNull:["$volunteer_works.report",[]]
          }
        },
        pipeline:[
          {
            $match:{
              $expr:{
                $in:["$_id","$$reportId"]
              }
            }
          },{
            $project:{
              _id:1,
              title:1,
              status:1,
              reportedBy:1
            }
          }
        ],
        as:"volunteer_works"
      }
    }
  ])

  return res.status(200).json({
    message: "User Fetched Successfully",
    user
  })

};


const updateProfileImage = async(req,res)=>{
    const userId = req.user.userId;
    const image = req.file;
    if(!image){
        return res.status(400).json({
            message:"Image is required"
        })
        }
    const user = await User.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({
            message:"User Not Found"
        })
    }
    if(user.profile_image && user.profile_image.includes("cloudinary")){
        const oldProfileImagePath = user.profile_image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`GroundZero/${oldProfileImagePath}`);
    }
    user.profile_image = image.path;
    await user.save();
    return res.status(200).json({
        message:"Profile Image Updated Successfully",
        user
    })
}


const updateProfile = async(req,res)=>{
    const userId = req.user.userId;

    const {username,bio,phone,dob,village_name,district,state,pincode} = req.body;

    const user = await User.findById(userId).select("-password");

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.phone = phone || user.phone;
    if(dob){
        user.dob = dob;
    }
    user.village_name = village_name || user.village_name
    user.district = district || user.district
    user.state = state || user.state
    user.pincode = pincode || user.pincode

    await user.save();

    return res.status(200).json({
        message:"Profile Updated Successfully",
        user
    })

}

const getVolunteerWorks = async(req,res)=>{
    const userId = req.params.id;
    const volunteerWorks = await Reports.find({
      "volunteers.volunteer":userId
    }).populate("reportedBy","username profile_image")
    return res.status(200).json({
      message:"Volunteer Works Fetched Successfully",
      volunteerWorks
    })
}

const getUserReports = async(req,res)=>{
  const userId = req.params.id;
  const userReports = await Reports.find({
    "reportedBy":userId
  }).populate("reportedBy","username profile_image")
  return res.status(200).json({
    message:"User Reports Fetched Successfully",
    userReports
  })
}


module.exports = {
    getUser,
    updateProfileImage,
    updateProfile,
    getVolunteerWorks,
    getUserReports
}