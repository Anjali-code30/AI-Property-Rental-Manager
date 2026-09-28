const categoryModel = require("../models/categoryModel");

const {isValid ,isValidCategoryName ,  isValidObjectId } = require("../utils/validator");

// Add Category (Admin)
const addCategory = async (req , res) => {
    try {
        let categoryData = req.body;

        if(!categoryData || Object.keys(categoryData).length === 0){
            return res.status(400).json({msg : "Bad request || No data provided"});
        }

        let {categoryName , description , status} = categoryData;


        // Name Validation
        if(!isValid(categoryName)){
          return res.status(400).json({msg : "Category Name is Required"})
        }
        if(!isValidCategoryName(categoryName)){
          return res.status(400).json({msg : "Invalid Category Name"})
        }
        let duplicateCategory = await CategoryModel.findOne({categoryName , });

        if(duplicateCategory){
            return res.status(400).json({msg : "Category Name is Already exists"})
        }

        // description Validation
        if(!isValid(description)){
          return res.status(400).json({msg : "Description Name is Required "})
        }
        if(description.length < 10 || description.length > 300){
            return res.status(400).json({msg : "description  should be less than 300 charcters and  greater than 10 characters"})
        }

       // status Validation
       if(status !== undefined){
        if(status !== "active" && status !== "inactive"){
            return res.status(400).json({msg : "Invalid Staus"})
        }
       }

       let category = await CategoryModel.create(categoryData);
       return res.status(201).json({msg : "Category Crated SuccessFully" , category})

        
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});
    }
}

// Get All Category
const getAll = async (req , res)  => {
    try {
        let categories = await CategoryModel.find();
        if(categories.length === 0){
            return res.status(400).json({msg : "Categories Not Found"})
        }
        return res.status(200).json({msg : "Categories Fetched Successfully" , categories})
        
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});
    }
}

// Get Category by id
const getCategoryById = async (req , res)  => {
    try {
        let categoryId = req.params.id;
        if(!isValidObjectId(categoryId)){
            return res.status(400).json({msg : "Invalid Category Id"})
        };
        let category = await categoryModel.findById(categoryId);
        if(!category){
            return res.status(404).json({msg : "category not found"});
        }
        return res.status(200).json({msg : "Category fetched successfully" , category})

        
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});
    }
}

// Update Category (Admin)
const updateCategory = async (req , res)  => {
    try {
        let categoryId = req.params.id;
        console.log(categoryId)

        if(!isValidObjectId(categoryId)){
            return res.status(400).json({msg : "Invalid Category Id"})
        };

        let categoryData = req.body;

        if(!categoryData || Object.keys(categoryData).length === 0){
            return res.status(400).json({msg : "Bad request || No data provided"});
        }

        let {categoryName , description , status} = categoryData;

    if(categoryName !== undefined){
         if(!isValid(categoryName)){
          return res.status(400).json({msg : "Category Name is Required"})
        }
        if(!isValidCategoryName(categoryName)){
          return res.status(400).json({msg : "Invalid Category Name"})
        }
        let duplicateCategory = await categoryModel.findOne({categoryName , _id : { $ne : categoryId} , });

        if(duplicateCategory){
            return res.status(400).json({msg : "Category Name is Already exists"})

        }
    }
    if(description !== undefined){
         if(!isValid(description)){
          return res.status(400).json({msg : "Description Name is Required "})
        }
        if(description.length < 10 || description.length > 300){
            return res.status(400).json({msg : "description  should be less than 300 charcters and  greater than 10 characters"})
        }

    }

     if(status !== undefined){
        if(status !== "active" && status !== "inactive"){
            return res.status(400).json({msg : "Invalid Staus"})
        }
       }

       let updateCategory = await categoryModel.findByIdAndUpdate( categoryId , categoryData , {new : true});
       return res.status(200).json({msg : "Category Updated Successfully" , updateCategory})

        
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});
    }
}

// Delete Category (Admin)  
const deleteCategory = async (req , res) => {
    try {
        let categoryId = req.params.id;
        if(!isValidObjectId(categoryId)){
            return res.satus(400).json({msg : "Invalid category Id"})
        }
    
        let deletecategory = await categoryModel.findByIdAndDelete(categoryId);

        if(!deletecategory){
            return res.status(404).json({msg : "Category Not Found or Already Deleted"});
        }

        return res.status(200).json({msg : "Category deleted Successfully"})
        
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});
    }
}

module.exports = { addCategory , getAll , getCategoryById ,updateCategory , deleteCategory};