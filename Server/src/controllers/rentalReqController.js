const RentalReqModel = require("../models/rentalRequestModel");
const PropertyModel = require("../models/PropertyModel");

const { isValid, isValidObjectId } = require("../utils/validator");

// Send Request (user)
const sendRentalReq = async (req, res) => {
    try {
        let requestData = req.body;
        if (!requestData || Object.keys(requestData) == 0) {
            return res.status(400).json({ msg: "Bad request ! No Data Provided" });
        }
        let { propertyId, message } = requestData;

        if (!propertyId) {
            return res.status(400).json({ msg: "Property Id is Required" })
        }
        if (!isValidObjectId(propertyId)) {
            return res.status(400).json({ msg: "Invalid Property Id" });
        }

        let property = await PropertyModel.findById(propertyId);

        if (!property) {
            return res.status(404).json({ msg: "No Property Found!" })
        }

        if (property.status !== "available") {
            return res.status(400).json({ msg: "This Property is not availabel for rent" });
        }

        if (property.ownerId.toString() === req.userId.toString()) {
            return res.status(400).json({ msg: "You cannot apply for your own Property" })
        }
    

        let duplicateRequest = await RentalReqModel.findOne({
            userId: req.userId,
            propertyId,
            status: "pending",
        })
        if (duplicateRequest) {
            return res.status(400).json({ msg: "You Already Applied for this property" })
        }
        if (message !== undefined) {
            if (message.length < 25 && message.length > 300) {
                return res.status(400).json({ msg: "you message must be between 25 to 300 Characters" })
            }
        }
        let rentalReq = await RentalReqModel.create({
            userId: req.userId,
            propertyId,
            ownerId: property.ownerId,
            message,
        });
        return res.status(201).json({ msg: "Rental Request send Successfully", rentalReq });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

// Get My rental req (user)
const getMyRentalReq = async (req, res) => {
    try {
        let rentalRequest = await RentalReqModel.find({
            userId: req.userId
        }).populate("propertyId").populate("ownerId" , "-password").sort({createdAt : -1});
        
        if(rentalRequest.length === 0){
            return res.status(404).json({msg : "No Rental Request found"});
        }

        return res.status(200).json({msg : "Rental Request Fetched Successfully" ,totallength : rentalRequest.length ,rentalRequest})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

// Track My Rantal Req (user)
const trackMyRentalReq = async (req, res) => {
    try {
        let rentalReqId = req.params.id;
        if(!isValidObjectId(rentalReqId)){
            return res.status(400).json({msg : "Invalid Object id"});
        }
        let rentalReq = await RentalReqModel.findById(rentalReqId).populate("propertyId").populate("ownerId" , "-password");
        if(!rentalReq){
            return res.status(404).json({msg : "No Rental Request Found"})
        }

        if(rentalReq.userId.toString() !== req.userId.toString()){
            return res.status(403).json({msg : "You can only track your own renatl request."})
        }
        return res.status(200).json({msg: "Rental Request Fetched.", rentalReq });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

// Get req from my Properties (Owner)
const getReqFromMyProperties = async (req, res) => {
    try {
        let rentalRequests = await RentalReqModel.find({ownerId : req.userId}).populate("propertyId").populate("userId" , "-password").sort({createdAt : -1});

        if(rentalRequests.length === 0){
            return res.status(404).json({msg : "No Rental Request Found "});
        }

        return res.status(200).json({msg : "Rental Request Fetched Successfully" ,length : rentalRequests.length , rentalRequests});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

// Approve Request
const approveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        if(!isValidObjectId(requestId)){
            return res.status(400).json({msg : "Invalid Object"});
        }
        
         const request = await RentalReqModel.findById(requestId);
        if(!request){
            return res.status(404).json({msg : "Rental Request No Found"})
        }

        if(request.ownerId.toString() !== req.userId.toString()){
            return res.status(403).json({msg : "You can only approve your own request"});
        }
        if(request.status !== "pending"){
            return res.status(400).json({msg : `Request is already ${request.status}`})
        }
        request.status = "approved";
        await request.save();

        await PropertyModel.findByIdAndUpdate(request.propertyId , {status : "rented"});

        // updateMany  is use for update many requests at a same time 
        // Working : it find all request which belong to that property then check it not equal to the our request id which is approve
        // then check all other status is pending for this property then it reject all these

        await RentalReqModel.updateMany(
            {
                propertyId : request.propertyId,
                _id : {$ne : request._id},
                status : "pending",
            },
            { status : "rejected"},
        );

        return res.status(200).json({msg : "Request is approve Successfully" , request})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

// Reject Request 
const rejectRequest = async (req, res) => {
    try {
    let requestId = req.params.id;
    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ msg: "Invalid Request Id" });
    }

    const rentalReq = await RentalReqModel.findById(requestId);
    if (!rentalReq) {
      return res.status(404).json({ msg: "Rental Request Not Found" });
    }

    if (rentalReq.ownerId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You Can only Reject requests for your own property" });
    }

    if (rentalReq.status !== "pending") {
      return res
        .status(400)
        .json({ msg: `Request is already ${rentalReq.status}` });
    }

    rentalReq.status = "rejected";
    await rentalReq.save();

    return res.status(200).json({ msg: "Rental Request Rejected", rentalReq });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal Server Error" })
    }
};

module.exports = { sendRentalReq, getMyRentalReq, trackMyRentalReq, getReqFromMyProperties, approveRequest, rejectRequest };


