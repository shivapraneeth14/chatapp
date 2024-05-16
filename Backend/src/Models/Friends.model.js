import mongoose from "mongoose";
import { Schema } from "mongoose";

const FriendsSchema = new mongoose.Schema({
    Following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Followers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending"
        
    }
})

const Friends = mongoose.model("Friends",FriendsSchema)
export default Friends