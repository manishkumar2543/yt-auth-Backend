import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


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

    const token=jwt.sign({
        id:user._id,
        username:user.username,
    }, config.JWT_SECRET, {expiresIn:'1d'})

    return res.status(201).json({
        message:'User registered successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            
        
        },
        token
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