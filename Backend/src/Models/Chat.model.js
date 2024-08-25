import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type:String,
    },
    audiourl:{
        type:String,
    },
    audiotext:{
        type:String,

    },
    time: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
