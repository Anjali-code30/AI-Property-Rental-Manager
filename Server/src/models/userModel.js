const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName: {
        type:String,
        require:true,
        trim:true,
     },
     email: {
        type : String,
        required: true,
        unique: true,
        trim: true,
     },
     password: {
         type: String,
         required: true,
     },
     phone:{
        type: String,
        required: true,
        trim: true,
        unique: true,
     },

     profileImage:{
        type: String,
        default: "",
     },

     role:{
        type: String,
        enum: ["user" , "owner" , "admin"],
        default: "user",
     },
     gender:{
        type: String,
        enum: ["male" , "female" , "other" , "prefer_not_to_say"],
        default: "prefer_not_to_say",
        trim: true,
     },
     bio: {
        type: String,
        default:"",
        trim: true,
     },

    }, {timestamps: true},
    );

    module.exports = mongoose.model("user" , userSchema);