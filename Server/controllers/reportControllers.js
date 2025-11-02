const {Reports} = require("../models/Reports");

const createReport = async(req,res)=>{
    const {title,description,category,priority,village,district,state,pincode} = req.body;
    const images = req.files;
    const userId = req.user.userId;

    const imagesUrls = images.map((image)=>({
        url:image.path,
        publicId:image.filename
    }))

    if(!title || !description || !category || !priority || !village || !district || !state || !pincode){
        return res.status(400).json({message:"All Fiels Required"})
    }

    if(images.length === 0 ){
        return res.status(400).json({message:"Please Upload Images"})
    }

    const report = new Reports({
        title,
        description,
        category,
        priority,
        village,
        district,
        state,
        pincode,
        images:imagesUrls,
        reportedBy:userId
    });

    await report.save();

    return res.status(201).json({
        message:"Report Created",
        report
    })

}

module.exports = {
    createReport
}