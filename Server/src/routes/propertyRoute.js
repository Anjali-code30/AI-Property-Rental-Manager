const router = require("express").Router();

const {addProperty , updateProperty} = require("../controllers/propertyController");

const {authentication , authorization} = require("../middlewares/auth");
const upload = require("../config/multer");

// Owner Route
router.post("/addProperty" , authentication , authorization("owner") ,upload.array("image" , 5), addProperty);
router.put("/update/:id" , authentication , authorization("owner") , upload.array("image" , 5)  , updateProperty);


module.exports = router;