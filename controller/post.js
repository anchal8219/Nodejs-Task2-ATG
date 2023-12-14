const { default: mongoose } = require('mongoose');
const User = require('../models/user_model');
const Post = require('../models/post_model');
// const { post } = require('../routes/post_route');

const getAllPosts = async(req,res,next)=>{
    let posts;
    try{
        posts = await Post.find();
    }catch(error){
        return res.status(500).send({error:error.message})
    }
    if(!posts){
        return res.status(404).send({message: 'No posts found.'})
    }
    return res.status(200).send({posts})

}


const addPost = async(req,res)=>{
    try{
        const postData = await new Post(req.body);
        const savedData = await postData.save();
        return res.status(200).send({savedData})

    }catch(error){
        return res.status(500).send({error:error.message})
    }
}

// const addPost = async(req,res,next)=>{
//     const {title, description, image, user} = req.body;
//     // console.log('User ID:', user);
//     let existingUser;
//     try{
//         existingUser = await User.findById(user);
//         // console.log('Existing User:', existingUser);
//     }catch(error){
//         return res.status(500).send({error:error.message})
//     }
//     if(!existingUser){
//         return res.status(400).send({message: 'Unable to find user by this id.'})
//     }
//     const post = new Post({
//         title,
//         description,
//         image,
//         user
//     });
//     try{
//         const session = await mongoose.startSession();
//         session.startTransaction();
//         await post.save({session});
//         existingUser.posts.push(post);
//         await existingUser.save({session});
//         await session.commitTransaction();
//         session.endSession();
//     }
//     catch(error){
//         return res.status(500).send({error:error.message})
//     }
//     return res.status(200).send({post})
// }

const updatePost = async(req,res)=>{
    const {title, description} = req.body;
    const postId = req.params.id;
    let post;
    
    try{
        post = await Post.findByIdAndUpdate(postId,{
            title,
            description
        });
    }
    catch(error){
        return res.status(500).send({error:error.message})
    }
    if(!post){
        return res.status(500).send({message:"Unable to update the blog."})
    }
    return res.status(200).send({post})
}


const getById = async(req,res,next)=>{
    const id = req.params.id;
    let post;
    try{
        post = await Post.findById(id);
    }catch(error){
        return res.status(500).send({error:error.message})
    }
    if(!post){
        return res.status(404).send({message: 'Not found.'})
    }
    return res.status(200).send({post})

}

const deletePost = async (req, res, next) => {
    const id = req.params.id;
    let post;

    try {
        // Find the post before deleting to get the user reference
        post = await Post.findById(id).populate("user");

        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }

        // Check if user is defined before proceeding
        if (post.user) {
            // Save the user reference before deleting the post
            const user = post.user;
            if (user.posts) {
                user.posts.pull(post);
                await user.save();
            }
        }

        // Now, delete the post
        await Post.findByIdAndDelete(id);

        return res.status(200).send({ message: 'Post successfully deleted.' });
    } catch (error) {
        console.error('Error in deletePost:', error);
        return res.status(500).send({ error: 'Internal Server Error.' });
    }
};



const getUserById = async(req,res,next)=>{
    const userId = req.params.id;
    let userPosts;
    try{
        userPosts = await User.findById(userId).populate("posts");
    }catch(error){
        return res.status(500).send({error:error.message})
    }
    if(!userPosts){
        return res.status(404).send({message: 'No post found.'})
    }
    return res.status(200).send({posts:userPosts})

}

const likeThePost = async(req,res)=>{

    try{
        const postId = req.params.postId;
        const userId = req.params.userId;

        const postExist = await Post.findById(postId);
        const userExist = await User.findById(userId);
        if(!postExist){
            return res.status(404).send({message: 'Post Not found.'})
        }
        if(!userExist){
            return res.status(404).send({message: 'User Not found.'})
        }

        if(postExist.likedBy.includes(userId)){
            return res.status(404).send({message: 'Post already liked.'})
        }

        if(postExist.dislikedBy.includes(userId)){
            postExist.dislikedBy.pull(userId);
            postExist.dislikes -= 1;
        }

        postExist.likedBy.push(userId);
        postExist.likes += 1;


       
        const savedLikes = await postExist.save();
        return res.status(200).send({savedLikes})

    }catch(error){
        return res.status(500).send({error:error.message})
    }
    


}

const dislikeThePost = async(req,res)=>{

    try{
        const postId = req.params.postId;
        const userId = req.params.userId;

        const postExist = await Post.findById(postId);
        const userExist = await User.findById(userId);
        if(!postExist){
            return res.status(404).send({message: 'Post Not found.'})
        }
        if(!userExist){
            return res.status(404).send({message: 'User Not found.'})
        }

        if(postExist.dislikedBy.includes(userId)){
            return res.status(404).send({message: 'Post already disliked.'})
        }

        if(postExist.likedBy.includes(userId)){
            postExist.likedBy.pull(userId);
            postExist.likes -= 1;
        }

        postExist.dislikedBy.push(userId);
        postExist.dislikes += 1;
       
        const savedDisLikes = await postExist.save();
        return res.status(200).send({savedDisLikes})

    }catch(error){
        return res.status(500).send({error:error.message})
    }
    


}

const addCommentToPost = async (req, res) => {
    const postId = req.params.postId;
    const { text, userId } = req.body;
    console.log(req.body)
    try {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Create a new comment
        const newComment = {
            text,
            user: userId,
        };

        // Add the comment to the post
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        res.status(200).send({ post });
    } catch (error) {
        console.error('Error in addCommentToPost:', error);
        res.status(500).send({ error: 'Internal Server Error.' });
    }
};


module.exports = {
    getAllPosts,
    addPost,
    updatePost,
    getById,
    deletePost,
    getUserById,
    likeThePost,
    dislikeThePost,
    addCommentToPost
}