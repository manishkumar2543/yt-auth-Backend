import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";


export async function register(req, res) {
    const { username, email, password } = req.body;
    
    const AllredayRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(AllredayRegistered){
        return res.status(409).json({
            message:'Username or email already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

     const refreshToken=jwt.sign({
        id:user._id,
        username:user.username,
    }, config.JWT_SECRET, {expiresIn:'7d'})
    
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const session = await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers['user-agent']
    })


    const accessToken=jwt.sign({
        id:user._id,
        username:user.username,
    }, config.JWT_SECRET, {expiresIn:'1d'})

   

    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })

    return res.status(201).json({
        message:'User registered successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            
        
        },
        accessToken,
        refreshToken
    })

}
export async function getMe(req,res){
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message:'token not provided'
        })
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }
    return res.status(200).json({
        message:'User fetched successfully',
        user:{
            username:user.username,
            email:user.email
        } 
    })
} 

export async function refreshToken(req,res){
    const refreshToken= req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message:'Refresh token not provided'
        })
    }
    const decoded =jwt.verify(refreshToken, config.JWT_SECRET);

    const accessToken=jwt.sign({
        id:decoded.id,

    },config.JWT_SECRET, {expiresIn:'15m'})
    const newRefreshToken=jwt.sign({
        id:decoded.id,
    },config.JWT_SECRET, {expiresIn:'7d'})
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })
    return res.status(200).json({
        message:'Access token refreshed successfully',
        accessToken
    })
}