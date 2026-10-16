const router = require("express").Router();
const {sendRentalReq , getMyRentalReq , trackMyRentalReq , getReqFromMyProperties , approveRequest , rejectRequest} = require("../controllers/rentalReqController");
const{authentication , authorization} = require("../middlewares/auth");


// User Route
router.post("/send-req" , authentication , authorization("user") , sendRentalReq);
router.get("/getMyRequest" ,authentication , authorization("user") , getMyRentalReq);
router.get("/track/:id", authentication , authorization("user") , trackMyRentalReq);

// Owner Route 
router.get("/property-requests" , authentication , authorization("owner") , getReqFromMyProperties);
router.put("/approve/:id" , authentication , authorization("owner") , approveRequest);
router.patch("/reject/:id",authentication,authorization("owner"),rejectRequest);



module.exports = router;