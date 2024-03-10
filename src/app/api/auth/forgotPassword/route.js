import {NextResponse } from "next/server";
import logger from "src/utils/logger"; 
import User from "src/modals/userModal";
import dbConnect from "../../../../dbConfig/dbConfig";
import { sendEmail } from "../../../../utils/mailer";

export async function POST(request){
    try {
        await dbConnect()
        const message='Email sent successfully.';
        const reqBody = await request.json()
        const {email} = reqBody

        logger.info('@forgotpwd email',email);

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            // send verification email
            sendEmail({email, emailType: "FORGOT", userId: user._id});
        }
        return NextResponse.json({
            message:'Mail sent to your registred email.',
            success: true,
        })
    } catch (error) {
        logger.error('@forgotpwd err',error)
        return NextResponse.json({error: error?.message}, {status: 500})

    }
}