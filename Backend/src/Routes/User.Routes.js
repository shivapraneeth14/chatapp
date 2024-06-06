import { Router } from "express";
import { changepassword, logout, register,uploadprofiepic,serachuser,getotherprofile,friends,deletefollowing
  ,followback,checkfriend,getuserbyid,deletemutualfollowing  ,getcurrentuser,Addfriend,Acceptfriend,Declinefriend,getnotifications,getuserid} from "../Controllers/Usercontroller.js";
import { Login,getuserprofile } from "../Controllers/Usercontroller.js";
import verifyjwt from "../Middlewares/auth.middlesware.js";
import upload from "../Middlewares/multer.middlesware.js";


const router = Router()
router.route("/register").post(register);
router.route("/Login").post(Login);
router.route("/Profile").get(verifyjwt,getuserprofile)
router.route("/Logout").get(verifyjwt,logout)
router.route("/Changepassword").post(verifyjwt,changepassword)
router.route("/Profilepic").post(upload.single('profilepic'),verifyjwt, uploadprofiepic)
router.route("/Search").post(serachuser)
router.route("/:username/user/:profilename").post(verifyjwt,getotherprofile)
router.route("/getcurrentuser").post(verifyjwt,getcurrentuser)
router.route("/Addfriend").post(Addfriend)
router.route("/Acceptfriend").post(Acceptfriend)
router.route("/Declinefriend").post(Declinefriend)
router.route("/Notifications").post(getnotifications)
router.route("/Getuserid").post(getuserid)
router.route("/Checkfriend").post(checkfriend)
router.route("/friends").post(friends)
router.route("/Userbyid").post(getuserbyid)
router.route("/Deletemutualfollowing").post(deletemutualfollowing)
router.route("/Followback").post(followback)
router.route("/Deletefollowing").post(deletefollowing)





export default router