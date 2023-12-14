const mongoose=require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
});

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    ],
    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    ],
    comments: [commentSchema], 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

})

// creating a table for the above schema
const Post = mongoose.model("Post",postSchema);
module.exports = Post;