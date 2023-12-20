const jwt=require('jsonwebtoken')
require('dotenv').config();

//by using this key, it generates the token
const SECRET_KEY = process.env.SECRET_KEY;
//by using userId , it generates the token
const generateToken=(userId)=>{
    const token = jwt.sign({userId},SECRET_KEY,{expiresIn:"48h"})
    return token;
}

//here token verify wit h the given key whether the token is valid or not
const getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken.userId;
    } catch (error) {
        console.error('Error verifying token:', error.message);
        // Handle the error, such as returning a default user ID or throwing an exception.
        throw new Error('Invalid token');
    }
}


module.exports = {generateToken,getUserIdFromToken}


