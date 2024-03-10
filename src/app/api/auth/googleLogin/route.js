import { NextResponse } from "next/server"; // NextRequest
// import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import  {OAuth2Client} from "google-auth-library";
import logger from "src/utils/logger"; 
import dbConnect from "../../../../dbConfig/dbConfig";
import User from "../../../../modals/userModal";



function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export async function GET(request){
    return NextResponse.json({
        message: "Login successful",
        success: true,
    })
}

export async function POST(request){
    try {
        await dbConnect()
    const reqBody = await request.json()
    const {authCode} = reqBody;
    let redirectURI= 'https://examplesiteMapInterconnectiongen.io'; 
    if(process.env.NEXT_PUBLIC_ENVIRONMENT==='LOCAL'){
        redirectURI ='http://localhost:3001'
    }
    else if(process.env.NEXT_PUBLIC_ENVIRONMENT==='DEV'){
        redirectURI ='https://examplesiteMapInterconnectiongen.io/dev/'
    }
    else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'LIVE') {
        redirectURI ='https://examplesiteMapInterconnectiongen.io/'
    }

    
    
    const oAuth2Client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,process.env.GOOGLE_SECRET,redirectURI);
    const { tokens } = await oAuth2Client.getToken(authCode); // exchange code for tokens
    

    const {id_token} = tokens;
    const { name, email } = parseJwt(id_token)
        

        // upsert is true, this option enables mongoose to create a new entry if there is no existing record matching the filter
        const user = await User.findOneAndUpdate({
            email
        }, {
            name,
            creationType: 2
        }, {
            upsert: true
        });

        console.log(user);

        const tokenData = {
            name: user.name,
            email: user.email,
            roleId:user.roleId,
            isVerified:user.isVerified
        }

        // // create token
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
        return NextResponse.json({error: error.message}, {status: 500})
    }
}