import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    owner: {
        type: String,
        required:true,
    },
    storeName: {
        type: String,
        required: true,
        unique: true,  
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  
       
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,  
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    ownerid:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Store = mongoose.model("Store", StoreSchema);

export default Store;
