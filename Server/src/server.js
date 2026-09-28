require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");


const userRoute =  require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const propertyRoute = require("./routes/propertyRoute");

const app = express();
connectDB();

// .use is use for middlewares by this we can use middlewares
app.use(express.json());
// use for parse form-data which come form frontended it is a built in middleware
app.use(express.urlencoded({extended : true}))
app.use("/users" , userRoute);
app.use("/categories" , categoryRoute);
app.use("/properties" , propertyRoute)

// this is a static route for fetch photo 
app.use("/uploads" , express.static(path.join(__dirname , "uploads")));

// for checking if app is running 
app.get("/" , (req , res) => {
    res.json("Hello from Property Rental Manager Project");
});

const Port = process.env.PORT;
app.listen(Port , (err) => err ? console.log(err): console.log(`Server At Running At Port ${Port}`),)
