const router = require("express").Router();

const {addProperty , updateProperty , deleteProperty , getMyProperty ,getAllProperty, getPropertyById} = require("../controllers/propertyController");

const {authentication , authorization} = require("../middlewares/auth");
const upload = require("../config/multer");

// Owner Route
router.post("/addProperty" , authentication , authorization("owner") ,upload.array("image" , 5), addProperty);
router.put("/update/:id" , authentication , authorization("owner") , upload.array("image" , 5)  , updateProperty);
router.delete("/delete/:id" , authentication , authorization("owner") ,deleteProperty);
router.get("/my-Property" , authentication , authorization("owner") , getMyProperty);


// public Route 
router.get("/get-all" , authentication , getAllProperty);
router.get("/propertyById/:id" ,authentication , getPropertyById);


module.exports = router;