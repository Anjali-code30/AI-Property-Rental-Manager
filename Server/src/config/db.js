const mongoose = require("mongoose");

const connectDB = async(req , res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");    
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg : "Internal Server Error"});   
    }
}
module.exports = connectDB;