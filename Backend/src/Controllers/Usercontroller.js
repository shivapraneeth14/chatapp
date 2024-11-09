import User from "../Models/User.model.js"
import bcrypt from "bcrypt"
import fileUploader from "../Utils/Cloudinary.js";
import { syncIndexes } from "mongoose";
import Friends from "../Models/Friends.model.js";
import Notification from "../Models/Notifications.model.js";
import mongoose from "mongoose";
import { AssemblyAI } from 'assemblyai'
import Chat from "../Models/Chat.model.js";
import transporter from "../Utils/Nodemailer.js";
import sgMail from '@sendgrid/mail';
import Store from "../Models/Store.model.js";
import Product from "../Models/Product.model.js";
import { Cashfree } from "cashfree-pg"; 
import axios from "axios"
import Post from "../Models/Post.model.js";
const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg';
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const client = new AssemblyAI({
    apiKey: process.env.ASSLEMBLY_API_KET
  });
  Cashfree.XClientId = process.env.APP_ID
  Cashfree.XClientSecret = process.env.SECRET_KEY
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

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
const getuserprofile = async (req, res) => {
    const { username } =req.query;
    console.log("backend", username);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        console.log("backend successful");
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

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
        const{ profilename} = req.params
        console.log("backend username ",profilename)
        if(!profilename){
           return  res.status(400).json({mesaage:"cannot get the profile no username"})
        }
        const user  = await User.findOne({username:profilename})
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
       const frienddocid = savedfriend._id

        

       return res.status(200).json({ message: 'Friend request sent', frienddocid,savedfriend });
    } catch (error) {
        console.log("Backend add friend", error);
       return res.status(400).json({ message: "Unable to send friend request" });
    }
};

const Acceptfriend = async (req, res) => {
    try {
        const {frienddocid} = req.body;
        console.log("requestid",frienddocid)
        if(!frienddocid ){
            return res.status(400).json({message:"no id s found"})
        }
        const friend = await Friends.findById(frienddocid);
        if(!friend){
            res.status(400).json({message:"no reuqest found"})
        }
        friend.status = "accepted";
        await friend.save();
        console.log(friend)

        

       return  res.status(200).json({ message: "New friend added" });
    } catch (error) {
        console.log("Backend accept friend", error);
       return res.status(400).json({ message: "Unable to accept friend request" });
    }
};
const Declinefriend = async (req, res) => {
    try {
        const { frienddocid } = req.body;
        console.log(frienddocid);

        if (!frienddocid) {
            return res.status(400).json({ message: "No ID found" });
        }

        const objectId = new mongoose.Types.ObjectId(frienddocid);
        const friend = await Friends.findById(objectId);

        if (!friend) {
            return res.status(400).json({ message: "No friend request found" });
        }

        const deletedFriend = await Friends.deleteOne({ _id: objectId });
        console.log(deletedFriend);

        if (deletedFriend.deletedCount === 0) {
            return res.status(400).json({ message: "Failed to delete friend request" });
        }
        
// const notification = await Notification.findById(notificationid);
            // if(!notification){
            //     return res.status(400).json({message:"no id s found"})
            //  }
           
            //     notification.read = false;
            //     await notification.save();
            //     console.log(notification);
        
        
            //     await Friends.deleteOne({ _id: requestid });
            //     await Notification.deleteOne({ _id: notificationid });

        return res.status(200).json({ message: "Declined the friend request" });
    } catch (error) {
        console.log("Backend decline friend error:", error);
        return res.status(400).json({ message: "Failed to decline friend request" });
    }
};

const getnotifications= async(req,res)=>{
    // console.log(req)
    const {userid} = req.body
    console.log('Received userid:', userid);
    if(!userid){
        return res.status(400).json({message:"no id s found"})
    }
    // const id = userid.user._id
    // console.log("userid",id)
    try {
        const friendrequests = await Friends.aggregate([
            {
                $match:{
                    Followers: new mongoose.Types.ObjectId(userid),
                    status:"pending"
                }
            },
            {
                $project:{
                    Following:1,
                    Followers:1,
                    _id:1,
                    status:1
                }
            }

        ])
        console.log("frinedreques",friendrequests)


        // const unreadNotifications = await Notification.aggregate([
        //   {
        //     $match: {
        //       userId: new mongoose.Types.ObjectId(userid),
        //       read: false
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "friends",
        //       localField: "userId",
        //       foreignField: "Followers",
        //       as: "friend"
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       userId: 1,
        //       message: 1,
        //       read: 1,
        //       createdAt: 1,
        //       updatedAt: 1,
        //       friend: {
        //         Following:1,
        //         Followers:1,
        //         _id:1
        //     }
             
        //     }
        //   }
        // ]);
        console.log('Unread Notifications:',friendrequests );
       return res.status(200).json(friendrequests);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
       return res.status(500).json({ message: 'Error fetching unread notifications' });
      }
}

const getuserid =async (req,res)=>{
    console.log("getting user profile")
 try {
    const{username,followerid} = req.body
  
    
      const user =  await User.findOne({
        $or:[{username},{_id:followerid}]
      })
      console.log("backend user",user)
      if(!user && !followerid){
      return  res.status(404)
       .json({message:"no user found"})
      }
      console.log("backend successful")
     return res.status(200).json({user})
 } catch (error) {
    console.log(error)
    return res.status(400).json({message:"internal sever error"})
 }
}
const  getfriend = async(req,res)=>{
    try {
        const {userid,friendid} = req.body;
        const friend = await User.aggregate([
            {
                $match:{
                    _id:"userid"

                }
            },
            {
                $lookup:{
                    from: "friends", 
                    localField: "_id", 
                    foreignField: "Following", 
                    as: "friends"
                }
            }
        ])


    } catch (error) {
        
    }
}
const checkfriend = async(req,res)=>{
    const { userid, friendid } = req.body;
    if(!userid || !friendid){
        return res.status(400).json({message :"no id found"})
    }
    try {
        
        const followback = await Friends.findOne({ Followers: userid, Following: friendid, status: 'accepted' });
        const following = await Friends.findOne({Followers:friendid,Following:userid,status:'accepted'})


        if (followback && following) {
            return res.status(200).json({ isFriend: "mutualfollowing" });
        } else if (following) {
            return res.status(200).json({ isFriend: "following" });
        }else if(followback){
            return res.status(200).json({isFriend: "followback"})
        }
         else {
            return res.status(200).json({ isFriend: "none" });
        }
    } catch (error) {
        console.log("Backend check friend status error:", error);
        return  res.status(400).json({ message: "Failed to check friend status" });
    }

}

const friends = async(req,res)=>{
    const {userid} =  req.body
    console.log("user id for friends",userid);
    if(!userid){
        return res.status(400).json({message:"no userid found"})
    }
    try {
        const userfriends = await User.aggregate([
            {
              $match: {
               _id: new mongoose.Types.ObjectId(userid),
              }
            },
            {
              $lookup: {
                from: "friends",
                localField: "_id",
                foreignField: "Following",
                as: "Following",
                pipeline:[
                  {
                    $match:{
                      status:"accepted"
                    }
                },
                  {
                    $lookup:{
                      from: "users",
                localField: "Followers",
                foreignField: "_id",
                as: "Followingdetails",
                    }
                  }
                ]
              }
            },
            {
               $match: {
               _id: new mongoose.Types.ObjectId(userid),
              }
          },
            {
              $lookup: {
                from: "friends",
                localField: "_id",
                foreignField: "Followers",
                as: "Followers",
                pipeline:[
                  {
                    $match:{
                      status:"accepted"
                    }
                  },
                  {
                    $lookup:{
                       from: "users",
                        localField: "Following",
                        foreignField: "_id",
                       as: "Followerdetails",
                      
                    }
                  }
                ]
              }
            }
          ]
          )
          if(!userfriends){
            return res.status(400).json({message:"no userfrined found"})
          }
          return res.
          status(200).
          json({message:"user friend found",userfriends})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"internal server error"})
    }
}
const getuserbyid= async (req, res) => {
    const { id } = req.body;

    console.log("id", id);

    if (!id) {
        return res.status(400).json({ message: "id not found" });
    }
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "unable to fetch the user" });
    }
};
const deletemutualfollowing = async(req,res)=>{
    try {
        const {userid,friendid} = req.body

        if (!userid || !friendid){
            return res.status(400).json({message:"no ids found"})
        }

        const mefollwing = await Friends.findOne({
            Following:userid,
            Followers:friendid,
            status:"accepted"
        })
        console.log("me following",mefollwing)
        if(!mefollwing){
            return res.status(400).json({message:"no document found in friends"})
        }
        const deletedone = await Friends.deleteOne({_id:mefollwing._id})
        console.log("deletedone",deletedone)
        if(!deletedone){
         return res.status(400).json({message:"not dleted found"})
        }
        return res.status(200).json({message:"deleted mutula following"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:" internal server error in deleted mutual following",error})
    }
}
const followback = async(req,res)=>{
    try {
        const {userid,friendid} = req.body
        if (!userid || !friendid){
            return res.status(400).json({message:"no ids found"})
        }
        const friend = new Friends({
            Following:userid,
            Followers:friendid,
            status:"accepted"
        })
        console.log('friend',friend)

        const savedfolowback =  await friend.save()

        console.log("saved followback",savedfolowback)

        return res.status(200).json({message:"followback succesful"})
         

    } catch (error) {
        console.log(error)
    }
}
const deletefollowing = async(req,res)=>{
    try {
        const {userid,friendid} = req.body
        if (!userid || !friendid){
            return res.status(400).json({message:"no ids found"})
        }
       const mefollwing  = await Friends.findOne({
        Following:userid,
        Followers:friendid,
        status:"accepted"
       })
       if(!mefollwing){
        return res.status(400).json({message:"no doucment found to unfollow"})
       }
       console.log("deletefollowing",mefollwing)
       return res.status(400).json({message:"deleted following "})
    } catch (error) {
        console
        .log(error)
    }
}
const followingcount = async(req,res)=>{
    const {profilename}= req.body
    if(!profilename){
        return res.status(400).json({message:"no name to count "})
    }
    console.log(profilename)
    try {
        const count = await User.aggregate([{
            $match: {
                username: profilename
            }
        },
        {
            $lookup: {
                from: "friends",
                localField: "_id",
                foreignField: "Following",
                as: "Following"
            }
        },
        {
            $addFields: {
                FollowingCount: {
                    $size: "$Following"
                }
            }
        }])
        console.log(count)
        if(!count){
            return res.status(400).json({message:"no count"})
        }
    return res.status(200).json({message:"following count ",count})
    
    } catch (error) {
        console.log(error)
    }
}
const followerscount = async(req,res)=>{
    const {profilename}= req.body
    if(!profilename){
        return res.status(400).json({message:"no name to count "})
    }
    try {
        const count = await User.aggregate([{
            $match: {
                username: profilename
            }
        },
        {
            $lookup: {
                from: "friends",
                localField: "_id",
                foreignField: "Followers",
                as: "Followers"
            }
        },
        {
            $addFields: {
                FollowerCount: {
                    $size: "$Followers"
                }
            }
        }])
        console.log(count)
        if(!count){
            return res.status(400).json({message:"no count"})
        }
    return res.status(200).json({message:"follower count ",count})
    
    } catch (error) {
        console.log(error)
    }
}

const audioupload = async(req,res)=>{
    try {
        // const {audioUrl} = req.body;
        console.log('Received file:', req.file); 
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        console.log('audio file ', req.file)
        const fileUrl = await fileUploader(req.file.path)


        // const fileUrl = await fileUploader(req.file.path)
        console.log("file url",fileUrl);

    
        // const fileUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        console.log("fileurl",fileUrl)
        const transcript = await client.transcripts.transcribe({ audio_url: fileUrl.secure_url,
            
         });
        console.log("transcipt",transcript)
        const transcriptText = transcript.text || 'No text in transcript';
        res.json({ transcription: transcriptText, fileUrl });
      } catch (error) {
        console.error('Error during transcription:', error);
        res.status(500).send('Error during transcription')
      }

}
const getMessages = async (req, res) => {
    try {
        const { userid, friendid } = req.body;
        console.log("getmessages",userid,friendid)
        if (!userid ) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if ( !friendid) {
            return res.status(400).json({ message: " Friend ID is required" });

        }

        const  receivedchat = await Chat.find({
            sender: friendid, receiver: userid     
        }).sort({ time: 1 });

        const sendedmessage = await Chat.find({
        sender:userid,receiver:friendid
        })

        res.status(200).json({
            receivedchat: receivedchat,
            sendedmessage: sendedmessage
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const usernametoid = async (req, res) => {
    try {
      const { username } = req.body;
      console.log("Fetching ID of:   ;;", username);
  
      if (!username) {
        return res.status(400).json({ message: "No username provided to search for messages" });
      }
  
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(400).json({ message: "No user found while searching for messages" });
      }
  
      const userid = user._id;
  
      return res.status(200).json({ message: "User found", userid });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error while fetching the messages" });
    }
  };

  const feedback = async (req, res) => {

    const { from, to, subject, text } = req.body;

    const mailOptions = {
        from,
        to,
        subject,
        text
    };
    console.log(mailOptions)

    try {

        if (! mailOptions) {
            return res.status(400).json({ message: "No feedback message" });
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        if (! info) {
            return res.status(400).json({ message: "No feedback sent" });
        }

        return res.status(200).json({ message: "Feedback  sent" });
    } catch (error) {
        console.error("Error in feedback function: ", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
const getuseremail=async(req,res)=>{
    const {username} = req.body;
    try {
        if(!username){
            return res.status(400).json({message:"no username for email"});
        }
        const user = await User.findOne({username:username});
        if(!user){
            return res.status(400).json({message:"no user found to get email"})
        }
        const email = user.email
        if(!email){
           return res.status(400).json({message:"no email found for the user"})
        }
        res.status(200).json({message:"email found",email})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"INternal server error ",error})
    }
}
const createownstore = async (req, res) => {
    console.log("creating");
    const { owner, storeName, email, description } = req.body;
    console.log("owner", owner);


    try {
        
    const user = await User.findOne({ username: owner });
    if (!user) {
        return res.status(400).json({ message: "No user found while creating the store" });
    }
    console.log("username", user);

    const userid = user._id;
    console.log("userid", userid);

    const store = new Store({
        owner: owner, 
        storeName,
        email,
        description,
        ownerid: userid
    });
    console.log("store", store);
    const savedStore = await store.save();
    console.log("store saved", savedStore);
     
       

        
        user.store = true;
        await user.save();

     
        if (!savedStore) {
            return res.status(400).json({ message: "No store created" });
        }

        return res.status(200).json({ message: "Store created successfully" });
    } catch (error) {
        console.error("Error while creating store:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const additem = async (req, res) => {

    try {
            const { username, name, description, price, stock, category} = req.body;
            const image = req.file;
          
            console.log(username)
            console.log("imagefile",image)
            
            if(!username){
                return res.status(400).json({message:"no user name"})
            }
            console.log("at image processing")
            const Url = await fileUploader(image.path)
            const imageUrl = Url.secure_url;
            console.log(imageUrl)
     
      
            const user = await User.findOne({ username: username });
            console.log("user",user)
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const userid = user._id;
            console.log("user",userid)
            if (!userid) {
                return res.status(404).json({ message: "Store not found" });
            }
    
            const store = await Store.findOne({ ownerid: userid });
            if (!store) {
                return res.status(404).json({ message: "Store not found" });
            }
            console.log("user",store);
            const storeid = store._id;
            if (!storeid) {
                return res.status(404).json({ message: "Store not found" });
            }
            console.log("store",storeid)

            const product = new Product({
                name: name,
                description: description,
                price: price,
                stock: stock,
                imageUrl: imageUrl,
                category: category,
                storeId: storeid,
                ownerid: userid
            });
            console.log("product",product)
            await product.save().catch((err) => {
                console.error("Error saving product:", err);
                return res.status(400).json({ message: "Product save failed", error: err.message });
            });
            console.log("saved")
    } catch (error) {
        
        return res.status(400).json({ message:"INNternal server error" });
    }

  
    
};

const deleteitem = async (req, res) => {
    const { username, productid } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("user",user)

        const userid = user._id;
        console.log("user",userid)
        const store = await Store.findOne({ ownerid: userid });
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        const storeid = store._id;
        console.log("user",storeid)
        const product = await Product.findOneAndDelete({ _id: productid, storeId: storeid });
        console.log("prodcut",product)
        if (!product) {
            return res.status(404).json({ message: "Product not found or does not belong to the store" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal server error" });
    }
};
const mystoreitem = async (req, res) => {
    console.log("processing")
    console.log("Request body:", req.body);
    const { username } = req.body;
        console.log("username");
    try {
        
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("user",user)
        const userid = user._id;
        console.log("user",userid)
        if (user.store) {
            const storeArray = await Store.find({ owner: username, ownerid:userid });
            if (!storeArray) {
                return res.status(404).json({ message: "Store not found" });
            }
            const store = storeArray[0];  
            const storeid = store._id;
            console.log("storeid",storeid)
            const products = await Product.find({ storeId: storeid,ownerid:userid });
            if (!products || products.length === 0) {
                return res.status(404).json({ message: "No products found for this store" });
            }
            console.log("products",products)
            return res.status(200).json({ products });
        } else {
            return res.status(404).json({ message: "User does not own a store" });
        }
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const useritems = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const username = user.username;

        if (user.store) {
            const store = await Store.findOne({ owner: username });
            if (!store) {
                return res.status(404).json({ message: "Store not found" });
            }

            const storeid = store._id;

            const products = await Product.find({ ownerid: userid, storeId: storeid });

            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for this user in the store" });
            }

            return res.status(200).json({ products });
        } else {
            return res.status(404).json({ message: "User does not own a store" });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const storeitems = async(req,res)=>{
    try {
        console.log("fetching products")
        const products = await Product.find()
        if(!products){
            return res.status(400).json({message:"NO products found"})
        }
        return res.status(200).json({message:"products found",products})
    } catch (error) {
        return res.status(500).json({message:"internal severr error"})
    }
}
// const createOrder = async (req, res) => {
//     const { orderDetails } = req.body;
//     const { customerName, customerEmail, customerPhone, amount, productId } = orderDetails;
//     console.log(orderDetails);
//     console.log("backend")

//     const orderPayload = {
//         order_amount: amount,
//         order_currency: 'INR',
//         customer_details: {
//             customer_id: `user_${customerPhone}`, // Unique ID based on phone
//             customer_name: customerName,
//             customer_email: customerEmail,
//             customer_phone: customerPhone,
//         },
//         order_meta: {
//             return_url: `http://localhost:3000/order-confirmation?order_id={order_id}`, // Your frontend return URL
//         },
//         order_note: `Purchase of Product ID: ${productId}`,
//     };

//     try {
//         const response = await axios.post(
//             `${CASHFREE_BASE_URL}/orders`,
//             orderPayload,
//             {
//                 headers: {
//                     'x-api-version': '2023-08-01',
//                     'Content-Type': 'application/json',
//                     'X-Client-Id': process.env.APP_ID,
//                     'X-Client-Secret': process.env.SECRET_KEY,
//                 },
//             }
//         );
//         const { payment_session_id } = response.data;
//         console.log(payment_session_id)
//         res.status(200).json({ payment_session_id });
//     } catch (error) {
//         console.error('Error creating Cashfree order:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to create order' });
//     }
// };
const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, amount, productId,username } = req.body;
        console.log("Received Request:", req.body);

        const orderRequest = {
            order_amount: amount,
            order_currency: "INR",
            order_version: "2023-08-01", 
            customer_details: {
                customer_id: productId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
            },
            order_meta: {
                return_url: `http://localhost:5173/user/${username}/Store`,  
            },
            order_note: `Order for product ID: ${productId}`,
        };

        console.log("Order Request:", orderRequest );

        const response = Cashfree.PGCreateOrder("2023-08-01", orderRequest ).then((response) => {
            console.log('Order Created successfully:',response.data)
            console.log(response.data.payment_session_id)
            if(response.data){
                const payment_session_id = response.data.payment_session_id;
                
        console.log("Payment Session ID:", payment_session_id);
                res.status(200).json({message:"payment_session_id",payment_session_id})
               }
            
        }).catch((error) => {
            console.error('Error:', error.response.data.message);
        });
      

        
    } catch (error) {
        console.error("Error creating order:", error);

        res.status(500).json({
            error: "Failed to create order.",
            details: error.response ? error.response.data : error.message,
        });
    }
};
const addmedia = async (req, res) => {
    try {
      const { description, userid } = req.body;
      const media = req.file;
      
      if (!media) {
        return res.status(400).json({ message: "No file uploaded." });
      }
  
      const mediapath = media.path;
      console.log("media path:", mediapath);
  
      const isVideo = media.mimetype.startsWith("video/");
      const isImage = media.mimetype.startsWith("image/");
      
      if (!isVideo && !isImage) {
        return res.status(400).json({ message: "Invalid file type. Only images and videos are allowed." });
      }
  
      const file = await fileUploader(mediapath);
      const fileUrl = file.secure_url;
  
      const post = new Post({
        userid:userid,
        description:description,
        description:description,
        [isVideo ? "video" : "image"]: fileUrl,
      });
  
      await post.save();
  
      return res.status(201).json({ message: "Media added successfully", post });
  
    } catch (error) {
      console.error("Error in addmedia:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  const finduserid= async(req,res)=>{
    try {
        const { username } = req.query
        if(!username){
            return res.status(500).json({message:"no username"})
        }
        const user = await User.findOne({username:username})
        if(!user){
            return res.status(500).json({message:"no user profile found"})
        }
        res.status(200).json({message:"user found",user})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
        console.log(error)
    }
  }

  const allposts = async(req,res)=>{
    try {
        const posts = await Post.find()
        console.log(posts)
        if(!posts){
            return res.status(500).json({message:"no posts ofund"})
        }
        res.status(200).json({message:"posts found",posts})
    } catch (error) {
        return res.status(500).json({message:"INternal Server Error"})
        console.log(error)
    }
  }





export {allposts,finduserid,addmedia,createOrder,deleteitem,storeitems,additem,useritems,mystoreitem,createownstore,register ,friends, Login,getuserprofile,logout,audioupload,getMessages, usernametoid,feedback,getuseremail,
    changepassword,uploadprofiepic,serachuser,getuserbyid,followerscount,followingcount,deletemutualfollowing,followback,deletefollowing
    ,getotherprofile,getcurrentuser,Addfriend,Acceptfriend,Declinefriend,getnotifications,getuserid,checkfriend};
