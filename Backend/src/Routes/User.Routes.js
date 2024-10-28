import { Router } from "express";
import {createOrder,deleteitem,storeitems,additem,mystoreitem, changepassword, getuseremail,logout, register,uploadprofiepic,serachuser,getotherprofile,friends,deletefollowing, usernametoid,getMessages,
  followback,checkfriend,getuserbyid,deletemutualfollowing,followerscount,followingcount,audioupload  ,getcurrentuser,Addfriend,Acceptfriend,Declinefriend,getnotifications,getuserid,
  feedback,createownstore,useritems} from "../Controllers/Usercontroller.js";
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
router.route("/Followingcount").post(followingcount)
router.route("/Followersocount").post(followerscount)
router.route("/Transcript").post(upload.single('audio'),audioupload)
router.route("/getuseridbyname").post(usernametoid)
router.route("/getmessages").post(getMessages)
router.route("/sendfeedback").post(feedback)
router.route("/getuseremail").post(getuseremail)
router.route("/createstore").post(createownstore)
router.route("/mystoreitems").post(mystoreitem);
router.route("/useritem").post(useritems);
router.route("/additem").post(upload.single('image'),additem);
router.route("/storeitem").post(storeitems)
router.route("/Deleteitem").post(deleteitem)
router.route("/createOrder").post(createOrder)





export default router