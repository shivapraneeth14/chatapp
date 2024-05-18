import User from "../Models/User.model.js"
import bcrypt from "bcrypt"
import fileUploader from "../Utils/Cloudinary.js";
import { syncIndexes } from "mongoose";
import Friends from "../Models/Friends.model.js";
import Notification from "../Models/Notifications.model.js";

const saltroundes = 10;
async function generatebothtoken(userid){
    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error generating tokens");
    }
}

const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Back end start",username)
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Credentials not provided" });
        }
        const user = await User.findOne({ 
            $or: [
                { username },
                {  email }
            ]
        });
        if (user) {
            console.log(user)
            return res.status(400).json({ message: "User already exists" });

        }
        const hashedpassword = await bcrypt.hash(password,saltroundes)
        if(!hashedpassword){
            return res.status(400).json({message:"password is not hashed"})
        }
        console.log("hased password",hashedpassword)
        const newUser = new User({
            username,
            password: hashedpassword,
            email
        });
        console.log("newuser",newUser)
        const savedUser = await newUser.save();
        if (savedUser) {
            return res.status(201).json({ message: "User created successfully" });
        } else {
            return res.status(500).json({ message: "User not created" });
        }
        console.log("saved",savedUser)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const Login = async (req, res) => {
    const {loginname , password } = req.body;
    console.log(loginname,password)
    if ([loginname, password].some((field) => 
        field?.trim() === ""))
     {
        return res.status(400).json({ message: "Enter the credentials" });
    }
    try {
        const user = await User.findOne({ $or: [{ username: loginname }, { email: loginname }]})
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        console.log("user",user)

        const passwordCorrect = await user.isPasswordCorrect(password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        console.log("correct password")

        const {accessToken,refreshToken} = await generatebothtoken(user._id)
        const loggedinuser = await User.findById(user._id).select("-password")
        console.log("accestoken:",accessToken)
        console.log("refreshtoken:",refreshToken)
        console.log(loggedinuser)
        console.log("login successfull")
       

        res.cookie("accessToken", accessToken, {  secure: true });
        res.cookie("refreshToken", refreshToken, {  secure: true });
        res.status(200).json({ message: "Logged in successfully", accessToken, refreshToken, loggedinuser });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getuserprofile =async (req,res)=>{
    console.log("getting user profile")
 try {
      const user =  await User.findById(req.user._id)
      if(!user){
       res.status(404)
       .json({message:"no user found"})
      }
      console.log("backend successful")
     return res.status(200).json({user})
      
 } catch (error) {
    console.log(error)
    return res.status(400).json({message:"internal sever error"})
 }
}
const logout = async (req, res) => {
    console.log("logging out")
    try {
        // await User.findByIdAndUpdate(
        //     req.user._id,{
        //         $set:{
        //             refreshtoken:undefined
        //         }
        //     },
        //     {
        //         new:true
        //     },
        // )
        const user = await User.findById(req.user._id)
        console.log(user)
        if(!user){
            res.status(400).json({message:"user not found to logout"})
        }
        user.refreshtoken = undefined
        await user.save()
        const options ={
            httpOnly:true,
            secure:true
           }
           return res.status(200)
           .clearCookie("accssToken",options)
           .clearCookie("refreshToken",options)
           .json({message:`${user.username} successfully loggedout`})
           
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const changepassword = async (req, res) => {
    try {
      const { oldpassword, newpassword } = req.body;
      console.log(oldpassword); 
      const user = await User.findById(req.user?._id);
      console.log("user found", user);
      if (!user) {
          console.log("User not found");
          return res.status(404).json({ message: "User not found" });
      }
 
      const isPasswordCorrect = await user.isPasswordCorrect(oldpassword); 
      if (!isPasswordCorrect) {
          console.log("Incorrect old password");
          return res.status(400).json({ message: "Incorrect old password" });
      }
      const newhasedpassword = await bcrypt.hash(newpassword,saltroundes)
      console.log(newhasedpassword)
      if(!newhasedpassword){
         return res.status(400).json({message:"no new password is hashed"})
      }
 
      user.password = newhasedpassword;
      await user.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
     console.error("Password change error:", error);
     return res.status(500).json({ message: "Internal server error" });
    }
 }
 const uploadprofiepic = async (req, res) => {
    try {
        
        // const file = req.body.file; // Assuming the file is sent in the request body
        // console.log("File received in backend:", file);
      const file = req.file.path
      console.log("file in backend",file);
      if (!file) {
        return res.status(400).json({ message: "no file found at backend" });
      }
      const upload = await fileUploader(file);
      if (!upload) {
        return res.status(400).json({ message: "not uploaded at backend"});
      }
      console.log("profile pic added ", upload);
      console.log("req user",req.user)
      const user = await User.findById(req.user?._id);
      console.log("user",user)
      if (!user) {
        return res
          .status(400)
          .json({ message: "no user found on uploading profile pic" });
      }
      user.profilepicture = upload.secure_url;
      await user.save();
      return res.status(200).json({ message: "profile pic updated",imageurl: upload.secure_url },);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "internal server error" } );
    }
  };
  const serachuser=  async (req,res)=>{
   try {
    const searchkey = req.body.searchkey; 
    console.log(searchkey);
     const users = await User.find()
     if(!users){
       return  res.status(400).json({message:"no users in database"})
     }
     const usernames = users.map(user => user.username)
     const filteredresult = usernames.filter(username=> username.toLowerCase().includes(searchkey))
     console.log(filteredresult)
     return res.status(200).json({mesaage:"all users",filteredresult })
   } catch (error) {
   }
  }
  const getotherprofile= async (req,res)=>{
    try {
        const username = req.params.username
        console.log("backend username ",username)
        if(!username){
           return  res.status(400).json({mesaage:"cannot get the profile no username"})
        }
        const user  = await User.findOne({username})
        console.log(user)
        if(!user){
           return res.status(400).json({message:"no user found on the username "})
        }
       return res.status(200).json({user})
    } catch (error) {
        console.log(error)
       return res.status(400).json({message:"internal server error"})
    }

  }
 const getcurrentuser= async (req,res)=>{
    console.log(req.user._id)
   return  res.status(200)
     .json({message:"current user", user:req.user})
 }

 const Addfriend = async (req, res) => {
    console.log("backend")
    try {
        const { userid, friendid } = req.body;
        if(!userid || !friendid){
            return res.status(400).json({message:"user id and frined id not found in backend "})
        }
        const newFriend = new Friends({
            Following: userid,  
            Followers: friendid
        });
       const savedfriend =  await newFriend.save();
       if(!savedfriend){
        return res.status(400).json({message:"saved frined not found in backedn"})
       }
       const requesid = savedfriend._id
       console.log("savedfrined",requesid)

        const newNotification = new Notification({
            userId: friendid, 
            message: 'You have a new friend request'
        });
        const savedNotification = await newNotification.save(); 
        if(!savedNotification){
            return res.status(400).json({message:"saved notification not found in backedn"})
           }
        const notificationId = savedNotification._id;
        console.log("notification id",notificationId)

       return res.status(200).json({ message: 'Friend request sent', friend: newFriend._id, notification: newNotification._id  });
    } catch (error) {
        console.log("Backend add friend", error);
       return res.status(400).json({ message: "Unable to send friend request" });
    }
};

const Acceptfriend = async (req, res) => {
    try {
        const { requestid, notificationid } = req.body;

        const friend = await Friends.findById(requestid);
        friend.status = "accepted";
        await friend.save();
        console.log(friend)

        const notification = await Notification.findById(notificationid);
        notification.read = true;
        await notification.save();
        console.log(notification)

       return  res.status(200).json({ message: "New friend added" });
    } catch (error) {
        console.log("Backend accept friend", error);
       return res.status(400).json({ message: "Unable to accept friend request" });
    }
};

const Declinefriend = async(req,res)=>{
    try {
        const { requestid, notificationid } = req.body;

        const friend = await Friends.findById(requestid);
        friend.status = "declined";
        await friend.save();
        console.log(friend)

        const notification = await Notification.findById(notificationid);
        notification.read = false;
        await notification.save();
        console.log(notification)

       return res.status(200).json({ message: "declined the friend request" });
    } catch (error) {
        console.log("Backend accept friend", error);
       return res.status(400).json({ message: "failed to decline frined request" });
    }

}
const getnotifications= async(req,res)=>{
    const userid = req.user._id;
    try {
        console.log(userid)
        const unreadNotifications = await Notification.aggregate([
          {
            $match: {
              userId: ObjectId(userid),
              read: false
            }
          }
        ]);
       return res.status(200).json(unreadNotifications);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
       return res.status(500).json({ message: 'Error fetching unread notifications' });
      }

}

export {register , Login,getuserprofile,logout,
    changepassword,uploadprofiepic,serachuser
    ,getotherprofile,getcurrentuser,Addfriend,Acceptfriend,Declinefriend,getnotifications};
