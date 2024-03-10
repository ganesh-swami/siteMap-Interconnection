import {NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import logger from "src/utils/logger"; 
import dbConnect from "../../../../dbConfig/dbConfig";
import User from "../../../../modals/userModal";
import { sendEmail } from "../../../../utils/mailer";


export async function POST(request){
    try {
        await dbConnect()
        const reqBody = await request.json()
        const {name, email, password} = reqBody

        console.log(reqBody);

        // check if user already exists
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        logger.info('@register ',savedUser);

        // send verification email

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success: true,
        })
        
        


    } catch (error) {
        logger.error('@register ',error);
        return NextResponse.json({error: error.message}, {status: 500})

    }
}