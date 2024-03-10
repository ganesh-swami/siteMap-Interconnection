import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from "../modals/userModal";


export const sendEmail = async({email, emailType, userId}) => {
    try {
        // create a hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        console.log('sending mail .... ')
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "FORGOT"){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        const transport = nodemailer.createTransport({
            host: "in-v3.mailjet.com",
            port: 2525,
            auth: {
              user: "4b1fbc1482812e551d57b98a4c4713fa",
              pass: "f0a653a24858563fa415d4868a5ff87d"
              // TODO: add these credentials to .env file
            }
          });


        const mailOptions = {
            from: 'ganeshswami018@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions);
        console.log('sending mail mailresponse ',mailresponse)
        return mailresponse;

    } catch (error) {
        throw new Error(error.message);
    }
}