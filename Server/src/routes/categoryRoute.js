const router = require("express").Router();
const {addCategory , getAll , getCategoryById, updateCategory , deleteCategory} = require("../controllers/categoryControllers");
const {authentication , authorization} = require("../middlewares/auth");

// Admin Route
router.post("/addCategory" , authentication , authorization("admin") , addCategory);
router.put("/update/:id" , authentication , authorization("admin") , updateCategory);
router.delete("/delete/:id" ,  authentication , authorization("admin") , deleteCategory );



router.get("/get-all" , authentication , getAll ) ;
router.get("/get/:id" , authentication , getCategoryById );
module.exports = router;
