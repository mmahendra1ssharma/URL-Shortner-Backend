import { prisma } from "../config/prisma.connect.js";
import bcrypt from 'bcrypt';

export const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({
                message: "Bad Request",
                status: 400
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(existingUser){
            return res.json({
                message: "User already exists",
                status: 409
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const createUser = await prisma.user.create({
            data:{
                name: name,
                email: email,
                password: hashedPassword
            }
        })

        return res.json({
            message: "User registered successfully",
            createUser,
            status: 200
        })
    } catch (error) {
        return res.json({
            message: "Server Error",
            status: 500
        })
    }
}