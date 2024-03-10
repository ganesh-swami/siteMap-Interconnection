import {NextResponse } from "next/server";
import logger from "src/utils/logger"; 
import dbConnect from "../../../../dbConfig/dbConfig";
import User from "../../../../modals/userModal";
import { sendEmail } from "../../../../utils/mailer";

export async function POST(request){
    try {
        await dbConnect()
        let message='Mail sent to your registred email.';
        const reqBody = await request.json()
        const {email,verifyToken} = reqBody

        logger.info('@sendEmailVerify ',reqBody);

        // check if user already exists
        
        if(verifyToken){
            // make email verifyied
            const user = await User.findOneAndUpdate({
                verifyToken,
                verifyTokenExpiry : {$gte:new Date().getTime()}
            }, {
                isVerified:true
            });
            logger.info('@sendEmailVerify verified user ',user);
            message='Email verified successfully.'
        }
        else if(email){
                // send verification email
                logger.info('@sendEmailVerify sending Email ',email);
                const user = await User.findOne({email})
                sendEmail({email, emailType: "VERIFY", userId: user._id});
        }
        return NextResponse.json({
            message,
            success: true,
        })
    } catch (error) {
        return NextResponse.json({error: error?.message}, {status: 500})

    }
}