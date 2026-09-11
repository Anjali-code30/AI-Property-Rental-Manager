require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/db");

const userRoute =  require("./routes/userRoute");

const app = express();
connectDB();

// .use is use for middlewares by this we can use middlewares
app.use(express.json());
app.use("/users" , userRoute);


// for checking if app is running 
app.get("/" , (req , res) => {
    res.json("Hello from Property Rental Manager Project");
});

const Port = process.env.PORT;
app.listen(Port , (err) => err ? console.log(err): console.log(`Server At Running At Port ${Port}`),)
