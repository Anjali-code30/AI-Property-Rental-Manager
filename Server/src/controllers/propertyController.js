const PropertyModel = require("../models/PropertyModel");
const categoryModel = require("../models/categoryModel");

const {isValid , isValidObjectId} = require("../utils/validator");

// Add Property (Owner)
const addProperty = async (req , res) => {
    try{
     let propertyData = req.body;
       if(!propertyData || Object.keys(propertyData).length === 0){
            return res.status(400).json({msg : "Bad request || No data provided"});
        }
     let {title , description , categoryId , location , price , bedRooms , bathRooms , area , status} = propertyData;
     // Title Validation 
     if(!isValid(title)){
        return res.status(400).json({msg : "Property Title is Required"})
     }

     // Description Validation 
     if(!isValid(description)){
        return res.status(400).json({msg : "Property description is Required"})
     }

    if(description.length < 10 || description.length > 1000){
        return res.status(400).json({msg : "description  should be less than 1000 charcters and  greater than 10 characters"})
    }

    // CategoryId Validation 
    if(!isValid(categoryId)){
        return res.status(400).json({msg : "Category Id  is Required"})
     }
     if(!isValidObjectId(categoryId)){
        return res.status(400).json({msg : "InValid Category Id"});
     }
     let categoryIdExits = await categoryModel.findById(categoryId);
     if(!categoryIdExits){
        return res.status(404).json({msg : "Category Not Found"});
     }

     // location Validation
      if(!isValid(location)){
        return res.status(400).json({msg : "location is Required"})
     }

     // Price Validation
    if(!isValid(price)){
        return res.status(400).json({msg : "Price  is Required"})
     }
     if(Number(price) <=  0){
        return res.status(400).json({msg : "Invalid Price"})
     }

     // BedRooms Validation
      if(!isValid(bedRooms)){
        return res.status(400).json({msg : "Please Enter The BedRooms "})
     }
     if(Number(bedRooms) <=  0){
        return res.status(400).json({msg : "Please check, you enter Bedrooms incorrectly"})
     }

     // BathRooms Validation
      if(!isValid(bathRooms)){
        return res.status(400).json({msg : "Please Enter The BathRooms"})
     }
     if(Number(bathRooms) <=  0){
        return res.status(400).json({msg : "Please check, you enter Bathrooms incorrectly"})
     }

     // Area Validation
      if(!isValid(area)){
        return res.status(400).json({msg : "Area is Required"})
     }
     if(Number(area) <=  0){
        return res.status(400).json({msg : "Invalid Area"})
     }

     // Ststus Validation
     if(status !== undefined){
        if(status !== "available" && status !== "rented" && status !== "inactive"){
            return res.status(400).json({msg : "You Enter a Incorrect Status Value"});
        }
     }

     propertyData.ownerId = req.userId;

     // Images Validation
     if(req.files && req.files.length > 0){
        propertyData.images = req.files.map((file) => file.filename);
     }

     let property = await PropertyModel.create(propertyData);
     
     return res.status(201).json({msg : "Property Added Successfully" , property});

    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

// Update Property (Owner)
const updateProperty = async (req , res) => {
    try{
      let propertyId = req.params.id;
      if(!isValidObjectId(propertyId)){
        return res.status(400).json({msg : "InValid Property Id"});  
      }
      let property = await PropertyModel.findById(propertyId);
      if(!property){
         return res.status(404).json({msg : "Property Not Found "})
      }
      if(property.ownerId.toString() !== req.userId.toString()){
         return res.status(400).json({msg : "You can only update your owm Property"})
      }
      let propertyData = req.body;

      if(!propertyData || Object.keys(propertyData).length === 0){
            return res.status(400).json({msg : "Bad request || No data provided"});
        }
     let {title , description , categoryId , location , price , bedRooms , bathRooms , area , status} = propertyData;

     if(title !== undefined){
         if(!isValid(title)){
        return res.status(400).json({msg : "Property Title is Required"})
     }
     }

     if(description !== undefined){
      if(!isValid(description)){
        return res.status(400).json({msg : "Property description is Required"})
      }

      if(description.length < 10 || description.length > 1000){
        return res.status(400).json({msg : "description  should be less than 1000 charcters and  greater than 10 characters"})
       }
     }

     if(categoryId !== undefined){
      if(!isValid(categoryId)){
        return res.status(400).json({msg : "Category Id  is Required"})
     }
     if(!isValidObjectId(categoryId)){
        return res.status(400).json({msg : "InValid Category Id"});
     }
     let categoryIdExits = await categoryModel.findById(categoryId);
     if(!categoryIdExits){
        return res.status(404).json({msg : "Category Not Found"});
     }
     }

     if(location !== undefined){
      if(!isValid(location)){
        return res.status(400).json({msg : "location is Required"})
     }
     }

     if(price !== undefined){
      if(!isValid(price)){
        return res.status(400).json({msg : "Price  is Required"})
      }
      if(Number(price) < 0){
         return res.status(400).json({msg : "Invalid Price"});
      }
     }

    if(bedRooms !== undefined){
      if(isValid(bedRooms)){
         return res.status(400).json({msg : "Please Enter The BedRooms"})
      }
      if(Number(bedRooms) < 0 ){
         return res.status.json({msg : "Please check, you enter Bedroom incorrectly"})
      }
    }

    if(bathRooms !== undefined){
       if(isValid(bedRooms)){
         return res.status(400).json({msg : "Please Enter The BathRooms"})
      }
      if(Number(bedRooms) < 0 ){
         return res.status.json({msg : "Please check, you enter Bathroom incorrectly"})
      }
    }

    if(area !== undefined){
       if(isValid(area)){
         return res.status(400).json({msg : "Please Enter the Area"})
      }
      if(Number(bedRooms) < 0 ){
         return res.status.json({msg : "Please check, you enter Area incorrectly"})
      }

    }

    if(status !== undefined){
      if(status !== "available" && status !== "rented" && status !== "inactive"){
         return res.status(400).json({msg : "You Enter a Incorrect Status Value"})
      }
    }

    if(req.files && req.files.length > 0){
      propertyData.image = req.files.map((file) => file.filename);
    }

    let updateProperty = await PropertyModel.findByIdAndUpdate(propertyId , propertyData , {new : true}).populate("categoryId");
   
    return res.status(200).json({msg : "Property Data Updated Successfully" , updateProperty})
  
    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

// Delete Property (Owner)
const deleteProperty = async (req , res) => {
    try{
      let propertyId = req.params.id;
      if(!isValidObjectId(propertyId)){
        return res.status(400).json({msg : "InValid Property Id"});  
      }

      let property = await PropertyModel.findById(propertyId);
      if(!property){
      return res.status(404).json({msg : "Property Not Found "})
      }

      if(property.ownerId.toString() !== req.userId.toString()){
         return res.status(400).json({msg : "You can only delete your owm Property"})
      }

      await propertyModle.findByIdAndDelete(propertyId);
      return res.status(200).json({msg : "Property deleted Successfully"})

    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

// Get My Properties (Ownwer)
const getMyProperty = async (req , res) => {
    try{
      let ownerId = req.userId;
      let myProperties = await PropertyModel.find({ownerId}).populate("categoryId").sort({createdAt : -1});
      if(!myProperties){
         return res.status(404).json({msg : "No Property Found"});
      }
      return res.status(200).json({msg : "Properties Data fetch Successfully" ,totalNoOfProperties : myProperties.length, myProperties});
    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

// Get All Properties (search , filter , Pagination)
const getAllProperty = async (req , res) => {
    try{
      let {search , categoryId , location , minPrice , maxPrice , status , page = 1 , limit = 5}= req.query;
      



    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

// Get Prperty by Id

const getPropertyById = async (req , res) => {
    try{
      let propertyId = req.params.id;
      if(!isValidObjectId(propertyId)){
        return res.status(400).json({msg : "InValid Property Id"});  
      }
      let property = await PropertyModel.findById(propertyId).populate("categoryId").populate("ownwerId" , "-password");
      if(!property){
       return res.status(404).json({msg : "Property Not Found "})
      }
      return res.status(200).json({msg : "Property fetched Successfully"})
    }
    catch(error){
       console.log(error);
       res.status(500).json({msg : "Internal Server Error"})
    }
}

module.exports = {addProperty , updateProperty , deleteProperty , getMyProperty , getAllProperty , getPropertyById}