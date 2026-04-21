const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async(token)=>{

    if(!token){
        return {
            message : "Please login first, your session is expired",
            logout : true,
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECREAT_KEY)
    const userId = decode.id

    const user = await UserModel.findById(userId).select('-password')

    return user
}

module.exports = getUserDetailsFromToken
