const userService = require("../services/user")
const bcrypt = require('bcrypt')
const config = require('../config/config')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const User = require("../models/user_model")

const sendResetPasswordMail = async(username, email, token)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For Reset Password ',
            html: '<p> Hi ' + username + ', please copy the link and <a href="http://localhost:4500/auth/reset-password?token='+token+'"> reset your password </a> '
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Mail has been sent:- ",info.response);
            }
        })
    }catch(error){
        res.status(400).send({success:false,msg:error.message})
    }
}

const register = async(req,res)=>{
    try{
        const user = await userService.createUser(req.body);
        return res.status(200).send({message:"User registered successfully."})
    }
    catch(error){
        return res.status(500).send({error:error.message})
    }
}

const login = async(req,res)=>{
    const {username,password} = req.body;
    console.log(req.body)
    try{
        const user = await userService.getUserByUsername(username)
        console.log(username)
        if(!user){
            return res.status(404).send({message: 'user not found with this username.'})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).send({message: 'Invalid Password...'})
        }

        return res.status(200).send({message:'User login successfully.'})

    }catch(error){
        return res.status(500).send({error:error.message})

    }
}

const forgetPassword = async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});

        if(userData){
            const randomString = randomstring.generate();
            const data = await User.updateOne({email:email},{$set:{token:randomString}})
            sendResetPasswordMail(userData.username,userData.email,randomString);
            res.status(200).send({success:true,message:'Please check your mail and reset your password.'})
        }
        else{
            return res.status(200).send({success:true,message:'This email does not exists.'})
        }

    }catch(error){
        return res.status(400).send({success:false,message:error.message})
    }
}


const resetPassword = async(req,res)=>{
    try{
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            const password = req.body.password;
            const newPassword = await bcrypt.hash(password,8);
            const userData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true})
            res.status(200).send({success:true,message:'User password has been reset.',data:userData})
        }
        else{
            res.status(200).send({success:true,message:'This link has been expired.'})
        }
    }catch(error){
        res.status(400).send({success:false,message:error.message})
    }
}

const getAllUsers = async(req,res)=>{
    let users;
    try{
        users = await User.find();
    } catch(error){
        return res.status(500).send({error:error.message})
    }
    if(!users){
        return res.status(404).send({message: 'No users found.'})
    }
    return res.status(200).send({users});
}


module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
    getAllUsers
}