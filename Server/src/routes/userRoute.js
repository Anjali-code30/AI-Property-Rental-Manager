const router = require("express").Router();

const { signup, login, getMyProfile, updateMyProfile, deleteProfile, getAllUsers, deleteAny } = require("../controllers/userController");

const { authentication, authorization } = require("../middlewares/auth");
const upload = require("../config/multer")

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);
router.get("/my-profile", authentication, getMyProfile);
router.put("/update", authentication, upload.single("profileImage"), updateMyProfile);
router.delete("/delete", authentication, deleteProfile);

// Adimn Route
router.get("/getAll", authentication, authorization("admin"), getAllUsers);
router.delete("/deleteAny/:id", authentication, authorization("admin"), deleteAny);




module.exports = router;


