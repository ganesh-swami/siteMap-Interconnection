import {NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import  logger  from "src/utils/logger"; 
import dbConnect from "../../../../dbConfig/dbConfig";
import User from "../../../../modals/userModal";

export async function POST(request){
    try {
        await dbConnect()
        const reqBody = await request.json()
        const {token,  newPassword} = reqBody // email , oldPassword,

        // console.log(reqBody);
        logger.info('@changepwd token',token);
        let user = null;
        if(token){
             user = await User.findOne({forgotPasswordToken:token});
            if(!user){
                logger.error('@changepwd user not found')
                return NextResponse.json({error: "Something went wrong.",errCode:''}, {status: 400})
            }
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(newPassword, salt)
            const userID = user._id;
            await User.findByIdAndUpdate({
                _id:userID
            }, {
                password:hashedPassword
            });
        }
        // else if(oldPassword){ // need to check if user is logged in so may be create new route
        //      user = await User.findOne({email});
        //     if(!user){
        //         return NextResponse.json({error: "Something went wrong.",errCode:''}, {status: 400})
        //     }
        //     const validPassword = await bcryptjs.compare(oldPassword, user.password)
        //     if(!validPassword){
        //         return NextResponse.json({error: "password is not correct",errCode:'emailPwdNotMatch'}, {status: 400})
        //     }
        // }

        
        return NextResponse.json({
            message:'password changed successfully.',
            success: true,
        })
    } catch (error) {
        // console.log(error);
        logger.error('@changepwd error',error)
        return NextResponse.json({error: error?.message}, {status: 500})

    }
}