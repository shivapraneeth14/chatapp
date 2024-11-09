import mongoose from 'mongoose'


const PostSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    image: {
        type: String,
        required: false,
      },
     video: {
        type: String,
        required: false,
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    updatedAt: {
        type: Date,
        default: Date.now,
      },
    description: {
        type: String,
        trim: true,
      },
})
const Post =  mongoose.model('Posts',PostSchema)
export default Post;