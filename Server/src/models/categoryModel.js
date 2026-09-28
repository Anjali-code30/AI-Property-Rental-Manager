const mongoose = require("mongoose");


const categoryModel = new mongoose.Schema({
    categoryName:{
        type: String,
        require: true,
        trim : true,
    },
    description :{
        type: String,
        require: true,
        trim : true,

    },
    status:{
        type: String,
        enum : ["active" , "inactive"],
        default: "active",
    }

} ,
{timestamps : true},
);

module.exports = mongoose.model("Category" , categoryModel);
