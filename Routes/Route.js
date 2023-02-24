const express=require("express")
const router=express.Router();

const {Registeruser,loginUser,Updateuser,getUserdetails,Uploadcertificate,hasUploadcertificate}= require("../Controllers/usercontrollers.js")


  

router.post("/Register", Registeruser )
router.post("/Login", loginUser )
router.put("/Add/:id", Updateuser )
router.get("/Get/:id", getUserdetails )
router.post("/Uploadlifecertificate/:id",Uploadcertificate)
router.get("/hasUploadlifecertificate/:id",hasUploadcertificate)


module.exports = router;
