const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type: String,
        default:''
    },
    posts: [{type: mongoose.Types.ObjectId, ref:"Post", required: true}]

})

// creating a table for the above schema
const User = mongoose.model("User",userSchema);
module.exports = User;