
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "src/utils/logger"; 
import dbConnect from "../../../../dbConfig/dbConfig";
import User from "../../../../modals/userModal";



export async function POST(request){
    try {
        await dbConnect()
        const reqBody = await request.json()
        const {email, password} = reqBody;
        logger.info('@loginreqBody',reqBody);

        // check if user exists
        const user = await User.findOne({email})
        if(!user?.email || !user?.password){ // for google login there will be no password
            return NextResponse.json({error: "Email and password not matching",errCode:'emailPwdNotMatch'}, {status: 400})
        }
        logger.info('@loginuser exists', user);
        
        
        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Email and password not matching",errCode:'emailPwdNotMatch'}, {status: 400})
        }
        console.log(user);

        if(!user.isVerified){
            return NextResponse.json({error: "unVerifiedEmail", errCode:'unVerifiedEmail'}, {status: 400})
        }
        
        // create token data
        const tokenData = {
            name: user.name,
            email: user.email,
            roleId:user.roleId,
            isVerified:user.isVerified
        }
        // create token
        const accessToken = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        User.findOneAndUpdate({
            email
        }, {
            jwtToken:accessToken,
            jwtTokenExpiry:new Date().getTime()
        });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            accessToken
        })
        return response;

    } catch (error) {
        logger.error('@loginError ',error);
        return NextResponse.json({error: error.message,errCode:'internalErr'}, {status: 500})
    }
}